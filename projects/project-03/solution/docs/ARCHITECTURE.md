# Architecture -- Project 03

Project 03 adds continuity around the analysis state machine.

- `InterviewSession.status`: imported / parsed / analyzing / analyzed / reviewed
- `AnalysisReport`: persisted debrief output
- `interview-session-store.ts`: local data boundary
- `analysis-pipeline.ts`: deterministic report generation
- `feature_list.json` and `session-handoff.md`: restartable agent state
