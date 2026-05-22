# AGENTS.md

AI Interview Debrief Coach analyzes interview transcripts and produces evidence-grounded feedback, risk flags, and a training plan.

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd`.
2. Read `feature-list-interview-template.json` or the project `feature_list.json`.
3. Read `interview-analysis-model-template.md` and `safety-boundaries-template.md`.
4. Run `./init-interview-template.sh` or the project startup script.
5. Inspect the transcript fixtures and expected debrief outputs before editing analysis logic.

If baseline verification fails, repair that before adding new analysis scope.

## Working Rules

- Work on one interview-analysis feature at a time.
- Do not invent interview facts that are not present in transcript evidence.
- Keep scoring and risk language coach-oriented, not hiring-decision-oriented.
- Route transcript parsing, question-chain segmentation, speech metrics, technical-gap analysis, and training-plan generation through separate modules.
- Record verification evidence before marking any feature `passing`.

## Required Artifacts

- `feature_list.json`: interview feature state and verification evidence
- `fixtures/interviews/`: transcript inputs
- `fixtures/gold/`: expected report shape or scoring expectations
- `docs/SAFETY_BOUNDARIES.md`: prohibited outputs and reviewer language rules
- `session-handoff.md`: restartable state for the next session

## Definition Of Done

A feature is done only when:

- the transcript-backed behavior is implemented
- fixture analysis passes
- report output includes evidence turn references
- safety boundary checks pass
- session state and feature evidence are updated

