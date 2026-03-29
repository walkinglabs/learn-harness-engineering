# Lecture 06. Why Initialization Needs Its Own Phase

## Guiding Question

Why should the first run of a project do a different job from later runs?

## Why This Matters

Initialization is not ordinary feature work. The first run establishes the
scaffolding that later runs depend on, so it deserves its own phase and logic.

## Core Ideas

- Initializer agents reduce ambiguity for later coding agents.
- `init.sh`, initial commits, and progress files act as continuity scaffolds.
- First-run setup is a harness primitive, not a convenience script.

## Primary Readings

- Anthropic: Effective harnesses for long-running agents

## Code

See [`code/`](./code/README.md) for initialization artifact examples.
