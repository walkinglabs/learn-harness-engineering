# Project 02. 让 agent 看懂项目、接住上次的工作

> 相关讲义：[L03. 让代码仓库成为唯一的事实来源](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [L04. 为什么一个巨大的指令文件会失败](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> 本篇模板文件：[templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh/resources/templates/)

## 你要做什么

P01 证明了准备规则有用。但 P01 的任务一次会话就干完了。真实开发不是这样的——你昨天干了一半，今天开新会话，agent 得从仓库状态里搞清楚"做了什么、没做什么、接下来干什么"。

这个项目要求你给仓库加上"可读性"：让一个全新的 agent 打开仓库后，能快速理解项目结构、知道当前进度、接手上次的工作。具体任务是给知识库应用加上三个功能：文档导入、文档详情页、导入后的本地持久化。这些功能必须跨至少两个 agent 会话完成。

你需要跑两次。第一次不给 agent 任何帮助，看它在第二个会话里要花多久才能"接上"。第二次提前放好 `ARCHITECTURE.md`、`PRODUCT.md`、`session-handoff.md`，让它快速对齐上下文。

## 用什么工具

- Claude Code 或 Codex（和 P01 保持一致）
- Git
- Node.js + Electron
- 文本编辑器（写文档用）

## 具体步骤

### 准备工作

1. 基于 P01 完成后的代码，从同一个 commit 出发。
2. 创建两个分支：`p02-baseline` 和 `p02-improved`。
3. 列出要实现的三个功能：文档导入流程、文档详情视图、文档持久化。两条分支任务范围完全一致。

### 第一次运行（弱 harness）

切到 `p02-baseline` 分支。

**会话 A：**

1. 启动 agent，只给任务描述，不给架构文档，不给进度文件。
2. 故意在功能完成之前停止会话（比如只完成文档导入）。
3. 不写任何交接文件。直接结束。

**会话 B：**

1. 开一个全新的 agent 会话。
2. 只说"继续开发"，不给额外上下文。
3. 记录 agent 花了多久才做出第一个有意义的代码修改。
4. 记录 agent 哪些时候在"重新发现"本来已经知道的东西。

### 第二次运行（强 harness）

切到 `p02-improved` 分支。在第一个会话之前，先在仓库里准备好：

- `ARCHITECTURE.md`：描述项目结构、Electron 各层职责、数据流
- `PRODUCT.md`：描述产品功能范围和当前阶段目标
- `AGENTS.md`：启动命令、工作规则、验证方式
- `init.sh`：一键恢复可运行状态

**会话 A：**

1. 启动 agent，让它开始工作。
2. 同样在功能完成之前停止。
3. **这次要求 agent 更新 `session-handoff.md`**：记录做了什么、没做什么、下一步是什么。

**会话 B：**

1. 开一个全新的 agent 会话。
2. 让 agent 读 `session-handoff.md` 和 `feature_list.json`，然后继续。
3. 同样记录接手速度和重复工作比例。

## 怎么衡量结果

| 指标 | 说明 |
|------|------|
| 会话 B 接手时间 | 从开始到第一个有效代码修改的时间 |
| 重新发现次数 | agent 重新了解架构、命令、状态等已有信息的次数 |
| 交接文件质量 | 交接记录是否完整、准确、可操作 |
| 重复工作比例 | 会话 B 中有多少工作量是在重复会话 A 已做过的事 |
| 最终完成状态 | 三个功能是否全部完成 |

## 要交什么

- 弱 harness 的会话 A + B 日志/对话记录
- 强 harness 的会话 A + B 日志/对话记录
- 两次运行中产生的交接文件
- 一份对比笔记：重点比较接手速度和上下文恢复质量

## 对应讲义

- [Lecture 03 — 为什么仓库必须成为唯一事实来源](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md)
- [Lecture 04 — 为什么一个大而全的指令文件不行](../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
- [Lecture 05 — 为什么长任务会丢失连续性](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md)
