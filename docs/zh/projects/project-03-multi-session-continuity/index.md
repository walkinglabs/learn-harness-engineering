# Project 03. 让 agent 关掉再打开还能接着干

> 相关讲义：[L05. 为什么长时任务会丢失上下文](./../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) · [L06. 为什么初始化需要单独一个阶段](./../../lectures/lecture-06-why-initialization-needs-its-own-phase/index.md)
> 本篇模板文件：[templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh/resources/templates/)

## 你要做什么

P02 解决了"接手"的问题，但 agent 接手之后能不能把活干完、干对了，又是另一回事。这个项目要你给 agent 加上范围控制和验证关卡。

你要实现的知识库功能是：文档分块、元数据提取、索引进度显示、带引用的问答流程。这些功能比前两个项目复杂，agent 更容易跑偏——要么多做了不该做的，要么说做完了但其实没通过验证。

你需要一个 `feature_list.json`，每个功能有明确的状态（failing / passing）。规则很简单：一次只做一个功能，没有可运行的验证证据就不能标成 passing。跑两次，一次不给这些约束，一次严格执行，看结果差多少。

## 用什么工具

- Claude Code 或 Codex
- Git
- Node.js + Electron
- `feature_list.json`（模板参考 `docs/zh/resources/templates/feature_list.json`）

## 具体步骤

### 准备工作

1. 基于 P02 完成后的代码，从同一个 commit 出发。
2. 创建两个分支：`p03-baseline` 和 `p03-improved`。
3. 定义四个功能：文档分块、元数据提取、索引进度 UI 显示、带引用的问答。两条分支的功能定义完全一致。

### 第一次运行（弱 harness）

切到 `p03-baseline` 分支。

1. 启动 agent，给一段模糊的任务提示词。
2. 不提供 `feature_list.json`，没有状态追踪。
3. 不限制 agent 一次做几个功能。
4. 没有明确的验证标准——agent 自己说"完成了"就算。
5. 运行结束后，手动检查每个功能是否真的能用。
6. 记录哪些功能 agent 声称完成但实际没通过验证。

### 第二次运行（强 harness）

切到 `p03-improved` 分支。在启动 agent 之前：

- 在仓库根目录放好 `feature_list.json`，四个功能全部标为 `failing`。
- 在 `AGENTS.md` 里写明规则：一次只做一个功能；状态只能从 `failing` 切到 `passing`，且必须有验证证据。
- 准备好 `init.sh`。

然后启动 agent：

1. agent 开始工作，每完成一个功能必须更新 `feature_list.json` 并附上验证证据（截图、测试输出等）。
2. 至少要有一个功能展示从 `failing` 到 `passing` 的完整转换过程。
3. 问答功能的验证必须检查引用是否存在、引用是否相关，不能只看有没有输出。
4. 运行结束后归档所有验证证据。

## 怎么衡量结果

| 指标 | 说明 |
|------|------|
| 范围漂移次数 | agent 做了功能清单之外的事的次数 |
| 虚假完成率 | agent 声称完成但验证不通过的功能比例 |
| 验证覆盖率 | 有明确验证证据的功能占总功能的百分比 |
| 问答质量 | 引用是否存在、引用是否相关 |
| 重试次数 | 从开始到所有功能 passing 总共重试了几次 |

## 要交什么

- 弱 harness 运行记录：提示词、日志、验证结果
- 强 harness 运行记录：`feature_list.json` 变更历史、日志、验证证据
- 至少一个功能从 `failing` 到 `passing` 的转换证据
- 一份对比笔记：重点看范围纪律和完成准确度

## 对应讲义

- [Lecture 07 — 为什么 agent 总是做过头、做不完](../../lectures/lecture-07-why-agents-overreach-and-under-finish/index.md)
- [Lecture 08 — 为什么 feature list 是 harness 的基础原语](../../lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md)
- [Lecture 09 — 为什么 agent 总是过早宣布胜利](../../lectures/lecture-09-why-agents-declare-victory-too-early/index.md)
- [Lecture 10 — 为什么端到端测试能改变结果](../../lectures/lecture-10-why-end-to-end-testing-changes-results/index.md)
