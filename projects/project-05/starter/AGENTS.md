# AGENTS.md -- Project 05: Evaluator Loops for Risk Analysis

This repository is designed for long-running coding-agent work on Interview Debrief Coach. The goal is not raw output; the goal is restartable, evidence-grounded risk analysis.

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd`.
2. Read `feature_list.json` and choose the highest-priority unfinished feature.
3. Review recent commits with `git log --oneline -5`.
4. Run `npm run check` and `npm run test`.

## Working Rules

- Work on one feature at a time.
- Every RiskItem must include `severity`, `reason`, `evidenceUtteranceIds`, and linked training tasks.
- Do not generate risk items without transcript evidence.
- Do not produce hiring decisions, lie detection, emotion/personality judgments, or protected-trait inference.
- Keep renderer -> preload -> main -> services boundaries intact.

## Runtime Observability

Use structured logs for import, parse, segment, analyze, safety-check, feedback-save, and persistence events.

## Definition Of Done

- Target behavior is implemented.
- `npm run check` passes.
- `npm run test` passes.
- Safety boundary tests pass.
- Evidence is recorded in repo artifacts.
