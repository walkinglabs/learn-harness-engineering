# Project 04. 用运行反馈修正 agent 的行为

> 相关讲义：[L07. 为什么 agent 会多做或少做](./../../lectures/lecture-07-why-agents-overreach-and-under-finish/index.md) · [L08. 为什么功能清单是 harness 原语](./../../lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md)
> 本篇模板文件：[templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh/resources/templates/)

## 你要做什么

前三个项目关注的是"让 agent 把活干完"。这个项目关注的是"出了问题怎么修"——而且不是你修，是让 agent 自己通过运行时信号来修。

你要做两件事。第一，给知识库应用加上运行时可观测性：启动日志、导入和索引的日志、问答失败时的用户可见错误状态。第二，在仓库里编码架构约束，让 agent 不可能静默地跨层违规（main / preload / renderer / services 之间的边界）。

然后你会在代码里埋一个运行时 bug，让 agent 去修。跑两次：一次不给日志和约束，看 agent 怎么修；一次给好日志和架构规则，看差别。

## 用什么工具

- Claude Code 或 Codex
- Git
- Node.js + Electron
- 日志库（如 `electron-log` 或简单的 console 封装）
- 结构化检查工具（ESLint 自定义规则、guard 脚本、或测试）

## 具体步骤

### 准备工作

1. 基于 P03 完成后的代码，从同一个 commit 出发。
2. 创建两个分支：`p04-baseline` 和 `p04-improved`。
3. 在两个分支中埋入同一个运行时 bug（比如：索引时 chunk 大小读取错误导致问答返回空结果）。
4. 记录 bug 的位置和表现，但不要告诉 agent bug 在哪。

### 第一次运行（弱 harness）

切到 `p04-baseline` 分支。

1. 启动 agent，告诉它"问答功能返回空结果，请修复"。
2. 仓库里没有运行时日志，没有架构约束文件。
3. 记录 agent 花了多久找到根因、怎么确认修复的、修复过程中是否引入了新的层边界违规。
4. 修复后重启应用，确认是否能干净启动。

### 第二次运行（强 harness）

切到 `p04-improved` 分支。在启动 agent 之前，先在仓库里准备好：

- **运行时日志**：启动时打印初始化步骤，导入时打印文件数量和 chunk 结果，索引时打印进度，问答失败时打印错误原因。
- **架构约束**：在 `AGENTS.md` 里明确写 Electron 四层边界（main / preload / renderer / services），说明哪些调用路径是允许的。用 ESLint 规则或 guard 脚本检查违规。
- **干净状态要求**：最终交付前必须能干净重启。

然后启动 agent：

1. 先让 agent 加上日志和结构化检查（这是任务的一部分）。
2. 然后告诉它"问答功能返回空结果，请修复"。
3. 这次 agent 有日志可以看，有架构规则可以参照。
4. 记录诊断速度、修复质量、是否引入了边界违规。
5. 修复后重启应用，确认干净启动。

## 怎么衡量结果

| 指标 | 说明 |
|------|------|
| 根因定位时间 | 从开始到 agent 准确描述 bug 原因 |
| 修复确认时间 | 从定位到验证修复成功 |
| 边界违规数 | 修复过程中引入的跨层违规次数 |
| 日志有用性 | 日志是否直接指向了失败原因 |
| 干净重启 | 修复后是否能干净重启、无报错 |

## 要交什么

- 弱 harness 的调试记录：诊断过程、修复 diff、启动证据
- 强 harness 的调试记录：同上，加上日志和架构约束文件
- 结构化检查产物（lint 规则、guard 脚本、或测试文件）
- 一份对比笔记：重点比较诊断速度和修复健壮性

## 对应讲义

- [Lecture 11 — 为什么可观测性属于 harness 的一部分](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md)
- [Lecture 12 — 为什么每个会话都必须留下干净状态](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md)
