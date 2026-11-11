# 拆解 DeepSeek Harness 的设计

[DeepSeek Harness](https://deepseek.com/harness)（命令名 `dsh`，仓库 `deepseek-ai/deepseek-harness`）2026 年 8 月以 Developer Preview 形式发布，官方给它的定义很直接：**Agent = Model + Environment + Tools + State**——模型、环境、工具、状态，四件套。

如果前三个产品的拆解是在问"harness 应该怎么设计"，DeepSeek Harness 问的是更激进的问题：**harness 能不能脱离具体模型，成为一种独立的运行时？** 它的答案是能，而且把这件事做到了极致——[架构文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)的原话是：*Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself*（产品的每一部分都是插件，包括模型适配器、工具注册表、会话日志，甚至 agent 循环本身）。

这一篇我们拆它，重点看三件事：插件化的内核、能力接缝（capability seam）、事件流水线，以及那条最强的工程约束"Model-visible means logged"。

## 一句话定位

传统 coding agent 的结构是"LLM + 固定的 agent 循环 + 固定的工具集"。DeepSeek Harness 的结构是"模型 + 一个插件内核（Cordis）"，内核只负责插件的加载、卸载、依赖关系和事件机制，**不拥有任何 agent 的具体能力**——[架构文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)的原话是 "There is no privileged core to patch"（不存在需要打补丁的特权内核），"you extend dsh by mounting a plugin beside the others"（在旁挂载一个插件即可扩展，而不必改内核）。这意味着连 agent 循环本身都不是神圣不可修改的——你可以用 DeepSeek 的模型、接 Claude Code 的子智能体、上远程沙箱、写自定义记忆、换自定义循环、换自定义 UI，拼成一个全新的 agent。

这是对课程"模型权重之外的一切都是 harness"这句话的最彻底贯彻：既然 harness 是独立的，那就让它独立成一个操作系统。

## 架构核心 1：能力接缝（Capability Seam）

DeepSeek Harness 用 Service 表示"能力"，几乎每项能力都拆成三层：

```
Service Definition（能力定义）
        ↓
Service Provider（能力提供者）
        ↓
Consumer（能力消费者）
```

以文件系统为例：`FS Service` 下面是 Local FS、E2B FS、Remote FS 多个 Provider，对上统一暴露成 file tools。Shell、Subprocess、Sandbox、Web、LLM、SubAgent 都是同一套结构。这套三层结构不是我们总结的——[架构文档 · Capability seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)原文就是：*a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool*（能力接缝 = 可替换的能力，三个角色：声明接口的 Service Definition、实现它的 Service Provider、使用它的 Consumer，后者通常是模型面对的工具）。

这解决了一个 harness 工程里长期存在的问题：**agent 到底应该依赖"具体工具"，还是依赖"能力接口"？** DeepSeek Harness 选择后者。对课程而言，这意味着"工具子系统"被标准化成了接口——换一个 Provider，工具对模型暴露的样子不变，但环境彻底变了。

## 架构核心 2：事件流水线（Event Pipeline）

DeepSeek Harness 内部不是简单的"LLM → 工具 → LLM"，而是一条事件流水线，每一个环节都是一个可被插件监听的事件点：

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → 下一轮
```

（上面的流水线是 [架构文档 · Turn flow](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) 一节的转写：`turn/*`、`step/*`、`user/message`、`assistant/*`、`tool/*` 是持久化会话事件，`agent/pre-step`、`agent/request`、`llm/stream`、`tools/*` 是可供插件监听的扩展点。）

这个设计最大的好处：**大量功能根本不用修改 agent 循环本身**。想在工具执行前做安全检查？监听 `tools/pre-execute`。想加记忆？在 `agent/pre-step` 注入。想记录行为？订阅 session 事件。想改模型请求？挂钩 `agent/request`。想决定是否继续推理？监听 `agent/turn-stopping`。

对比课程第十一讲"让 agent 的运行过程可观测"，DeepSeek Harness 走得更远：它不是"把日志加上"，而是把**循环的每一步都变成事件点**，让可观测、权限、记忆、策略全部以监听者的身份挂在循环上，而不是写死在循环里。

## 架构核心 3：Session Event Log 与 "Model-visible means logged"

DeepSeek Harness 有一个 **append-only 的 Session Event Log（只追加的会话事件日志）**，并且定了一条极强的工程约束。[架构文档 · Session log](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)的原文是：

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

（凡模型能看到的，都必须被记录。任何进入模型请求的东西都必须能从日志重建，而且有一条运行时不变量在强制检查这一点。）

换句话说，可观测性不是事后补的日志，而是 harness 的第一性约束：任何进入模型上下文的东西，默认就该留下日志。这直接呼应收官之夜的"可观测性属于 harness 内部"，并且把"append-only"这个存储设计做成了原则——日志只追加、不覆写，会话状态可重放。

## 映射到课程框架

| 子系统 | DeepSeek Harness 的实现 | 评价 |
| --- | --- | --- |
| 指令 | 插件化；规则/技能均以插件形态注入 | 极自由，但没有内置的"CLAUDE.md"式惯例 |
| 工具 | Service Definition → Provider → Consumer 能力接缝 | 工具子系统标准化的极致 |
| 环境 | 沙箱/FS/Shell 全部可换 Provider（含远程 E2B） | 环境彻底可插拔 |
| 状态 | append-only Session Event Log + Model-visible means logged | 可观测性是第一性约束 |
| 反馈 | tools/pre-execute 上的 permission / guard / policy / hook | 反馈机制事件化 |

DeepSeek Harness 和其他三款产品的根本区别：Pi、Claude Code、Codex 都是在"一个具体的 agent"内部优化 harness；DeepSeek Harness 则把 harness 定义成**独立于模型的操作系统**，agent 本身只是这套 OS 上的一个可替换应用。代价也很明显——自由度高意味着配置成本高，这是"harness 即 OS"这套设计的固有另一面（开发者预览阶段也以"先尝鲜、机制尚在演进"为定位）。

## 值得借鉴的设计

1. **把循环的每一步变成事件点**：权限、记忆、策略、日志都作为监听者挂在循环上，而不是写死在循环里。
2. **能力接缝标准化**：依赖"能力接口"而不是"具体工具"，环境可以整块替换而不影响模型看到的工具面。
3. **Model-visible means logged**：凡模型能看到的必须被记录，把可观测性从"加分项"变成"第一性约束"。
4. **append-only 会话日志**：状态可重放，交接可靠，这是"每次会话留下干净状态"的工程化保证。

## 参考来源（原文 / 源码）

每条论断都能回溯到下面的原文或源码，避免凭印象转述：

- **DeepSeek Harness 官网**：产品定义 "Agent = Model + Environment + Tools + State"、Developer Preview 定位与 `dsh` 命令。<br/>https://deepseek.com/harness
- **deepseek-ai/deepseek-harness 仓库**（命令 `dsh`，MIT 协议）：<br/>https://github.com/deepseek-ai/deepseek-harness
- **架构文档 architecture.md**：本篇最核心的出处——"Every part of the product is a plugin"、"There is no privileged core to patch"、Turn flow 事件流水线、Capability seams 三层角色、"Model-visible means logged" 与运行时不变量、append-only Session Event Log、fs/tools/telemetry 等能力接缝与 `ctx.*` 子系统。<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **架构文档 · 配套子文档**：Cordis 内核简介（plugins contribute services, typed events, reversible effects）、能力接缝细节、Session 子系统。<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

相关讲义：[第十一讲 · 让 agent 的运行过程可观测](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [第十二讲 · 每次会话结束前都做好交接](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [第二讲 · Harness 到底是什么](../../lectures/lecture-02-what-a-harness-actually-is/)
