# Project 02: Agent-readable Interview Workspace

Make the repository readable enough that an agent can discover the product definition, transcript format, data model, analysis model, safety boundaries, and architecture rules instead of guessing.

## Directory Guide

| Directory | Meaning |
|------|------|
| `starter/` | Starting point derived from Project 01, with transcript import and persistence still to harden. |
| `solution/` | Reference implementation with product docs, architecture docs, transcript parser, session store, and handoff notes. |

## How to Use

```sh
cd starter
npm install
# Session A: implement transcript import and parse-error display.
# Session B: implement session persistence and verify the agent regains context.

cd ../solution
npm install
# Rerun with complete repo-readable docs and compare recovery speed.
```

## Features Covered

- Import timestamped transcript text
- Parse timestamp / speaker / utterance
- Save InterviewSession records locally
- Preserve sessions across restart
- Show parse errors instead of failing silently

## Related Lectures

- [Lecture 03: Why the Repository Must Become the System of Record](../../docs/en/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md)
- [Lecture 04: Why One Giant Instruction File Fails](../../docs/en/lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
