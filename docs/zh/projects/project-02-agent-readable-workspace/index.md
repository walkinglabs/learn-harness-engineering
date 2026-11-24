# Project 02. 让 agent 看懂项目、接住上次的工作

> 相关讲义：[L03. 让代码仓库成为唯一的事实来源](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [L04. 为什么一个巨大的指令文件会失败](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> 本篇模板文件：[templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh/resources/templates/)

## 你要做什么

P01 证明了准备规则有用。但 P01 的任务一次会话就干完了。真实开发不是这样的——你昨天干了一半，今天开新会话，agent 得从仓库状态里搞清楚"做了什么、没做什么、接下来干什么"。

这个项目要求你给仓库加上"可读性"：让一个全新的 agent 打开仓库后，能快速理解项目结构、知道当前进度、接手上次的工作。具体任务是给知识库应用加上三个功能：文档导入、文档详情页、导入后的本地持久化。这些功能必须跨至少两个 agent 会话完成。

你需要跑两次，两次都从 `starter/` 的同一份代码出发：第一次用 starter 自带的精简 harness，不写交接文件；第二次换成 `solution/AGENTS.md` 里带交接规则的版本，并在会话 A 结束时写出 `session-handoff.md`。每次运行包含两个会话，第二个会话要接住第一个会话没做完的工作。下面的具体步骤让代码、提示词、agent 和停止点保持一致，所以比较的是整套 harness：`AGENTS.md` 里的规则加上交接文件。

## 用什么工具

- Claude Code 或 Codex（和 P01 保持一致）
- Git
- Node.js + Electron
- 文本编辑器（写文档用）

## Harness 机制

让 agent 能读懂的工作区 + 可跨会话保留的状态文件。

## 使用仓库里的项目

仓库路径：[`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| 目录 | 里面有什么 | 怎么用 |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | Project 01 代码，加上未完成的文档导入、详情视图、持久化。文档存在但较薄，没有 `session-handoff.md`。 | 两组都从这里开始。 |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | 完成同一产品切片，并在 [`projects/project-02/solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) 下补齐核心文档（以及 [`feature_list.json`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/feature_list.json)、[`session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md)）。 | 仅供参考。强组只取这里的 `AGENTS.md`，仍从同一份 starter 代码开始。 |

产品功能是文档导入、完整详情/内容加载、跨重启持久化；harness 功能是可交接的 agent-readable workspace。

## 具体步骤

两次运行里只有 harness 可以不同。代码、任务提示词、agent、会话 A 的停止点都保持一致。会话 A 完成文档导入和详情视图，会话 B 完成持久化，与[项目 README](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/README.md) 一致。

**准备工作**

1. 准备两个相互隔离的工作目录，例如 `p02-baseline/` 和 `p02-improved/`。一次只跑一个：跑完两个会话、归档结果、删除该目录，再开始另一个。不要用 git 分支区分两次运行：coding agent 能读到其他分支和同级目录，弱 harness 那次一旦看得到强 harness 的文件，对比就被污染了（和 Project 01 是同一条规则）。
2. 把 [`projects/project-02/starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) 复制到两个目录。这就是"同一个起点"：它基于 Project 01 的 solution，Project 01 的功能已经通过，Project 02 的三个功能在它的 `feature_list.json` 里是 `not-started`。如果你想接着自己做的 Project 01 成果往下做，就把那份快照同样复制进两个目录。关键是两次运行的起始代码完全一致。
3. 两次运行使用同一条任务提示词，例如："实现通过文件选择器导入文档、能加载完整内容的文档详情视图，以及让导入的文档在应用重启后仍然保留的持久化。"
4. 不要把 `solution/docs/`、`solution/feature_list.json`、`solution/session-handoff.md` 复制进任何一个目录。它们描述的是已经完成的导入和内容读取流程，并把所有功能标为 `pass`，等于把答案交给 agent。两次运行都保持 `starter/docs/ARCHITECTURE.md`、`starter/docs/PRODUCT.md`、`feature_list.json` 与 `starter/` 原样一致。

### 第一次运行（弱 harness）

在 `p02-baseline/` 中保持 starter 自带的 harness 原样：精简的 `AGENTS.md`、`docs/`、`feature_list.json`，没有 `session-handoff.md`。不要删这些文件。弱 harness 指的是"薄"，不是"空"。

**会话 A：**

1. 用任务提示词启动 agent。
2. 在文档导入和详情视图都能用、但持久化还没做完时，由你自己结束会话。"能用"指：你启动了应用，通过文件选择器导入一个 `.txt` 或 `.md` 文件，在文档列表里看到它，并打开它看到完整内容；而重启后导入的文档会丢失。第二次运行使用同一标准。
3. 不要要求交接说明或任何其他总结文件。

**会话 B：**

1. 在同一个目录开一个全新的 agent 会话，只说"继续开发"。
2. 记录 agent 花了多久才做出第一个有意义的代码修改，以及每次它重新发现会话 A 本来已经知道的东西（架构、命令、哪个功能做到一半）。

### 第二次运行（强 harness）

在 `p02-improved/` 中，会话 A 开始前，把 `AGENTS.md` 替换为 [`solution/AGENTS.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/AGENTS.md)。它增加了启动规则、文档层级、要求在 `feature_list.json` 里留证据的完成定义，以及会话交接一节。其他文件一律不动。因为 `AGENTS.md` 带的不只是交接规则，这次运行衡量的是整套 harness，会话 B 的差异不能只归因于交接文件。如果要单独检验交接，再加一次运行：保留 starter 的 `AGENTS.md`，只加上会话交接一节。

**会话 A：**

1. 用同一条任务提示词启动 agent。
2. 停在与第一次运行相同的位置（导入和详情视图能用，持久化未完成）。
3. 关闭会话前，让 agent 在仓库根目录写 `session-handoff.md`，格式参考[会话交接模板](./../../resources/templates/session-handoff.md)：已验证的内容、本次改动、损坏或未验证的部分、下一步最优先做什么。[`solution/session-handoff.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md) 是一份写完的示例，但它把所有功能都记为已完成，所以不要直接复制。

**会话 B：**

1. 在同一个目录开一个全新的 agent 会话，只说"继续开发"。读取 `session-handoff.md` 的要求来自 `AGENTS.md`，不是来自你的提示词。
2. 记录与第一次运行相同的指标。

## 怎么衡量结果

| 指标 | 说明 |
|------|------|
| 会话 B 接手时间 | 从开始到第一个有效代码修改的时间 |
| 重新发现次数 | agent 重新了解架构、命令、状态等已有信息的次数 |
| 交接文件质量 | 交接记录是否完整、准确、可操作（仅第二次运行） |
| 重复工作比例 | 会话 B 中有多少工作量是在重复会话 A 已做过的事 |
| 最终完成状态 | 三个功能是否全部完成 |

## 要交什么

- 弱 harness 的会话 A + B 日志/对话记录
- 强 harness 的会话 A + B 日志/对话记录
- 第二次运行用的 `AGENTS.md`，以及 agent 写出的 `session-handoff.md`
- 一份对比笔记：重点比较接手速度和上下文恢复质量

**对应讲义**

- [Lecture 03 — 为什么仓库必须成为唯一事实来源](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md)
- [Lecture 04 — 为什么一个大而全的指令文件不行](../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
- [Lecture 05 — 为什么长任务会丢失连续性](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md)
