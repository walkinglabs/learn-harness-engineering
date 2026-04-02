[中文版本 →](../../../zh/projects/project-01-baseline-vs-minimal-harness/)

> Related lectures: [Lecture 01. Strong models don't mean reliable execution](./../../lectures/lecture-01-why-capable-agents-still-fail/index.md) · [Lecture 02. What harness actually means](./../../lectures/lecture-02-what-a-harness-actually-is/index.md)
> Template files: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Project 01. Prompt-Only vs. Rules-First: How Much Difference Does It Make

## What You Do

Build a minimal Electron knowledge-base app shell — a window with a document list on the left, a Q&A panel on the right, and a local data directory. The task itself is not complex. What's complex is how you get the agent to complete it.

You run it twice. First time: just a prompt, no preparation. Second time: `AGENTS.md`, `init.sh`, `feature_list.json` pre-placed in the repo. Then compare.

The core of this project is not writing code — it's figuring out how big the gap is between "spend 15 minutes preparing rules first" and "just let the agent go."

## Tools

- Claude Code or Codex (pick one, use it for both runs)
- Git (manage branches and compare)
- Node.js + Electron (project stack)
- A timer (record each run's duration)

## Harness Mechanism

Minimal harness: `AGENTS.md` + `init.sh` + `feature_list.json`
