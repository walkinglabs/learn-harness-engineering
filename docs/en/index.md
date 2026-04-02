# Welcome to Learn Harness Engineering

A project-based course on designing environments, state, verification, and control systems for Codex and Claude Code.

## Core Thesis

When you let models do work, the human's job is to define the rules and boundaries. That's the harness.

**The key point:** Models are powerful, but that doesn't mean they can reliably complete real engineering tasks on their own. They need explicit rules to constrain their scope, clear handoff mechanisms to maintain continuity across long tasks, and verification methods to confirm they did the work correctly.

We're not trying to "make the model smarter." We're studying how to build a reliable working environment around the model so the same model produces more reliable output.

## Quick Start

You don't need to read all the lectures first. If you want to jump in, grab these template files from the resource library and adapt them to your project.

**Recommended starter set:**

- `AGENTS.md` or `CLAUDE.md` — root instruction file
- `feature_list.json` — feature status tracker
- `claude-progress.md` — progress log
- `init.sh` — initialization script

Put these four files in your project before you start having an agent do real work. The results will be significantly more stable than just writing a big prompt.

Browse all templates: [English Templates](/en/resources/templates/) or [中文模板](/zh/resources/templates/).

## Who This Is For

This course is for:

- Engineers already using coding agents who want better stability and quality
- Researchers or builders who want a systematic understanding of harness design
- Tech leads who need to understand how environment design affects agent performance

This course is not for:

- People looking for a zero-code AI introduction
- Those who only care about prompts without real implementation
- Learners not prepared to let agents work in real repositories

## Environment Requirements

This is a hands-on course that requires running a coding agent.

You need at least one of these tools:

- Claude Code
- Codex
- Another IDE / CLI coding agent that supports file editing, command execution, and multi-step tasks

The course assumes you can:

- Open a local repository
- Allow the agent to edit files
- Allow the agent to run commands
- Inspect output and repeat tasks

## Core References

Primary:

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)

Supplementary:

- [LangChain: The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)
- [Thoughtworks: Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
- [HumanLayer: Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
