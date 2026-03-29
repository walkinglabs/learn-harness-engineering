# Lecture 02. What a Harness Actually Is

## Guiding Question

What counts as a harness, and what does not?

## Why This Matters

If the definition stays vague, every configuration detail feels optional. The
course needs a precise boundary: the model contains the intelligence, and the
harness is everything built around it to make that intelligence useful.

## Core Ideas

- Agent = Model + Harness.
- A harness includes code, configuration, execution logic, and control flow that
  are outside the model.
- Examples include instructions, tools, filesystems, sandboxes, hooks,
  verification loops, and orchestration.
- Prompts are part of the harness, but the harness is much larger than prompts.

## Primary Readings

- LangChain: The Anatomy of an Agent Harness
- OpenAI: Harness engineering: leveraging Codex in an agent-first world

## Code

See [`code/`](./code/README.md) for small harness boundary examples.
