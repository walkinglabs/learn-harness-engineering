# AGENTS.md -- Project 02: Agent-readable Interview Workspace

## Quick Start

1. Run `npm install && npm run check`.
2. Read `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, and `docs/SAFETY_BOUNDARIES.md`.
3. Check `feature_list.json` before choosing work.

## Layers

- Main process: `src/main/` -- window, IPC, session store
- Preload: `src/preload/` -- typed `window.interviewCoach` bridge
- Renderer: `src/renderer/` -- sessions, transcript timeline, debrief report
- Services: `src/services/` -- transcript parsing, analysis, safety checks, persistence

## Rules

- TypeScript strict mode.
- Renderer must not access Node filesystem APIs.
- Transcript import is primary; audio transcription must stay mocked.
- Every report finding must point to timestamped transcript evidence.
- Do not implement hiring decisions, lie detection, emotion/personality judgment, or protected-trait inference.
