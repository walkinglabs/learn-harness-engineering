# Project 05：Evaluator Loops and Three-role Upgrades for Risk Analysis

用同一个 Risk Analyzer 功能对比 single-role、gen-eval、plan-gen-eval 三种 agent 工作模式。

## 目录说明

| 目录 | 含义 |
|------|------|
| `starter/` | 从 Project 04 衍生的起点，risk analysis 质量仍需提升。 |
| `solution/single-role/` | 变体 A：一个 agent 完成规划、实现、自评。 |
| `solution/gen-eval/` | 变体 B：generator 实现，evaluator 评分并要求修订。 |
| `solution/plan-gen-eval/` | 变体 C：planner 写 sprint contract，generator 实现，evaluator 评分。 |

## 覆盖功能

- 从 follow-up chains、technical gaps、project evidence gaps、speech issues 生成 RiskItem
- 每个 risk item 必须有 evidence
- 禁止招聘决策、测谎、情绪/人格判断、受保护特征推断
- 每个 risk 关联训练任务
