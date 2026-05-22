# Sprint Contract -- Risk Analyzer

## Goal

Implement and verify Risk Analyzer for Interview Debrief Coach.

## In Scope

- Generate RiskItem[] from follow-up chains, technical gaps, project evidence gaps, and speech issues.
- Require evidenceUtteranceIds on every risk.
- Generate linked TrainingTask[].
- Run safety boundary checks.
- Render risk evidence chips in the report panel.

## Out of Scope

- Real LLM calls.
- Real audio transcription.
- Hiring decisions.
- Lie detection.
- Emotion or personality judgment.
- Protected-trait inference.

## Verification

- `npm run check`
- `npm run test`
- evaluator-rubric.md score recorded
