# Project 05: Evaluator Loops and Three-role Upgrades for Risk Analysis

Compare single-role, generator/evaluator, and planner/generator/evaluator workflows while implementing the same Risk Analyzer feature.

## Directory Guide

| Directory | Meaning |
|------|------|
| `starter/` | Starting point derived from Project 04, with risk analysis quality still to improve. |
| `solution/single-role/` | Variant A: one agent plans, implements, and self-reviews. |
| `solution/gen-eval/` | Variant B: generator implements, evaluator scores and requests revisions. |
| `solution/plan-gen-eval/` | Variant C: planner writes a sprint contract, generator implements, evaluator scores. |

## How to Use

```sh
cd solution/single-role && npm install
cd ../gen-eval && npm install
cd ../plan-gen-eval && npm install
```

Compare the three variants on evidence grounding, specificity, non-hallucination, safety boundaries, training usefulness, and UI evidence jumps.

## Features Covered

- RiskItem generation from follow-up chains, technical gaps, project evidence gaps, and speech issues
- Evidence required for every risk item
- No hiring decision, lie detection, emotion/personality judgment, or protected-trait inference
- Training task linkage for each risk

## Related Lectures

- [Lecture 09: Why Agents Declare Victory Too Early](../../docs/en/lectures/lecture-09-why-agents-declare-victory-too-early/index.md)
- [Lecture 10: Why End-to-End Testing Changes Results](../../docs/en/lectures/lecture-10-why-end-to-end-testing-changes-results/index.md)
