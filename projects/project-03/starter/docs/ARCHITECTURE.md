# Architecture -- Interview Analysis Continuity

Project 03 extends Interview Debrief Coach with persisted analysis state.

## Continuity Points

- `InterviewSession.status` records imported / parsed / analyzing / analyzed / reviewed.
- `interview-session-store.ts` persists sessions, utterances, parse errors, reports, and feedback.
- `analysis-pipeline.ts` is the single entry point for deterministic report generation.
- `feature_list.json`, `session-handoff.md`, and progress logs are the human/agent state channel.
