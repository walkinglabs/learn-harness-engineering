[中文版本 →](../../../zh/projects/project-03-multi-session-continuity/)

> Related lectures: [Lecture 05. Keep context alive across sessions](./../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) · [Lecture 06. Initialize before every agent session](./../../lectures/lecture-06-why-initialization-needs-its-own-phase/index.md)
> Template files: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Project 03. Keep the Agent Working Across Session Restarts

## What You Do

Add scope control and verification gates to the agent. Implement document chunking, metadata extraction, indexing progress display, and citation-based Q&A flow. Use `feature_list.json` to track feature status — one feature at a time, no marking as "pass" without verification evidence.

You run it twice: first without constraints, second with strict enforcement.

## Tools

- Claude Code or Codex
- Git
- Node.js + Electron

## Harness Mechanism

Progress log + session handoff + multi-session continuity
