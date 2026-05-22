# Architecture -- Risk Analyzer Workspace

Project 05 focuses on evaluator loops for risk analysis.

## Risk Analyzer Inputs

- follow-up chains
- technical gaps
- project evidence gaps
- speech issues

## Risk Analyzer Output

Every `RiskItem` must include severity, reason, evidence utterance IDs, and linked training tasks. Safety checks run after report generation.

## Boundaries

- renderer uses `window.interviewCoach`
- services are framework-independent TypeScript
- safety checker rejects hiring decisions, lie detection, emotion/personality judgment, and protected-trait inference
