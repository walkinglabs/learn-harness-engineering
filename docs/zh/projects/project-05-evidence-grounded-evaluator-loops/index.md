# Project 05. 让 agent 自己检查自己做的对不对

> 相关讲义：[L09. 为什么 agent 会提前宣告完成](./../../lectures/lecture-09-why-agents-declare-victory-too-early/index.md) · [L10. 为什么端到端测试会改变结果](./../../lectures/lecture-10-why-end-to-end-testing-changes-results/index.md)
> 本篇模板文件：[templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/zh/resources/templates/)

## 你要做什么

前四个项目里，"检查做得对不对"这件事要么是你手动做的，要么是靠文件规则强制执行的。这个项目要让 agent 自己来检查。

方法是角色分离。以前是同一个 agent 既写代码又判断质量。现在拆开：一个 agent 负责实现（生成者），另一个 agent 负责审查（评估者）。更进一步，还可以加一个负责规划的角色（规划者）。你要跑三次，看每加一层角色分离，结果好多少。

选一个实质性的功能升级（比如多轮对话历史、引用面板重设计、文档集合与筛选），三次都做同一个升级，唯一变量是 harness 的角色分工。

## 用什么工具

- Claude Code 或 Codex（用于生成和规划角色）
- 同一个或另一个 agent 实例（用于评估角色）
- 评估量表（参考 `docs/zh/resources/templates/evaluator-rubric.md`）
- Sprint contract 模板（参考 `docs/lectures/lecture-11-why-observability-belongs-inside-the-harness/code/sprint-contract.md`）

## 具体步骤

### 准备工作

1. 基于 P04 完成后的代码，从同一个 commit 出发。
2. 创建三个分支：`p05-single`、`p05-gen-eval`、`p05-plan-gen-eval`。
3. 选定一个功能升级，写清楚验收标准。三次运行的功能范围和验收标准完全一致。
4. 写好评估量表，打分维度至少包括：正确性、可靠性、可维护性、用户体验。

### 第一次运行（弱 harness — 单角色）

切到 `p05-single` 分支。

1. 一个 agent 包揽规划、实现、自查。
2. 没有外部评估量表，agent 自己判断做得好不好。
3. 记录最终产出和未解决的缺陷。

### 第二次运行（强 harness — 生成者 + 评估者）

切到 `p05-gen-eval` 分支。

1. 生成者和评估者先用 sprint contract 对齐：做什么、怎么验证、什么不算在范围内。
2. 生成者实现功能。
3. 评估者用评估量表打分，反馈问题。
4. 生成者根据反馈修改。至少经过一轮修订。
5. 记录评估者抓住了多少缺陷、修订了多少内容。

### 第三次运行（更强 harness — 规划者 + 生成者 + 评估者）

切到 `p05-plan-gen-eval` 分支。

1. 规划者先拆解任务、定义步骤和依赖关系。
2. 生成者按规划实现。
3. 评估者用同一份评估量表打分。
4. 至少经过一轮修订。
5. 记录规划是否减少了返工。

### 评估者调优

评估者不是一次就能用好的。初始版本的评估者往往会"发现问题然后自己说服自己通过"。你需要：

1. 让评估者给一个已完成的 sprint 打分。
2. 和你自己的判断对比。
3. 哪里有分歧，就把量表写得更具体。
4. 重新跑评估者，检查对齐程度。
5. 重复 3-5 轮，直到评估者判断和你的判断基本一致。记录每一轮调优的内容。

## 怎么衡量结果

| 指标 | 说明 |
|------|------|
| 范围定义质量 | 编码前的任务拆解清晰度 |
| 缺陷检出数 | 交付前被评估者抓到的缺陷数量和严重程度 |
| 量表评分 | 各维度的得分（正确性、可靠性、可维护性、UX） |
| 返工量 | 评估反馈后需要重做的比例 |
| 最终健壮性 | 升级后功能在实际运行中的稳定程度 |
| 评估者调优轮数 | 评估者判断与你对齐需要的迭代次数 |
| Sprint contract 效果 | 合同是否减少了评估中的模糊地带 |

## 要交什么

- Sprint contract 文档
- 评估者调优日志（每轮改了什么、为什么改）
- 单角色运行记录：提示词、日志、可运行证据
- 生成者+评估者运行记录：含量表评分和修订记录
- 规划者+生成者+评估者运行记录：含规划文档、量表评分、修订记录
- 一份对比笔记：质量提升幅度和协调成本

## 对应讲义

- [Lecture 09 — 为什么 agent 总是过早宣布胜利](../../lectures/lecture-09-why-agents-declare-victory-too-early/index.md)
- [Lecture 10 — 为什么端到端测试能改变结果](../../lectures/lecture-10-why-end-to-end-testing-changes-results/index.md)
- [Lecture 11 — 为什么可观测性属于 harness 的一部分](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md)
