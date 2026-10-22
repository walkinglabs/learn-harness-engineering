# AGENTS.md -- Project 06: Runtime Observability and Debugging (Capstone)

## Startup Rules

Before writing any code, complete these steps in order:

1. **Read this file completely.** It defines the boundaries and conventions for this project.
2. **Read `CLAUDE.md`** for the quick reference if using Claude Code.
3. **Read `docs/ARCHITECTURE.md`** to understand the full Electron layer structure and data flow.
4. **Read `docs/PRODUCT.md`** to understand the complete feature requirements.
5. **Read `docs/RELIABILITY.md`** to understand logging, observability, and clean state requirements.
6. **Run `bash init.sh`** to verify the project builds and initializes cleanly.
7. **Read `feature_list.json`** to see the current state of all features.

## Project Context

This is the **capstone project** for the Learn Harness Engineering course. It combines all features from Projects 01-05 into a single complete product:

- Document import with validation
- Text indexing with progress tracking
- Grounded Q&A with citations
- Conversation history with chat-style display
- Structured logging for runtime observability
- Feedback collection on Q&A responses
- Clean state reset for testing
- Benchmark scripts for performance measurement
- Cleanup scanner for detecting stale artifacts

## Docs Hierarchy

The `docs/` directory is organized for agent readability:

```
docs/
  ARCHITECTURE.md   -- Electron layers, data flow, full pipeline
  PRODUCT.md        -- Feature requirements and user-facing behavior
  RELIABILITY.md    -- Logging, observability, clean state, benchmarking
```

When adding new features, update the relevant doc before writing code.

## Electron Layer Boundaries

### Main Process (`src/main/`)
- Owns BrowserWindow lifecycle and IPC registration.
- All filesystem access happens here via services.
- Structured logging for all IPC events.

### Preload (`src/preload/`)
- The ONLY bridge between main and renderer.
- Uses `contextBridge.exposeInMainWorld` to expose typed APIs.
- Exposes: documents, indexing, qa, feedback, app namespaces.

### Renderer (`src/renderer/`)
- React + TypeScript UI layer.
- Communicates exclusively through `window.knowledgeBase` API.
- Never imports Node.js modules.

### Services (`src/services/`)
- Pure TypeScript business logic in the main process.
- Constructor-injected `PersistenceService`.
- All services use `logger.forService()` for structured JSON output.

## Conventions

- TypeScript strict mode. No `any` without a comment explaining why.
- Named exports only.
- IPC channels defined once in `src/shared/types.ts`.
- New IPC channels follow the pattern: `namespace:action`.
- All service methods must log at INFO level for significant events.
- DEBUG level for routine data access.
- WARN for missing but non-critical data.
- ERROR for failures.

## Definition of Done

A feature is "done" when:

1. TypeScript compiles without errors (`npm run check`).
2. The test suite passes (`npm test`), and the feature's service behavior is covered by a test in `tests/`. A bug fix starts with a test that fails without the fix.
3. The app launches and the window is visible.
4. The feature appears in `feature_list.json` with status `"pass"` and evidence that names the tests that cover it. Prose alone ("verified working") is not evidence.
5. The code respects Electron layer boundaries.
6. Structured logging covers all service operations.
7. `docs/ARCHITECTURE.md` and/or `docs/PRODUCT.md` are updated.
8. `clean-state-checklist.md` passes all checks.

## Tests

- `tests/` holds the unit suite (`npm test`); it runs in Node against a temporary data directory, without launching Electron.
- One file per service, plus `ipc-handlers.test.ts` (every IPC channel is wired, status channels return the `AppStatus` shape the renderer reads), `preload-bundle.test.ts` (the sandboxed preload requires nothing but `electron`) and `pipeline.e2e.test.ts` (import, index, ask, restart, reset with the bundled sample documents, checked by `scripts/cleanup-scanner.sh`).
- `tests-e2e/` drives the built app in a real Electron window with Playwright (`npm run test:e2e`, after `npm run build`): preload bridge, import through a stubbed file dialog, indexing, Q&A, delete. It uses a throwaway profile via `--user-data-dir`, never your real data. The unit suite cannot see a broken preload or UI wiring; this one can.
- `bash init.sh` runs type checks, unit tests, build and end-to-end tests; a red test stops the session start.
- Never mark a UI feature `pass` without an end-to-end test that clicks through it.

## Session Handoff

When resuming work, read `session-handoff.md` for context from the previous session. When finishing a session, update it with:

- What was accomplished
- What remains
- Any blockers or decisions made
- Files that were modified
- Benchmark results if applicable

## Clean State

Before each major testing cycle:

1. Run `bash scripts/cleanup-scanner.sh` to check for stale artifacts.
2. Use the in-app Reset button or `RESET_DATA` IPC to clear all data.
3. Verify `clean-state-checklist.md` passes.
4. Run `bash scripts/benchmark.sh` to measure performance.
