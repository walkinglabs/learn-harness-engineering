# Lecture 09. Why Runtime Feedback Belongs Inside the Harness

## Guiding Question

Why do agents need runtime signals and clean state in order to work reliably?

## Why This Matters

If agents can only see code and not the running system, they are forced to
guess. If they leave broken or ambiguous state behind, future sessions become
less reliable.

## Core Ideas

- Logs, metrics, traces, and runtime state form a feedback channel.
- Runtime visibility changes what the agent can debug and verify.
- Clean state between sessions is part of harness quality.
- Recoverability matters because long-running work compounds errors over time.

## Primary Readings

- OpenAI: Harness engineering: leveraging Codex in an agent-first world
- Anthropic: Effective harnesses for long-running agents

## Code

See [`code/`](./code/README.md) for runtime feedback and clean-state examples.
