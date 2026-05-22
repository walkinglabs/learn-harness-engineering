# Project 01: Prompt-only vs Rules-first for Interview Debrief Apps

Compare what happens when an agent receives only "build an interview debrief app" versus a small harness with rules, verification, and a fixture transcript.

## Directory Guide

| Directory | Meaning |
|------|------|
| `starter/` | Weak harness workspace: a minimal Electron app plus a vague task prompt and sample transcript. |
| `solution/` | Reference workspace: the same product goal with AGENTS.md, init.sh, feature_list.json, parser tests, static debrief UI, and progress log. |

## How to Use

```sh
cd starter
npm install
# Give task-prompt.md to Claude Code / Codex.
# Ask for: app startup, interview session list, transcript timeline, debrief summary.

cd ../solution
npm install
# Ask the agent to read AGENTS.md and follow the rules for the same product task.
```

## Features Covered

- Electron window starts successfully
- UI shows a fixed interview session
- UI shows a sample timestamped transcript
- UI shows a static debrief summary
- No real LLM and no real audio transcription

## Related Lectures

- [Lecture 01: Why Capable Agents Still Fail](../../docs/en/lectures/lecture-01-why-capable-agents-still-fail/index.md)
- [Lecture 02: What a Harness Actually Is](../../docs/en/lectures/lecture-02-what-a-harness-actually-is/index.md)
