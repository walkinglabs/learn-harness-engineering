# Project 02: Agent-Readable Workspace

Demonstrate how repository readability and explicit continuity artifacts reduce context loss during multi-session development.

## Directory Guide

| Directory | Meaning |
|------|------|
| `starter/` | **Starting point**: based on the P1 solution, with document import, detail view, and persistence still to implement. The harness is weak: AGENTS.md is minimal and there is no session handoff. |
| `solution/` | **Reference implementation**: all new features are implemented, with complete workspace documentation (ARCHITECTURE.md, PRODUCT.md, session-handoff.md). |

## How to Use

Copy `starter/` into two isolated working directories, not two branches. Run one copy at a time and archive its results outside the next agent's workspace. Run `npm install` in each copy and use the same agent and task prompt.

1. **Baseline:** Keep the starter harness, including `docs/` and `feature_list.json`, unchanged at the start. Do not create a handoff note.
2. **Improved:** Replace only `AGENTS.md` with [`solution/AGENTS.md`](./solution/AGENTS.md) before starting. At the end of Session A, have the agent write its own `session-handoff.md`. Do not copy the finished solution code, docs, feature list, or handoff.
3. **Both runs:** End Session A when import and full detail view work but imported documents are still lost on restart. Start a fresh Session B with only “Continue the work.” and complete persistence.

Compare how quickly Session B makes its first meaningful change, how much it rediscovers or repeats, and whether all features work. This compares the harness rules and handoff together, not the handoff note alone.

[Full protocol and submission requirements](../../docs/en/projects/project-02-agent-readable-workspace/index.md)

## Exact Task Contract

Start from `starter/`. The starter already contains the Project 01 shell and a
minimal harness. The work is to add the Project 02 product slice and the
workspace documentation that makes a second session recover quickly.

| Feature / artifact | Starter state | Solution evidence |
|------|------|------|
| Document import | Import flow is incomplete across renderer, preload, IPC, and `DocumentService` | `src/renderer/components/ImportPanel.tsx`, `src/main/ipc-handlers.ts`, `src/services/document-service.ts` |
| Document detail | Detail panel does not load and render full file content through IPC | `src/renderer/components/DocumentDetail.tsx`, `IPC_CHANNELS.GET_DOCUMENT_CONTENT` |
| Basic persistence | Imported documents are not fully restored after restart | `src/services/persistence-service.ts`, `documents-meta.json` handling |
| Agent-readable state | No final handoff file in starter | `session-handoff.md`, expanded `docs/ARCHITECTURE.md`, expanded `docs/PRODUCT.md` |

## Features Covered

- Document import flow (file picker plus IPC transfer)
- Document detail view (metadata plus content display)
- Basic persistence (imported documents remain after restart)

## Related Lectures

- [Lecture 03: Why the Repository Must Become the System of Record](../../docs/en/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md)
- [Lecture 04: Why One Giant Instruction File Fails](../../docs/en/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
