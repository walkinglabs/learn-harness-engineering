[中文版本 →](../../../zh/projects/project-05-grounded-qa-verification/)

> Related lectures: [Lecture 09. Stop agents from declaring victory early](./../../lectures/lecture-09-why-agents-declare-victory-too-early/index.md) · [Lecture 10. Only a full-pipeline run counts as real verification](./../../lectures/lecture-10-why-end-to-end-testing-changes-results/index.md)
> Template files: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Project 05. Make the Agent Verify Its Own Work

## What You Do

Implement role separation — a generator that implements, an evaluator that reviews, and optionally a planner. Run three times to measure the effect of each added role.

Choose a substantive feature upgrade (multi-turn conversation, citation panel redesign, or document filtering) and keep it consistent across all runs.

## Tools

- Claude Code or Codex
- Git
- Node.js + Electron

## Harness Mechanism

Self-verification + grounded Q&A + evidence-based completion
