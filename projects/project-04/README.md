# Project 04: Runtime Feedback and Structural Control for Transcript Analysis

Add logs, fixture checks, and architecture boundaries so the agent diagnoses transcript parsing and segmentation failures from evidence rather than guessing.

## Directory Guide

| Directory | Meaning |
|------|------|
| `starter/` | Starting point derived from Project 03, with runtime logging and structural checks still incomplete. |
| `solution/` | Reference implementation with structured logs, fixture-analysis scripts, architecture checks, and transcript segmentation verification. |

## How to Use

```sh
cd starter
npm install
# Reproduce a timestamp, speaker-alias, or segmentation failure with a transcript fixture.

cd ../solution
npm install
# Compare how logs and scripts localize parse / segment / analyze failures.
```

## Features Covered

- Structured import / parse / segment / analyze logs
- Architecture boundary check
- Fixture analysis script
- Segmentation verification
- Debugging a seeded transcript-analysis defect

## Related Lectures

- [Lecture 07: Why Agents Overreach and Under-Finish](../../docs/en/lectures/lecture-07-why-agents-overreach-and-under-finish/index.md)
- [Lecture 08: Why Feature Lists Are Harness Primitives](../../docs/en/lectures/lecture-08-why-feature-lists-are-harness-primitives/index.md)
