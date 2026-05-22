# Project 03: Multi-session Continuity for Interview Analysis

Teach the agent to continue interview-analysis work across sessions using progress logs, session handoff, feature state, and an analysis state machine.

## Directory Guide

| Directory | Meaning |
|------|------|
| `starter/` | Starting point derived from Project 02, with analysis report generation still incomplete. |
| `solution/` | Reference implementation with AnalysisReport, follow-up chains, gaps, risk items, training tasks, progress log, and session handoff. |

## How to Use

```sh
cd starter
npm install
# Observe whether the agent can resume after interruption without losing analysis state.

cd ../solution
npm install
# Compare how progress logs, handoff, and feature_list.json constrain completion claims.
```

## Features Covered

- Interview session state machine
- Analyze session command
- Persisted AnalysisReport
- UI report status
- Recovery from interrupted work

## Related Lectures

- [Lecture 05: Why Long-Running Tasks Lose Continuity](../../docs/en/lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md)
- [Lecture 06: Why Initialization Needs Its Own Phase](../../docs/en/lectures/lecture-06-why-initialization-needs-its-own-phase/index.md)
