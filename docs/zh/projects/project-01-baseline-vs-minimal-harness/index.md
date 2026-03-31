# Project 01. 只写提示词让 agent 做，和定好规则再让它做，差多少

> 相关讲义：[L01. 模型能力强，不等于执行可靠](./../../lectures/lecture-01-why-capable-agents-still-fail/index.md) · [L02. Harness 到底是什么](./../../lectures/lecture-02-what-a-harness-actually-is/index.md)
> 本篇模板文件：[templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh/resources/templates/)

## 你要做什么

用 Electron 搭一个最简的知识库应用壳子——能启动窗口、左边显示文档列表、右边显示问答面板、本地有一个数据目录。任务本身不复杂，复杂的是你怎么让 agent 完成它。

你需要跑两次。第一次只给一段提示词，什么都不准备，看 agent 能做到什么程度。第二次提前在仓库里放好 `AGENTS.md`、`init.sh`、`feature_list.json`，用结构化的方式告诉 agent 该干什么、怎么验证、什么时候算做完。然后对比两次结果。

这个项目的核心不是写代码，是搞清楚"提前花 15 分钟准备规则"和"上来就让 agent 干"之间到底差多少。

## 用什么工具

- Claude Code 或 Codex（选一个，两次都用同一个）
- Git（管理分支和对比）
- Node.js + Electron（项目技术栈）
- 一个计时器（记录每次运行时间）

## 具体步骤

### 准备工作

1. 从一个干净的 commit 出发，记录 commit hash。
2. 创建两个分支：`p01-baseline` 和 `p01-improved`。
3. 准备同一段任务提示词，内容是："用 Electron 做一个知识库应用，窗口左边是文档列表区域，右边是问答面板区域，应用需要创建并使用本地数据目录。"

### 第一次运行（弱 harness）

切到 `p01-baseline` 分支。

1. 只用上面那段提示词启动 agent。
2. 不提供 `AGENTS.md`，不提供启动脚本，不提供验收标准。
3. 设定相同的时间上限和轮次上限（建议 30 分钟 / 20 轮）。
4. agent 停下后，运行 `npm start`（或对应启动命令），看应用能不能跑起来。
5. 记录：终端输出、关键 diff、agent 的最终总结。
6. **不要手动修代码**。跑不起来就是跑不起来，如实记录。

### 第二次运行（强 harness）

切到 `p01-improved` 分支。在启动 agent 之前，先在仓库里准备好：

- `AGENTS.md`：写明项目结构、启动命令、Electron 层边界规则
- `init.sh`：一键恢复可运行状态（`npm install && npm start`）
- `feature_list.json`：列出四个功能点及其完成状态

然后用和第一次相同的提示词启动 agent，同样的时间上限和轮次上限。agent 停下后，跑 `./init.sh`，记录结果。

## 怎么衡量结果

| 指标 | 说明 |
|------|------|
| 完成状态 | 完全完成 / 部分完成 / 失败 |
| 首次成功启动时间 | 从开始到 `npm start` 第一次成功运行 |
| 重试次数 | 中间需要人工干预几次才能跑起来 |
| 遗漏项 | agent 宣布完成时还有哪些功能没做 |
| 过早停止 | agent 是否在不可运行状态就宣布完成 |

## 要交什么

- 弱 harness 运行记录：提示词、日志/对话记录、最终 diff、启动证据
- 强 harness 运行记录：同上，加上你准备的 harness 文件
- 一份对比笔记（1-2 页）：两次运行的差异、数据、结论

## 对应讲义

- [Lecture 01 — 为什么强 agent 仍然失败](../../lectures/lecture-01-why-capable-agents-still-fail/index.md)
- [Lecture 02 — harness 到底是什么](../../lectures/lecture-02-what-a-harness-actually-is/index.md)
- [Lecture 06 — 为什么初始化需要单独一个阶段](../../lectures/lecture-06-why-initialization-needs-its-own-phase/index.md)
