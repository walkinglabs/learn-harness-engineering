# 拆解 Pi 的 harness 设计

[Pi](https://pi.dev/)（npm 包 `@earendil-works/pi-coding-agent`）自称 "minimal agent harness"——极简的 agent harness。这句话值得拆开读：它没有自称"最强的 coding agent"，也没有自称"最好用的 AI 编程工具"，而是把自己的定位钉死在 **harness** 这个词上。

这一篇我们用课程的五子系统框架（指令、工具、环境、状态、反馈）来拆 Pi，看它的设计哲学和 Claude Code、Codex 有什么根本不同。答案先给出来：**Pi 的哲学是"内核最小化 + 扩展可编程化"，把上下文工程做进系统提示之外，让使用者（甚至 Pi 自己）去改 harness，而不是让 Pi 替你决定 harness。**

## 一句话定位

Pi 是极简内核：官方定位刻意把内核做小、把决定权交还给你——[pi.dev 首页](https://pi.dev/)的原话是 "Ask Pi to build what you want, or install a package that does it your way"。它把 harness 拆成四层可定制物：

- **扩展（Extensions）**：挂在 Pi 生命周期事件上的 TypeScript 钩子，运行时（runtime）级的可编程面。
- **技能（Skills）**：按需加载的能力包，包含指令和工具，渐进式披露（progressive disclosure）。
- **提示模板（Prompt templates）**：可复用的 Markdown 提示，输入 `/name` 即可展开。
- **主题（Themes）**：TUI 外观。

这个分层思路本身就是一种 harness 设计：**把"模型能看到什么、什么时候能看到"完全交给规则和扩展，而不是写死在内核里。**

## 核心循环

Pi 和所有 coding agent 一样，本质是"推理 → 工具执行 → 观察 → 再推理"的 while 循环。值得注意的不是这个循环本身，而是 Pi 对循环外层的处理：它把上下文管理这件事，从循环内部的"压缩"扩展到了循环之外的"控制"。

Pi 的运行时对外暴露可编程接口——[源码 README 的 Programmatic Usage](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) 里，除了交互式 TUI，还支持脚本化的打印/JSON 模式、RPC 协议与 SDK 嵌入。这决定了同一个 harness 既能被人逐条驱动，也能被 CI/CD 或别的程序自动驱动。它对应课程第十三讲"循环工程"里"从手动驱动到自动循环"的前提：一个 harness 如果只能被人类交互驱动，就永远进不了自动循环。

## 指令子系统：AGENTS.md 与 SYSTEM.md

Pi 对"指令"的处理很克制，但层级清晰：

- **AGENTS.md**：[源码 README 的 Project Context Files](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) 明确写了加载顺序——全局 `~/.pi/agent/AGENTS.md` → 逐级向上遍历父目录 → 当前目录 `./AGENTS.md`（也兼容 CLAUDE.md）。这就是"仓库即事实来源"的贯彻——指令是文件，不是聊天框里的叮嘱。
- **SYSTEM.md**：[pi.dev 官方文档](https://pi.dev/docs/usage/project-context) 里说可按项目替换（replace）或追加（append）默认系统提示。这是 Pi 允许你动"系统提示"的唯一正式入口，也是它的"环境自描述"层。

Pi 官方强调它的系统提示本身是**极简**的。这背后是一个明确的取舍：内核不往里塞"如果……那么……"的长篇规则，而是留出扩展点，让规则以技能和扩展的形式在需要时才出现。这直接呼应课程第四讲"为什么单个巨型指令文件会失败"——Pi 用"内核极简 + 文件拆分 + 按需加载"天然避开了巨型指令的问题。

## 状态与上下文：Pi 拆得最细的地方

Pi 的上下文工程值得重点拆，因为它把课程里"上下文连续性""防止上下文腐化"这些概念落成了具体机制：

**1. 压缩（Compaction）可编程化。** 接近上下文上限时自动把旧消息摘要化——[pi.dev 官方文档](https://pi.dev/docs/usage/sessions)里讲压缩策略本身是**可定制**的：你可以用扩展实现基于话题的压缩、代码感知的摘要，甚至换一个不同的模型来干摘要。源码 README 里也能看到默认机制的细节：自动压缩在两种情况下触发（上下文溢出恢复 / 超过保留阈值），切割点保留最近约 2 万 token，之前的消息被摘要成 "context handoff" 并逐级链式压缩。也就是说，Pi 不把"怎么压缩"当做一个不可改的常数，而是当作 harness 的一部分。

**2. 动态上下文（Dynamic context）。** [pi.dev 官方文档](https://pi.dev/docs/usage/extensions)里说扩展可以在每一轮推理前注入消息、过滤消息历史、实现 RAG、构建长期记忆。这比"上下文满了再压缩"更进一步：它让你在上下文进入窗口之前就决定放什么、不放什么。对应课程里"让 agent 的运行过程可观测、可调试"和"保持上下文连续性"，Pi 把这两件事下沉到了扩展面。

**3. 会话树（Session tree）。** [pi.dev 首页](https://pi.dev/)明确写"会话以树状结构存储（sessions are stored as trees），`/tree` 可以回到任意历史节点继续，所有分支都保存在同一个文件里"。这解决了课程反复强调的"跨会话上下文断裂"问题——不是靠摘要硬接，而是靠结构化的历史重放。分支可以导出为 HTML，或上传为 gist 分享，可观测性也顺带解决了。

## 工具子系统：技能与扩展

Pi 的"工具"分两层：

- **技能（Skills）**：[源码 README 的 Skills 一节](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)定义得很明确——"self-contained capability packages that the agent loads on-demand"，即按需加载的能力包，包含指令和工具，遵循 Agent Skills 标准。渐进式披露让技能详情只在被触发时才进入上下文，**不打爆提示缓存（prompt cache）**。这是成本角度的 harness 设计：上下文里每多一个 token，每次推理都要为它付费；把技能做成按需加载，就是"给地图，不给说明书"的另一种表达。
- **扩展（Extensions）**：挂在内置生命周期事件上的 TypeScript 钩子——[源码 README 的 Hooks 一节](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md)给了四个官方示例用途：拦截危险命令（权限门）、任务切换时 checkpoint 代码状态、保护路径（禁止写 `.env` 等）、修改工具输出后再交给模型、以及从外部（文件监听/Webhook/CI）注入消息唤醒 agent。这些钩子 API 也在 `@mariozechner/pi-coding-agent/hooks` 里导出。社区 harness（[pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness)）则把钩子面进一步封装成 skill-router、session-summary、extract-patterns、telemetry 等现成扩展。

扩展是 Pi 最重要的设计决定：**它不是"给用户几个开关"，而是把运行时内部的事件面全部暴露出来。** 想加记忆？在 `agent/pre-step` 注入。想记录行为？订阅 session 事件。想改模型请求？挂钩 `agent/request`。你可以让 Pi 自己改自己的 harness——这比任何"配置项"都更接近"可编程 harness"的定义。

## 反馈与验证：把"学习"也做成 harness

Pi 本身不自带强制的测试门禁（那是使用者要在 AGENTS.md 里写验证命令的），但社区 harness（[pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness)）用扩展把"反馈回路"结构化了，官方 README 的 Hooks 一节也给出了类似的机制基础：

- **session-summary**（pi-agent-harness 扩展）：维护滚动的 `PROGRESS.md` 条目——这就是课程里的状态子系统，长任务进度跟踪。
- **extract-patterns**（pi-agent-harness 扩展）：从会话中收集经验教训候选，沉淀到 `LESSONS.md`——把"每次会话结束前做好交接"从约定变成了机制。
- **telemetry**（pi-agent-harness 扩展）：记录 token 用量、成本等——可观测性。

同一个社区仓库进一步验证了这个模式：`VISION.md`（目标）、`PROGRESS.md`（进度）、`LESSONS.md`（经验）、`STANDARDS.md`（标准），全部是 Markdown 文件，跨会话持久化。这跟课程推荐的"仓库即事实来源 + 进度文件 + 交接机制"是一模一样的套路，只是被 Pi 的扩展机制变成了开箱即用的层。

## 映射到课程框架

用课程五子系统给 Pi 打分（主观，供对照）：

| 子系统 | Pi 的实现 | 评价 |
| --- | --- | --- |
| 指令 | AGENTS.md 分级加载 + SYSTEM.md | 层级清晰，但规则本身要靠用户写 |
| 工具 | 技能按需加载 + 扩展全生命周期钩子 | 极强，把工具系统做成了可编程面 |
| 环境 | SYSTEM.md 做环境自描述；运行时环境靠用户在 AGENTS.md 里声明 | 机制是开放的，但可复现性依赖用户自述 |
| 状态 | 会话树 + 压缩可定制 + PROGRESS.md | 极强，跨会话与可恢复性是其核心 |
| 反馈 | 验证命令靠用户定义；session-summary / extract-patterns 机制化 | 机制提供，内容靠用户 |

Pi 的取舍和 Claude Code / Codex 形成鲜明对照：Claude Code 把"记忆、权限、子智能体"都做进内核，开箱即用；Codex 把"仓库规范、环境隔离"做成默认；Pi 选择**什么都不替你决定**——它把决定权做成扩展点。代价是你要么自己写扩展，要么装别人写好的包。

## 值得借鉴的设计

1. **压缩策略做成可插拔**。你的 harness 里"上下文怎么压缩"不应该是一个写死的参数，而应该是一个可以替换的策略接口。
2. **用会话树替代硬摘要**。跨会话恢复不一定要靠"上一轮总结"，结构化重放历史往往是更可靠的状态子系统。
3. **提示缓存友好**。按需加载技能、别把全部规则一次性塞进系统提示，既是上下文工程，也是成本工程。
4. **让 agent 能改自己的 harness**。如果 harness 的扩展面够开放，"优化 agent 行为"这件事本身就能由 agent 半自动完成。

## 参考来源（原文 / 源码）

每条论断都能回溯到下面的原文或源码，避免凭印象转述：

- **pi.dev 官网**：定位原话 "Ask Pi to build what you want, or install a package that does it your way"、四层可定制物、会话树（"sessions are stored as trees"，`/tree`、单文件保存、导出 HTML / 分享 gist）。<br/>https://pi.dev/
- **pi.dev 官方文档 · Sessions**：压缩可插拔（topic-based / code-aware / 换摘要模型）、自动压缩与动态上下文注入的机制描述。<br/>https://pi.dev/docs/usage/sessions
- **pi.dev 官方文档 · Extensions**：扩展可在每轮推理前注入消息、过滤历史、做 RAG、构建长期记忆。<br/>https://pi.dev/docs/usage/extensions
- **pi.dev 官方文档 · Project Context**：SYSTEM.md 的 replace / append 语义。<br/>https://pi.dev/docs/usage/project-context
- **Pi Coding Agent 源码 README**（badlogic/pi-mono）：AGENTS.md 三级加载顺序（全局 → 父目录 → 当前目录）、`/compact` 与自动压缩的触发条件与 2 万 token 切割点、Skills 按需加载与 Agent Skills 标准、Hooks 生命周期与四个官方示例用途、Programmatic Usage（JSON / RPC / SDK）。<br/>https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md
- **pi-agent-harness 社区仓库**：skill-router / session-summary / extract-patterns / telemetry 扩展，VISION.md / PROGRESS.md / LESSONS.md / STANDARDS.md 文件体系。<br/>https://github.com/LabidySabidy/pi-agent-harness

相关讲义：[第二讲 · Harness 到底是什么](../../lectures/lecture-02-what-a-harness-actually-is/) ｜ [第五讲 · 让跨会话的任务保持上下文连续](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/) ｜ [第十三讲 · 从手动驱动到自动循环](../../lectures/lecture-13-loop-engineering/)
