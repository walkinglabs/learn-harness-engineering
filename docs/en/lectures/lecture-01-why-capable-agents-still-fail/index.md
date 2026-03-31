[中文版本 →](/zh/lectures/lecture-01-why-capable-agents-still-fail/)

> Code examples: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-01-why-capable-agents-still-fail/code/)
> Practice project: [Project 01. Prompt-only vs. rules-first](./../../projects/project-01-baseline-vs-minimal-harness/index.md)

# Lecture 01. Strong Models Don't Mean Reliable Execution

## What Problem Does This Lecture Solve?

You're paying for Claude Pro. GPT-4o keeps climbing benchmark leaderboards. SWE-bench scores get beaten every week. But when you actually let an AI agent loose on a real project — it adds a feature but breaks the tests, fixes a bug but introduces two more, runs for 20 minutes and proudly declares "done" while you look at code that doesn't do what you asked.

This isn't because the model isn't smart enough. It's because the working environment you gave it is terrible. This lecture explains why the strongest models still fail frequently on real engineering tasks, and why the root cause isn't the model — it's the harness you built (or didn't build) around it.

## Core Concepts

- **Capability Gap**: The huge gulf between model performance on benchmarks and performance on real tasks. A 50-60% pass rate on SWE-bench Verified means nearly half of real issues can't be resolved.
- **Harness**: Everything outside the model — instructions, tools, environment, state management, verification feedback. If it's not model weights, it's harness.
- **Harness-Induced Failure**: The model has enough capability, but the execution environment has structural defects. Anthropic's controlled experiment: same prompt, same model, bare run vs. full harness — output quality difference is night and day.
- **Verification Gap**: The gap between the agent's confidence in its output and actual correctness. The agent says "I'm done" when it's not done — this is the most common failure mode.
- **Diagnostic Loop**: Execute → observe failure → attribute to a specific harness layer → fix that layer → re-execute. This is the core methodology of harness engineering.
- **Definition of Done**: A set of machine-verifiable conditions — tests pass, lint is clean, type checks pass. Without an explicit definition of done, the agent will invent its own.

## Why This Happens

Let's start with data. As of late 2025, the strongest coding agents on SWE-bench Verified achieve roughly 50-60%. And that's on carefully selected tasks with clear issue descriptions and existing test cases. Move to a real daily development scenario — vague requirements, no existing tests, implicit business rules scattered everywhere — and that number only goes down.

But here's the counterintuitive fact: Anthropic ran a controlled experiment. Same prompt ("build a 2D retro game maker"), same model (Opus 4.5). Single-agent bare run: 20 minutes, $9 — the game's core features didn't work at all. Full harness (planner + generator + evaluator three-agent architecture): 6 hours, $200 — the game was playable. Same model, just harness from "bare" to "fully equipped."

OpenAI's 2025 harness engineering article puts it plainly: Codex in a well-harnessed repository goes from "unreliable" to "reliable" — note their wording, not "a bit better," but a qualitative shift. Anthropic's long-running agent documentation reaches similar conclusions: agents with explicit recovery paths, stable state management, and reliable feedback loops far outperform those without.

So what's actually going wrong? We can categorize common failure modes into five layers:

**Task Specification Layer**: When you say "add a search feature," the agent's understanding might be completely different from yours. Search what? Full-text or structured? Pagination? Highlighting? Fuzzy or exact? You didn't specify, so the agent guesses — and then you spend more time fixing the wrong guess than you would have spent being specific upfront.

**Context Provision Layer**: The project has implicit architectural conventions the agent doesn't know. Your team standardized on SQLAlchemy 2.0 syntax, but the agent writes 1.x code by default. All API endpoints must use OAuth 2.0, but that rule only exists in your head and a three-month-old Slack message. The agent can't see these.

**Execution Environment Layer**: Incomplete dev environment, missing dependencies, wrong tool versions. The agent burns precious context window on `pip install` failures and Node version mismatches instead of solving your actual task.

**Verification Feedback Layer**: No tests, no lint, or verification commands not communicated to the agent. The agent writes code, looks at it, decides it's fine, says "done." It's like asking a student to submit homework with no answer key to check against — they think they got it right, but you find a pile of errors when grading.

**State Management Layer**: Long tasks spanning sessions lose all discoveries from the previous session. Every new session re-explores the project structure and re-understands the code organization. Anthropic's data shows that agents without persistent state see failure rates spike sharply on tasks exceeding 30 minutes.

## How to Do It Right

Core principle: **When things fail, don't swap the model first — check the harness.** If the same model succeeds on similar, well-structured tasks, assume it's a harness problem.

Concrete steps:

1. **Attribute every failure to a specific layer.** Don't just say "the model sucks." Ask: was the task unclear? Was context insufficient? Were there no verification methods? Map each failure to one of the five layers above.

2. **Write an explicit Definition of Done for every task.** Don't say "add a search feature." Say:
   ```
   Completion criteria:
   - New endpoint GET /api/search?q=xxx
   - Supports pagination, default 20 items
   - Results include highlighted snippets
   - All new code passes pytest
   - Type checking passes (mypy --strict)
   ```

3. **Create an AGENTS.md file.** Put it in the repo root to tell the agent the project's tech stack, architectural conventions, and verification commands. This is the first step in harness engineering and the highest-ROI step you can take.

4. **Build a diagnostic loop.** Don't treat failures as "the model being dumb again." Treat them as signals that your harness has a defect. Each failure → identify the layer → fix it → never fail that way again. After a few rounds, your harness gets stronger and agent performance stabilizes.

5. **Quantify improvements.** Keep a simple log: did each task succeed or fail, and which layer caused the failure. After a few rounds you'll see which layer is the bottleneck — focus your energy there.

## Real-World Example

A team used Claude Sonnet to add a new API endpoint to a mid-sized Python web app (FastAPI + PostgreSQL + Redis, ~15,000 lines of code).

**Initial config**: Only the instruction "add user preferences endpoints under `/api/v2/users`."

**Result**: The agent spent 40% of its context window exploring the repo structure, produced code that looked reasonable but didn't follow the project's error handling patterns, used old SQLAlchemy syntax, and declared completion while the endpoint had runtime errors. The next session had to redo all the discovery work.

**After improvement**: The team added `AGENTS.md` (describing project architecture and tech stack versions), explicit verification commands (`pytest tests/api/v2/ && python -m mypy src/`), and architecture decision records. The same model succeeded in all three independent runs, with ~60% better context efficiency.

## Key Takeaways

- Model capability and execution reliability are different things. The strongest model in a terrible harness still crashes.
- When things fail, check the harness first, then the model. Swapping models is the most expensive option.
- Every failure is a signal: your harness has a structural defect. Find it, fix it.
- Five defense layers: task specification, context provision, execution environment, verification feedback, state management. Check them systematically.
- One `AGENTS.md` file might be more effective than upgrading to a more expensive model.

## Further Reading

- [OpenAI: Harness Engineering — Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [HumanLayer: Skill Issue — Harness Engineering for Coding Agents](https://humanlayer.dev/articles/harness-engineering-for-coding-agents/)
- [SWE-bench Leaderboard](https://www.swebench.com/)
- [Thoughtworks Technology Radar: Harness Engineering](https://www.thoughtworks.com/radar)

## Exercises

1. **Comparison experiment**: Pick a codebase you know well and a non-trivial modification task. First, run the agent with no harness support and record failures. Then add an `AGENTS.md` with explicit verification commands and run again with the same agent. Compare results, attributing each failure to one of the five defense layers.

2. **Verification gap measurement**: Pick 5 coding tasks. After each task, record whether the agent claims completion, then verify actual correctness with independent tests. Calculate the proportion of times the agent claims done when it's actually not done — that's your verification gap. Then think: what verification commands would reduce this proportion?

3. **Diagnostic loop practice**: Find a task where the agent repeatedly fails in your project. Run once, record the failure. Attribute it to one of the five layers. Fix that layer. Run again. Repeat three to five rounds, recording improvements each time.
