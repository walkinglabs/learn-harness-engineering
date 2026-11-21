# 拆解 Codex 的 harness 设计

2026 年 8 月 19 日，OpenAI 在《[Codex as a platform: build on the open agent harness](https://developers.openai.com/blog/codex-as-a-platform)》里宣布：**把驱动 Codex 的整个 harness 以 Apache-2.0 协议全面开源**。这不是又一个 CLI 工具开源——OpenAI 把自家顶级 AI 智能体的"发动机"直接交给了开发者，让你可以在自己的产品、工程工具、运营看板里嵌入完整的智能体循环，而不是把业务流程硬塞进一个通用聊天框。

Codex 可能是四款产品里和"harness 原教旨"绑定最深的一个。那篇定义了整个领域名字的《[Harness Engineering](https://openai.com/index/harness-engineering/)》，本身就是 OpenAI 团队用 Codex 写产品时的经验总结。如今 Codex 把 harness 从"产品里的隐藏层"变成了"开源平台"，等于把那篇文章背后的工程实践连同源码一起公开了。

Codex 的哲学可以浓缩成一句话：**可复用的部分是智能体循环（agent loop），仓库即事实来源，AGENTS.md 只是目录页，工程的价值在于设计环境、表达意图、构建反馈循环。**

## 一句话定位

OpenAI 团队用 Codex 在几周内交付了一个最终上百万行代码的产品，**每一行代码都是 Codex 写的**（原文见 [Harness Engineering](https://openai.com/index/harness-engineering/) 的 "Designing for growth" 一节）。他们的实践回答了一个问题：当工程师的角色从"写代码"变成"设计 harness"时，系统该怎么组织。

如今这套 harness 已经作为开源平台发布，核心是一个 Rust 实现的单体二进制（[github.com/openai/codex](https://github.com/openai/codex)，Apache-2.0，Rust 占 96.4%）。它管理会话状态、流式执行、工具调用，强制配置好的沙箱与审批策略，并把工作跨回合地推进。它对 harness 的贡献主要在**约定（convention）**、**上下文工程**和**可嵌入的智能体循环**上，而不是花哨的扩展点。

## harness 的价值：ARC-AGI-3 的硬数据

在拆架构之前，先看 OpenAI 用来证明"harness 设计能改变结果"的一组数据（见《[How enabling two settings tripled our scores on the ARC-AGI-3 benchmark](https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores/)》，2026 年 7 月）：

在难度极高的 ARC-AGI-3 基准测试中，官方 harness 用了滚动截断（rolling truncation）并丢弃每步的推理过程。OpenAI 只做了两项调整——**保留推理（retained reasoning）** 和 **上下文压缩（compaction）**——GPT-5.6 Sol 的得分就从 **13.3% 飙升到 38.3%**（约 3 倍），同时**输出 token 减少了 6 倍**。

这个结果直接说明了课程的核心论点：评测很少只测模型，它也测了一堆看不见的 API 设置、harness 设计和提示工程。这两项设置（保留推理 + 压缩）正是 Codex 在生产环境里默认部署的方式——好的 harness 设计甚至能让模型脱胎换骨。

## 平台架构：三层集成入口

Codex 开源后最大的变化是：它不再只是一个 CLI 工具，而是一个可以选择集成深度的平台。OpenAI 官方把集成入口分成三层（见《[Codex as a platform](https://developers.openai.com/blog/codex-as-a-platform)》的 "Choose the right integration layer" 一节）：

- **`codex exec`（非交互执行）**：跑脚本、CI 任务、一次性后台任务。运行一个有边界的 agent 工作流，返回结构化输出。支持 `--json`（JSON Lines 事件流）、`--output-schema`（按 JSON Schema 约束最终输出）、`--sandbox`（沙箱策略）、`--ephemeral`（不持久化会话）。这是"简单、粗暴、高效"的自动化入口。
- **Codex SDK（编程式接口）**：支持 TypeScript / Python，用代码启动、恢复或流式传输 Codex 任务。适合需要精准控制线程与任务生命周期的应用程序。
- **Codex app-server（产品嵌入）**：当 agent 需要成为产品本身的一部分时使用。通过文档化的 JSON-RPC 2.0 客户端协议，让应用连接到本地 Codex 进程，保持对话开启、流式接收事件、中断工作、暴露工具、响应审批请求。

三层共享同一个开源 harness 内核。开源层是 harness 和集成面；模型访问与托管服务保持独立。

### 开源组件地图

| 组件 | 位置 | 是否开源 |
| --- | --- | --- |
| Codex CLI | [openai/codex](https://github.com/openai/codex) | 是（Apache-2.0） |
| Codex SDK | [openai/codex/sdk](https://github.com/openai/codex/tree/main/sdk) | 是 |
| Codex App Server | [openai/codex/codex-rs/app-server](https://github.com/openai/codex/tree/main/codex-rs/app-server) | 是 |
| Skills（可复用技能） | [openai/skills](https://github.com/openai/skills) | 是 |
| Universal 云环境 | [openai/codex-universal](https://github.com/openai/codex-universal) | 是 |
| IDE 扩展 | — | 否 |
| Codex Web | — | 否 |

（详见官方《[Open Source](https://developers.openai.com/codex/open-source)》页面。）

## 指令子系统：AGENTS.md 是目录页，不是百科全书

这是 Codex 对 harness 理论最有影响力的一条设计：

> 单个巨型指令文件不利于机械化检查（覆盖率、更新状态、所有权、交叉链接），偏离现实的情况无法避免。因此我们不再把 AGENTS.md 视为百科全书，而是将其视为**目录页**。代码库知识位于结构化的文档中，AGENTS.md 负责指向它们。

（以上是 [《Harness Engineering》原文](https://openai.com/index/harness-engineering/) 中 "AGENTS.md should be a directory page" 一节的直接转述。）

课程第四讲说"单个巨型指令文件会失败"，Codex 直接给出了正解：AGENTS.md 控制在 100 行左右（原文建议约 100 行，接近上限就拆到 `docs/`），放不下就拆分到 `docs/` 目录，让 agent 按需去读。这是"给地图，不给说明书"的权威出处。

配套的原则叫**执行不变量，不要微管实现**（原文："don't micromanage the implementation；focus on invariants"）：AGENTS.md 只写不可违反的硬约束和验证命令，具体怎么实现交给模型。这直接对应课程第二讲"约束而非微操"。

## 上下文子系统：Write-Select-Compress-Isolate

Codex 的上下文工程可以概括为四个策略，这是社区在 "context engineering" 成为独立学科后总结出来再映射回 Codex 的框架（框架出处见 [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)）：

- **Write（写出去）**：把上下文持久化到窗口之外——结论写进文档、状态写进文件，而不是留在对话里。对应"仓库即事实来源"。
- **Select（选进来）**：只把需要的 token 拉进窗口——AGENTS.md 指路、按需读文件，而不是全仓塞进去。
- **Compress（压缩）**：保留真正重要的——Codex 有自动压缩和手动 `/compact`，可以自定义 `compact_prompt`。上面 ARC-AGI-3 的数据已经证明：把滚动截断换成压缩，模型就能更好地跨长任务保留学到的知识，用更少的 token 拿更高的分。
- **Isolate（隔离）**：把上下文切到不同边界——用子智能体（subagent）隔离不同任务的上下文，一个前端子智能体永远看不到后端的数据库 schema。

社区对 [codex-harness-internals](https://github.com/AlexKenbo/codex-harness-internals) 的源码分析还揭示了一个很细的环境上下文设计：`build_environment_update_item` 只在环境变化时输出**变更字段**（CWD、git 分支、文件系统），而不是每轮都把完整系统上下文粘一遍。这是"上下文里不养重复 token"的工程细节。

## app-server：把智能体循环变成可嵌入的协议

app-server 是这次开源最耀眼的组件。它让 Codex 不再是"你打开的一个工具"，而是"嵌入你产品里的引擎"。它的设计直接体现了"harness 的可复用部分是智能体循环"这一理念。

**协议设计。** app-server 采用 JSON-RPC 2.0 消息（线上省略 `"jsonrpc":"2.0"` 头），和 [MCP](https://modelcontextprotocol.io/) 一样支持双向通信。支持的传输方式包括：`stdio`（换行分隔 JSON，默认）、`websocket`、Unix socket、`off`。客户端可以生成对应版本的 TypeScript schema 或 JSON Schema bundle，保证类型与版本精确匹配。

**三个核心原语。** 这是 app-server 对"harness 该暴露什么"的回答（详见官方《[app-server 文档](https://developers.openai.com/codex/app-server)》）：

- **Thread（线程）**：用户与 agent 之间的一段对话。线程包含多个 Turn。支持 `thread/start`（新建）、`thread/resume`（恢复）、`thread/fork`（分支历史到新线程）、`thread/rollback`（丢弃最近 N 个回合）、`thread/compact/start`（触发历史压缩）。
- **Turn（回合）**：一次用户请求及随后的 agent 工作。支持 `turn/start`（开始）、`turn/steer`（向进行中的回合追加输入）、`turn/interrupt`（请求取消）。回合结束时发出 `turn/completed`。
- **Item（条目）**：输入或输出的最小单位——用户消息、agent 消息、命令执行、文件变更、工具调用等。

**生命周期控制。** 连接后先 `initialize` 握手，再 `initialized` 确认；然后 `thread/start` 开会话、`turn/start` 驱动对话、持续读取 stdout 上的通知流（`item/started`、`item/completed`、`item/agentMessage/delta` 等）。这套生命周期把"会话状态管理 + 流式执行 + 审批处理"做成了可编程的运行时控制——产品团队可以决定 agent 在哪跑、能访问哪些文件、哪些操作要审批、怎么观察、结果怎么回到事实来源。

## 工具与边界：worktree 隔离 + 子智能体 + 沙箱

Codex 的核心 harness 机制：

**1. git worktree 隔离环境。** [《Harness Engineering》原文](https://openai.com/index/harness-engineering/) 的 "Environment" 一节写明：每个任务在独立的 git worktree 里运行，配合本地的可观测性栈（日志、指标、追踪），让每个变更都在独立环境中验证。这就是课程第七讲"给 agent 划清每次任务的边界"的物理实现——边界不是靠指令恳求，而是靠环境隔离强制。

**2. 沙箱与审批策略。** 开源后这些控制变成了可配置的运行时策略。`codex exec` 默认只读沙箱，可选 `--sandbox workspace-write`（允许编辑）或 `--sandbox danger-full-access`（完全访问，仅在隔离的 CI 容器里用）。app-server 则让宿主应用决定 agent 能访问哪些文件和工具、哪些操作需要审批。审批策略和计划模式（plan mode）把"任务边界"和"人类决策权"变成了运行时控制。

**3. 内核级子智能体。** Codex 的 `spawn_agent` / `wait_agent` 是内核级工具：模型显式地创建子智能体、给它独立的会话历史与工具集、等待结果。子智能体继承父级的 AGENTS.md 指令，但运行在**自己的上下文**里。配置放在 `.codex/agents/*.toml`，可以指定不同模型和指令（细节见 [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/) 的 Sub-agents 一节）。这是"上下文隔离"的直接实现——也是课程第十二讲"交接"精神的体现：每个子智能体是一个有清晰边界的工作单元。

## 反馈子系统：验证命令写进规范

OpenAI 实践里最强调的一点：在 AGENTS.md 里显式列出验证命令，把"怎么确认做对了"变成仓库的一部分。Codex 的工程流程里，测试、CI、文档、可观测性配置——全部由 Codex 生成，并且全部是"可执行的验证路径"。模型能力强但不可靠的解法，不是祈祷模型自觉，而是让**验证路径成为 harness 的默认组件**。

`codex exec` 在 CI 里的用法就是这个理念的产品化：它可以跑有边界的 agent 工作流、输出 JSON Lines 事件流、按 JSON Schema 约束最终输出，天然适合接进 CI 流水线做自动修复。OpenAI 官方还提供了 [openai/codex-action](https://github.com/openai/codex-action) GitHub Action，专门为 CI 场景降低了 API key 暴露风险。

## 围绕真实工作流构建软件

OpenAI 在《Codex as a platform》里反复强调的一个观点，值得单独拎出来：

> 与其要求每个团队把他们原本熟悉的工作流搬进一个通用代码助手，不如把 agent 带进那些围绕真实工作设计的软件里。

安全分析师看的是预警队列、受影响的服务状态；客服工程师看的是账户历史、产品日志；产品经理看的是需求看板。对这些真实的打工人来说，重要的不是那个聊天框，而是他们眼前的业务看板——**界面本身就是最重要的上下文**。

OpenAI 用一个叫 Relay 的示例应用演示了这种模式：在虚构的发货看板旁嵌入 Codex agent，连接应用拥有的 MCP 工具，凡是有后果的写入操作都需要人类审批。harness 负责智能体循环、会话状态、流式活动和工具交互；产品继续拥有自己的看板、记录和控制。GitHub、JetBrains、Cisco 等已经在公开实现中采用了这种集成模式。

## 映射到课程框架

| 子系统 | Codex 的实现 | 评价 |
| --- | --- | --- |
| 指令 | AGENTS.md 目录页 + docs/ 拆分 + 执行不变量 | 教科书级，定义了"给地图不给说明书" |
| 工具 | codex exec / SDK / app-server 三层入口 + MCP + 沙箱策略 | 从 CLI 到产品嵌入，集成深度可选 |
| 环境 | 独立 worktree + 可观测性栈 + 沙箱策略 | worktree 隔离是其招牌 |
| 状态 | Write 策略 + Thread/Turn/Item 原语 + 压缩 + fork/rollback | 依赖约定而非内建记忆，app-server 补齐了会话生命周期管理 |
| 反馈 | 验证命令入规范 + 审批策略 + plan mode + CI 自动修复 | 反馈路径默认化，值得抄 |

Codex 和 Claude Code 的对比很有意思：Claude Code 是"加法"——把记忆、权限、子智能体全做进内核；Codex 是"减法"——内核尽量克制，把更多责任放在仓库约定和上下文工程上。开源之后，Codex 又往前走了一步：把"harness 该暴露什么"做成了一个有协议、有原语、有生命周期的可嵌入平台。这也是为什么社区常说"Codex 的 harness 哲学比它的代码更值钱"——而现在代码也开源了。

## 值得借鉴的设计

1. **AGENTS.md 当目录页写**：控制在 100 行左右，指向 docs/ 里的细节，可机械化检查。
2. **只写不变量，不微管实现**：硬约束 + 验证命令，剩下的交给模型。
3. **保留推理 + 压缩**：别用滚动截断丢弃模型刚想的思路，用压缩保留学到的知识——ARC-AGI-3 的 3 倍提升就是证据。
4. **用 worktree 做环境隔离**：任务边界靠环境强制，不靠指令恳求。
5. **环境上下文只传增量**：每轮只输出变更字段，别重复粘贴完整系统上下文。
6. **把智能体循环做成可嵌入的协议**：Thread/Turn/Item 原语 + 生命周期控制，让产品拥有界面和审批，harness 只负责底层循环。
7. **子智能体做上下文隔离**：拆任务的同时拆上下文，别让子任务污染主循环。

## 参考来源（原文 / 源码）

每条论断都能回溯到下面的原文或源码，避免凭印象转述：

- **OpenAI《Codex as a platform: build on the open agent harness》**（2026-08-19）：harness 全面开源、三层集成入口（exec / SDK / app-server）、可复用部分是智能体循环、围绕真实工作流构建软件、Relay 示例、GitHub/JetBrains/Cisco 集成案例。本篇平台架构部分的主要出处。<br/>https://developers.openai.com/blog/codex-as-a-platform
- **OpenAI《How enabling two settings tripled our scores on the ARC-AGI-3 benchmark》**（2026-07-29）：保留推理 + 压缩让 GPT-5.6 Sol 从 13.3% 升到 38.3%、输出 token 减少 6 倍的硬数据。<br/>https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores/
- **OpenAI《Harness Engineering》**：AGENTS.md 目录页与约 100 行建议、executive invariants / don't micromanage、worktree 隔离 + 可观测性栈、验证命令入规范、上百万行产品案例。本篇核心论断的主要出处。<br/>https://openai.com/index/harness-engineering/
- **Codex app-server 官方文档**：JSON-RPC 2.0 协议、传输方式、Thread/Turn/Item 原语、生命周期（initialize → thread/start → turn/start → 流式事件 → turn/completed）、fork/rollback/compact 等会话控制 API。<br/>https://developers.openai.com/codex/app-server
- **Codex 非交互模式官方文档**：`codex exec` 的 `--json`、`--output-schema`、`--sandbox`、`--ephemeral`、resume 等 CI 集成细节。<br/>https://developers.openai.com/codex/non-interactive-mode
- **Codex 开源组件指南**：CLI / SDK / app-server / Skills / codex-universal 的开源位置与开源状态。<br/>https://developers.openai.com/codex/open-source
- **Codex CLI 开源仓库**（Rust 实现的单体二进制，Apache-2.0）：<br/>https://github.com/openai/codex
- **OpenAI 官方《AGENTS.md》规范**（AGENTS.md 作为跨工具约定的标准）：<br/>https://openai.com/index/agents-md/
- **Context Engineering for Codex CLI**（社区）：Write-Select-Compress-Isolate 框架、`/compact` 与 `compact_prompt`、`spawn_agent` / `wait_agent` 子智能体与 `.codex/agents/*.toml` 配置。<br/>https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/
- **codex-harness-internals**（社区源码分析）：`build_environment_update_item` 增量环境上下文等实现细节。<br/>https://github.com/AlexKenbo/codex-harness-internals

相关讲义：[第三讲 · 让代码仓库成为唯一的事实来源](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [第四讲 · 把指令拆分到不同文件里](../../lectures/lecture-04-why-one-giant-instruction-file-fails/) ｜ [第七讲 · 给 agent 划清每次任务的边界](../../lectures/lecture-07-why-agents-overreach-and-under-finish/)
