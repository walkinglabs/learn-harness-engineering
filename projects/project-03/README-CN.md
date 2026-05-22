# Project 03：Multi-session Continuity for Interview Analysis

训练 agent 通过 progress log、session handoff、feature 状态和 analysis 状态机跨会话继续工作。

## 目录说明

| 目录 | 含义 |
|------|------|
| `starter/` | 从 Project 02 衍生的起点，analysis report 生成仍未完成。 |
| `solution/` | 参考实现：包含 AnalysisReport、追问链、gap、risk item、training task、progress log 和 session handoff。 |

## 覆盖功能

- Interview session 状态机
- Analyze session 命令
- 持久化 AnalysisReport
- UI 显示 report 状态
- 从中断状态恢复
