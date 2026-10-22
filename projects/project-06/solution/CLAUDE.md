# CLAUDE.md -- Quick Reference for Claude Code

## Project Overview

This is the capstone Electron + TypeScript + React knowledge base application with full observability, feedback, and benchmarking. It combines all features from the Learn Harness Engineering course.

## Build & Run

```bash
npm install        # Install dependencies
npm run check      # Type-check without emitting
npm run build      # Compile main/preload + bundle renderer
npm run dev        # Build + launch Electron
npm test           # Run vitest suite
```

## Quick Start

```bash
bash init.sh       # Full verification: install, check, test, build
```

## Key Files

| File | Purpose |
|------|---------|
| `src/main/main.ts` | Electron entry point, window creation, service wiring |
| `src/main/ipc-handlers.ts` | IPC channel registration (14 channels) |
| `src/preload/preload.ts` | contextBridge API (5 namespaces) |
| `src/renderer/App.tsx` | Root React component with view switching |
| `src/renderer/components/ConversationHistory.tsx` | Chat-style Q&A history with feedback |
| `src/services/logger.ts` | Structured JSON logging with log levels |
| `src/services/persistence-service.ts` | File I/O with logging |
| `src/services/document-service.ts` | Document CRUD with validation |
| `src/services/indexing-service.ts` | Chunking with metrics logging |
| `src/services/qa-service.ts` | Q&A with citations and feedback |
| `src/shared/types.ts` | Shared types and IPC channel constants |
| `feature_list.json` | Feature tracking with pass/fail status and evidence |
| `scripts/benchmark.sh` | Performance benchmark suite |
| `scripts/cleanup-scanner.sh` | Stale artifact detection |

## Architecture Rules

- Renderer never imports Node.js modules.
- All main-renderer communication goes through IPC.
- Services use constructor-injected `PersistenceService`.
- IPC channel names live in `src/shared/types.ts`.
- All services use structured JSON logging via `logger.forService()`.

## IPC Channels (14 total)

| Channel | Direction | Purpose |
|---------|-----------|---------|
| `documents:list` | R -> M | List all documents |
| `documents:import` | R -> M | Import a file |
| `documents:get` | R -> M | Get document by ID |
| `documents:delete` | R -> M | Delete document |
| `indexing:start` | R -> M | Start indexing |
| `indexing:status` | R -> M | Get indexing status |
| `indexing:chunks` | R -> M | Get chunks for document |
| `qa:ask` | R -> M | Ask a question |
| `qa:history` | R -> M | Get Q&A history |
| `qa:clear-history` | R -> M | Clear Q&A history |
| `feedback:submit` | R -> M | Submit feedback |
| `feedback:list` | R -> M | Get all feedback |
| `app:reset` | R -> M | Reset all data |
| `app:status` | R -> M | Get app status |

## How to Add a Feature

1. Define the IPC channel in `src/shared/types.ts`.
2. Add the handler in `src/main/ipc-handlers.ts` with logging.
3. Expose the API in `src/preload/preload.ts`.
4. Add the type declaration in `src/renderer/types.d.ts`.
5. Build the UI in `src/renderer/components/`.
6. Add logging calls to the service method.
7. Update `feature_list.json` with the result.

## Testing

```bash
npm test           # Run vitest suite
npm run test:watch # Run tests in watch mode
bash scripts/benchmark.sh  # Run performance benchmarks
bash scripts/cleanup-scanner.sh  # Check for stale artifacts
```
