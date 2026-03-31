# Project 06. 搭建一套完整的 agent 工作环境

> 相关讲义：[L11. 为什么可观测性属于 harness](./../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) · [L12. 为什么每次会话都要留干净状态](./../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md)
> 本篇模板文件：[templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh/resources/templates/)

## 你要做什么

这是结业项目。把前五个项目学到的所有东西组装起来，跑一次完整的基准测试，然后做一轮清理，验证质量是可以持续维护的。

你要用一套固定的多功能任务集，覆盖知识库应用的完整产品切片：导入文档、构建索引、带引用的问答、运行时可观测性、可读可重启的仓库状态。先跑一次弱 harness 基线，再跑一次你组装的最强 harness，然后做一轮清理和重跑。最后还要做一次 harness 精简实验——删掉一个组件看看结果会不会变差，判断哪些组件是真正有用的、哪些是多余的开销。

## 用什么工具

- Claude Code 或 Codex
- Git
- Node.js + Electron
- 质量文档模板（`docs/zh/resources/templates/quality-document.md`）
- 评估量表（`docs/zh/resources/templates/evaluator-rubric.md`）
- 前五个项目积累的所有 harness 组件

## 具体步骤

### 准备工作

1. 基于 P05 完成后的代码，从同一个 commit 出发。
2. 创建两个分支：`p06-baseline` 和 `p06-improved`。
3. 用质量文档模板给当前代码打一次初始评分（每个产品领域和架构层的等级）。
4. 定义一套固定的基准任务集和评分表——在跑任何 agent 之前就定好，跑的过程中不改。

基准任务集至少包括：

- 导入一篇文档
- 构建或刷新索引
- 回答一个带引用的问题
- 查看运行时日志确认可观测性
- 关掉重开后状态仍在

### 第一次运行（弱 harness）

切到 `p06-baseline` 分支。

1. 用课程早期阶段的弱 harness（没有完整交接文件、没有严格验证、可观测性不足）。
2. 用 agent 跑完整个基准任务集。
3. 立刻评分。记录每个任务的完成状态、重试次数、缺陷数。
4. 更新质量文档，记录每个领域和层的等级变化。

### 第二次运行（强 harness）

切到 `p06-improved` 分支。

1. 用你在这门课里组装的最强 harness：交接文件和启动脚本、明确的范围和验证关卡、运行时信号和架构约束、评估者或多角色审查、质量文档追踪。
2. 同样的基准任务集，同样的模型和预算。
3. 立刻评分。记录结果。
4. 更新质量文档。

### 清理和重跑

在 `p06-improved` 分支上：

1. 做一轮清理：删死代码、修不清楚的文档、理顺不稳定的运行路径。
2. 清理后重跑同样的基准任务集，重新评分。
3. 更新质量文档。

对比三个快照的质量文档：基线、强 harness、清理后。

### Harness 精简实验

1. 从 `p06-improved` 分支中删掉一个 harness 组件（比如删掉 sprint contract，或者删掉显式范围关卡）。
2. 重跑基准任务集。
3. 如果结果没变差——说明这个组件是多余的开销，可以去掉。
4. 如果结果变差了——说明这个组件是承重的，必须保留。
5. 记录实验结果。可以多试几个组件。

## 怎么衡量结果

| 指标 | 说明 |
|------|------|
| 基准完成率 | 基准任务集中成功完成的比例 |
| 重试次数 | 每个任务需要重试几次 |
| 缺陷数 | 人工干预前发现的缺陷数量 |
| 清理工作量 | 清理花了多长时间、改了多少文件 |
| 清理后可读性和重启成功率 | 清理后仓库的可维护程度 |
| 质量文档等级变化 | 三个快照的等级对比 |
| Harness 精简结果 | 哪些组件可以删、哪些是承重的 |

## 要交什么

- 质量文档的三个快照（基线、强 harness、清理后）
- 基线基准测试记录：评分和证据
- 强 harness 基准测试记录：评分和证据
- 清理运行记录：清理前后评分变化
- Harness 精简日志：删了什么组件、基准结果、决定保留还是删
- 最终结业总结：关键经验教训

## 对应讲义

- [Lecture 01 — 为什么强 agent 仍然失败](../../lectures/lecture-01-why-capable-agents-still-fail/index.md)
- [Lecture 03 — 为什么仓库必须成为唯一事实来源](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md)
- [Lecture 08 — 为什么 feature list 是 harness 的基础原语](../../lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md)
- [Lecture 11 — 为什么可观测性属于 harness 的一部分](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md)
- [Lecture 12 — 为什么每个会话都必须留下干净状态](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md)
