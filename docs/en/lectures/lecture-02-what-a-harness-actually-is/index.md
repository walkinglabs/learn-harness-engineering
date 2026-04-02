[中文版本 →](../../../zh/lectures/lecture-02-what-a-harness-actually-is/)

> Code examples: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-02-what-a-harness-actually-is/code/)
> Practice project: [Project 01. Prompt-only vs. rules-first](./../../projects/project-01-baseline-vs-minimal-harness/index.md)

# Lecture 02. What Harness Actually Means

## What Problem Does This Lecture Solve?

The word "harness" gets thrown around a lot in AI coding agent discussions, but honestly, most people mean "a prompt file" when they say harness. That's not a harness.

This lecture gives you a precise, actionable definition. Not an academic abstraction, but a framework you can use today: a harness consists of five subsystems, each with clear responsibilities and evaluation criteria. Once you understand this framework, you can systematically diagnose "why did the agent fail again" — not by vaguely blaming the model, but by pinpointing exactly which subsystem broke down.

## Core Concepts

- **The Five-Tuple Harness**: Instructions, Tools, Environment, State, Feedback. If it's not model weights, it's harness.
- **Boundary Criterion**: If a component affects the agent's perception, actions, memory, or verification, it belongs to the harness. Simple rule: not model weights = harness.
- **Weakest-Link Principle**: The harness's overall effectiveness is determined by its weakest subsystem. Your instructions might be brilliant, but without verification feedback, the agent still won't be reliable.
- **Affordance**: Good harness design provides visible cues that suggest possible actions. Clear directory structure implies code organization, explicit verification commands imply completion criteria. Harness design IS affordance design.
- **Feedback Latency**: The time between an agent's action and the feedback it receives. Compilation errors are second-level feedback, test suites are minute-level, "bug in production" is day-level. Faster feedback means faster correction.
- **Isometric Model Control**: Keep the model fixed, systematically vary harness subsystems, measure each one's marginal contribution. This is the correct way to quantify a harness's value.

## Why This Happens

Here's an analogy. Imagine you're a newly hired engineer dropped into a project with zero documentation. No README, no comments in the code, nobody tells you how to run tests, CI config is buried somewhere. Can you write good code? Maybe, but you'll spend enormous time on "figuring out what this project is about" rather than "solving the problem."

An AI agent faces the exact same situation. And it's worse — you can at least ask a colleague. The agent can only see files you put in front of it and commands it can execute.

OpenAI's harness engineering article frames the core principle as "the repo IS the spec" — all necessary context should be in the repository, delivered through structured instruction files, explicit verification commands, and clear directory organization. Anthropic's long-running agents documentation emphasizes state persistence, explicit recovery paths, and structured progress tracking. The two companies focus on different aspects, but they're saying the same thing: **everything in the engineering infrastructure outside the model determines how much of the model's capability actually gets realized.**

Look at some concrete examples:

**Claude Code** embodies harness thinking. It reads `CLAUDE.md` from your repo (instruction subsystem), can run shell commands (tool subsystem), executes in your local environment (environment subsystem), maintains session history (state subsystem), and can run tests and see results (feedback subsystem). But if you don't tell it how to run tests, the feedback subsystem is broken.

**Cursor** follows similar logic. Its `.cursorrules` file is the instruction subsystem, the terminal is the tool subsystem, it reads your project structure and lint config for the environment subsystem. But Cursor's state management is relatively weak — close the IDE and reopen it, and the previous context is gone.

**Codex** (OpenAI's coding agent) uses git worktrees to isolate each task's runtime environment, paired with a local observability stack (logs, metrics, traces), so every change is verified in an independent environment. In repos with `AGENTS.md` and clear verification commands, it performs far better than in "bare" repos.

**AutoGPT** is the cautionary tale — lack of structured state management leads to context accumulation in long tasks, and lack of precise feedback mechanisms causes the agent to loop. Many people say AutoGPT "doesn't work," but really it's AutoGPT's harness that doesn't work.

The key insight: the same model in different harnesses can show order-of-magnitude performance differences. Anthropic's controlled experiment proves this directly: same prompt, same model (Opus 4.5), bare run 20min/$9 with broken output vs. full harness 6hr/$200 with working application.

## How to Do It Right

A harness has five subsystems. You need to make sure none of them drags the rest down.

**Instruction Subsystem (I)**: Create `AGENTS.md` (or `CLAUDE.md`) containing:
- Project overview and purpose (one sentence)
- Tech stack and versions (Python 3.11, FastAPI 0.100+, PostgreSQL 15)
- First-run commands (`make setup`, `make test`)
- Non-negotiable hard constraints ("All APIs must use OAuth 2.0")
- Links to more detailed documentation

**Tool Subsystem (T)**: Ensure the agent has sufficient tool access. Don't disable shell access for "security" — if the agent can't even run `pip install`, how is it supposed to work? But don't open everything either — follow least-privilege principles.

**Environment Subsystem (E)**: Make the environment state self-describing. Use `pyproject.toml` or `package.json` to lock dependencies, `.nvmrc` or `.python-version` for runtime versions, Docker or devcontainers for reproducibility.

**State Subsystem (S)**: Long tasks need progress tracking. Use a simple `PROGRESS.md` file recording: what's done, what's in progress, what's blocked. Update before each session ends, read when the next session starts.

**Feedback Subsystem (F)**: This is the highest-ROI subsystem. Explicitly list verification commands in `AGENTS.md`:
```
Verification commands:
- Tests: pytest tests/ -x
- Type check: mypy src/ --strict
- Lint: ruff check src/
- Full verification: make check (includes all above)
```

**Diagnosing harness quality**: Use "isometric model control." Keep the model fixed, remove subsystems one at a time, measure which removal causes the biggest performance drop. That's your bottleneck — focus your effort there.

## Real-World Example

A team using GPT-4o on a TypeScript + React frontend app (~20,000 lines of code) went through four stages:

**Stage 1 — Minimal harness**: Only a basic project description in README. 1 out of 5 runs succeeded (20%). Main failures: chose wrong package manager (npm vs yarn), didn't follow component naming conventions, couldn't run tests.

**Stage 2 — Added instruction subsystem**: Created `AGENTS.md` with tech stack versions, naming conventions, key architecture decisions. Success rate rose to 60%. Remaining failures were mainly environment issues and missing verification.

**Stage 3 — Added feedback subsystem**: Listed verification commands in `AGENTS.md`: `yarn test && yarn lint && yarn build`. Success rate rose to 80%.

**Stage 4 — Added state subsystem**: Introduced progress file templates where agents recorded completed and incomplete work each run. Success rate stabilized at 80-100%.

Four iterations, the model didn't change at all, success rate went from 20% to near 100%. That's the power of harness engineering.

## Key Takeaways

- Harness = Instructions + Tools + Environment + State + Feedback. Five subsystems, no skipping.
- If it's not model weights, it's harness. Your harness determines how much model capability gets realized.
- Among the five subsystems, the feedback subsystem usually has the lowest investment and highest return. Get your verification commands right first.
- Use "isometric model control" to quantify each subsystem's marginal contribution — don't go by gut feeling.
- Harness rots like code does. Audit regularly, pay down harness debt like you pay down technical debt.

## Further Reading

- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [HumanLayer: Harness Engineering for Coding Agents](https://humanlayer.dev/articles/harness-engineering-for-coding-agents/)
- [SWE-agent: Agent-Computer Interfaces](https://github.com/princeton-nlp/SWE-agent)
- [Thoughtworks: Harness Engineering on Technology Radar](https://www.thoughtworks.com/radar)

## Exercises

1. **Five-tuple harness audit**: Take a project where you use an AI agent and do a complete audit using the five-tuple framework. Score each subsystem 1-5. Find the lowest-scoring subsystem, spend 30 minutes improving it, then observe the change in agent performance.

2. **Isometric model control experiment**: Pick one model and one challenging task. Sequentially remove instructions (delete AGENTS.md), remove feedback (don't provide verification commands), remove state (no progress files) — remove only one at a time and measure the performance drop. Based on results, rank subsystem importance for your project.

3. **Affordance analysis**: Find a scenario where the agent in your project "wants to do something but can't" (e.g., knows it should use parameterized queries but doesn't know your project's ORM patterns). Analyze whether this is a Gulf of Execution (doesn't know how) or Gulf of Evaluation (doesn't know if it's right), then design a harness improvement to bridge it.
