# Lecture 05. Why Long-Running Tasks Lose Continuity

## Guiding Question

Why does agent performance often break when work spans multiple sessions?

## Why This Matters

Long-running work is not just “more of the same.” Each new session begins with
partial or missing state, which makes continuity itself a harness concern.

## Core Ideas

- Session boundaries create discontinuity.
- A fresh context window does not imply fresh understanding.
- Long-running harnesses need explicit mechanisms for continuity.

## Primary Readings

- Anthropic: Effective harnesses for long-running agents
- Anthropic: Harness design for long-running application development

## Code

See [`code/`](./code/README.md) for continuity artifact examples.
