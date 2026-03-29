# Lecture 04. Why One Giant Instruction File Fails

## Guiding Question

Why does a huge instruction file often make an agent worse rather than better?

## Why This Matters

Big instruction files feel safe because they hold “everything,” but in practice
they consume context, blur priorities, and decay quickly.

## Core Ideas

- Context is scarce, so giant instruction files crowd out task-relevant signal.
- When everything is important, nothing is prioritized.
- Large files rot quickly and are hard to verify mechanically.
- Better harnesses use a short entrypoint plus progressive disclosure.

## Primary Readings

- OpenAI: Harness engineering: leveraging Codex in an agent-first world
- HumanLayer: Skill Issue: Harness Engineering for Coding Agents

## Code

See [`code/`](./code/README.md) for instruction layout examples.
