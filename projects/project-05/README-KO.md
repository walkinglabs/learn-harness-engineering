# Project 05: Evaluator Loops and Three-role Upgrades for Risk Analysis

동일한 Risk Analyzer 기능을 single-role, gen-eval, plan-gen-eval 세 가지 방식으로 구현해 품질 차이를 비교합니다.

## 디렉터리 안내

| 디렉터리 | 의미 |
|------|------|
| `starter/` | Project 04에서 파생된 시작점. risk analysis 품질을 개선해야 합니다. |
| `solution/single-role/` | Variant A: 한 에이전트가 planning, implementation, self-review를 수행합니다. |
| `solution/gen-eval/` | Variant B: generator가 구현하고 evaluator가 평가 및 수정을 요구합니다. |
| `solution/plan-gen-eval/` | Variant C: planner가 sprint contract를 쓰고 generator/evaluator가 분리됩니다. |

## 포함 기능

- follow-up chains, technical gaps, project evidence gaps, speech issues에서 RiskItem 생성
- 모든 risk item에 evidence 필요
- hiring decision, lie detection, emotion/personality judgment, protected-trait inference 금지
- 각 risk에 training task 연결
