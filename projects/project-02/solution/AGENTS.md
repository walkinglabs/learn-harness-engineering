# AGENTS.md -- Project 02 Agent-readable Interview Workspace

## Startup

1. Run `npm install && npm run check`.
2. Read `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`, `docs/INTERVIEW_ANALYSIS_MODEL.md`, and `docs/SAFETY_BOUNDARIES.md`.
3. Check `feature_list.json`.

## Rules

- Transcript import is the primary path.
- Renderer uses only `window.interviewCoach`.
- Parser errors must be surfaced, not silently dropped.
- Keep all analysis grounded in timestamped transcript evidence.
- Safety boundary violations are blocking defects.
