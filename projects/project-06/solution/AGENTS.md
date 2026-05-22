# AGENTS.md -- Project 06 Complete Interview Debrief Harness

## Startup

1. Run `./init.sh`.
2. Read `feature_list.json`.
3. Read `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`, `docs/INTERVIEW_ANALYSIS_MODEL.md`, `docs/SAFETY_BOUNDARIES.md`, and `docs/RELIABILITY.md`.
4. Work on one feature at a time.

## Completion Rule

Work is complete only when:

- `npm run check` passes
- `npm run test` passes
- `npm run build` passes
- `./scripts/benchmark.sh` passes
- `./scripts/cleanup-scanner.sh` passes
- `./scripts/check-architecture.sh` passes

## Safety Boundary

No candidate ranking, hire/reject recommendation, automated screening, protected-trait inference, emotion recognition, personality judgment, lie detection, or mental-state inference from voice.
