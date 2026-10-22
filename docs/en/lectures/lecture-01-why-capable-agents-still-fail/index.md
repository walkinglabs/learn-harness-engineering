[中文版 →](../../../zh/lectures/lecture-01-why-capable-agents-still-fail/)

> Code examples: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-01-why-capable-agents-still-fail/code/)
> Practice project: [Project 01. Prompt-Only vs. Rules-First: How Much Difference Does a Harness Make](./../../projects/project-01-baseline-vs-minimal-harness/index.md)

# Lecture 01. Strong Models Don't Mean Reliable Execution

On September 29, 2025, Anthropic reported Claude Sonnet 4.5 at [77.2% on SWE-bench Verified](https://www.anthropic.com/news/claude-sonnet-4-5). That number sounds decent at first glance — but don't celebrate just yet. Those are carefully selected tasks with clear issue descriptions and ready-made test cases. Hand the agent your everyday requirements instead — vague specs, no existing tests, implicit business rules scattered across the codebase — and the pass rate only drops further. You hand off a task brimming with confidence, the agent runs for 20 minutes and tells you "all done," and you look at the code: it added a feature but broke the tests, fixed a bug but introduced new ones, and it's not even what you asked for.

When this happens, most people's first reaction is "the model isn't good enough — let me try a more expensive one." Before you reach for your wallet, consider that the problem might not be the model at all.

## Same Horse, Different Fates

Anthropic compared the same prompt ("build a 2D retro game editor") and the same model (Opus 4.5) under two harnesses. First run: bare, no support — 20 minutes, $9; the app opened, but entities did not respond to input. Second run: full harness — a planner, generator, evaluator three-agent architecture — 6 hours, $200; the author could move an entity, but physics had rough edges and a wall blocked progress. [Core gameplay worked; the app was not finished.](https://www.anthropic.com/engineering/harness-design-long-running-apps)

They didn't change the model. Opus 4.5 was still Opus 4.5. What changed was the tack.

OpenAI's 2025 harness engineering article puts it even more bluntly. They said that Codex in a well-harnessed repository goes from "unreliable" straight to "reliable." Note the wording — not "a bit better," but a qualitative leap. Harness here means **all the engineering infrastructure beyond the model weights.**

## Where Agents Actually Get Stuck

The specific failure modes really come down to just a handful:

- **Vague requirements — the agent can only guess.** "Add a search feature" — that sentence means almost nothing. Search what? Full-text or structured queries? Should results be paginated? Highlighted? You didn't spell it out, so the agent has to guess. A correct guess is luck; a wrong one means rework that costs several times more than being specific would have in the first place.
- **Implicit conventions not written down — the agent has no way to comply.** Your whole team uses the new SQLAlchemy 2.0 syntax, but the agent writes 1.x code by default. All API endpoints must go through OAuth 2.0 authentication, but that rule only exists in your head and a Slack message from three months ago. The agent has no idea — it's not that it doesn't want to comply, it literally has never seen the rule.
- **Incomplete environment setup — the agent spends energy fixing the environment.** Incomplete dev setup, missing dependencies, wrong tool versions — the agent burns precious context window on `pip install` errors and Node version conflicts instead of doing the actual work you gave it.
- **No verification methods — the agent calls it done when it feels done.** No tests, no lint, or verification commands that were never communicated to the agent. The agent writes code, looks it over, decides it seems fine, and declares completion. Anthropic also observed an interesting phenomenon: when agents sense their context is running low, they rush to finish, skip verification steps, and choose a simple solution over the optimal one. They call this "context anxiety."
- **Cross-session state loss — every new session starts from scratch.** All discoveries from the previous session are lost. Every new session has to re-explore the project structure and re-understand the code organization. Agents without persistent state see failure rates spike sharply on tasks exceeding 30 minutes.

## Key Terminology

With the scenarios above in mind, these concepts are no longer just jargon:

- **Capability Gap**: The huge gulf between model performance on benchmarks and performance on real tasks. Benchmark tasks come with clear issue descriptions, tests, and an environment; real tasks often require you to supply them.
- **Harness**: Everything outside the model — instructions, tools, environment, state management, verification feedback. If it's not model weights, it's harness. What we've been calling the "tack."
- **Harness-Induced Failure**: The model has sufficient capability, but the execution environment has structural defects. The retro-game comparison above is an example.
- **Verification Gap**: The gap between the agent's confidence in its output and actual correctness. The agent says "I'm done" when it's not — this is the most common failure mode.
- **Diagnostic Loop**: Execute, observe failure, attribute to a specific harness layer, fix that layer, re-execute. This is the core methodology of harness engineering.
- **Definition of Done**: A set of conditions that can be verified by command — tests pass, lint is clean, type checks pass. Without an explicit definition of done, the agent will invent its own.

## When Things Fail, Fix the Harness First

There is really only one core principle: **When things fail, don't swap the model first — check the harness.** If the same model succeeds on similar, well-structured tasks, assume it's a harness problem.

What does this look like in practice? Attribute every failure to a specific layer. Don't just say "the model isn't good enough." Ask yourself: was the task unclear? Was context insufficient? Were there no verification methods? Map each failure to one of the five defense layers — task specification, context provision, execution environment, verification feedback, or state management. These are failure-diagnosis layers, not additional core concepts. Build this habit, and you'll find "the model isn't good enough" appearing less and less in your logs.

Then, write an explicit Definition of Done for every task. Don't say "add a search feature." Spell it out:
```
Completion criteria:
- New endpoint GET /api/search?q=xxx
- Supports pagination, default 20 items
- Results include highlighted snippets
- All new code passes pytest
- Type checking passes (mypy --strict)
```

Place an `AGENTS.md` file in the repo root, telling the agent about the project's tech stack, architectural conventions, and verification commands. This is the first step in harness engineering, and the one with the highest return on investment. One `AGENTS.md` file might be more effective than upgrading to a more expensive model — and that's not a joke.

From there, build a diagnostic loop. Don't treat failures as "the model being dumb again." Treat them as signals that your harness has exposed a defect. Each failure, identify the layer, fix it, and never fail that way again. After a few rounds, your harness gets stronger and agent performance stabilizes. A simple log is enough — for each task, did it succeed or fail, and which layer caused the failure. After a few rounds you'll see which layer is the bottleneck, and you can focus your energy there.

## The Million-Line Experiment

In August 2025, three engineers at OpenAI started an experiment. The rules were simple: they wouldn't write code themselves — only Codex would. Starting from an empty git repository, [five months later the repo contained roughly one million lines of code](https://openai.com/index/harness-engineering/). Application logic, infrastructure, tooling, documentation — all agent-generated. The team later grew to seven engineers; over the period it merged about 1,500 PRs, an average of 3.5 per engineer per day.

Early progress was surprisingly slow. Codex wasn't bad — it just lacked tools and structures complete enough to drive toward high-level objectives. The three engineers gradually found the pattern: break large goals into small building blocks — design, code, review, test — let the agent assemble them one by one, then use those blocks to compose more complex tasks. Whenever something went wrong, the problem was almost never "not trying hard enough." It was always "what is the agent still missing, and can that missing capability be supplied in a way that is both understandable and executable?"

This experiment directly proves this lecture's core thesis: **the same model produces fundamentally different output in a bare environment versus one with a complete harness.** The model didn't change. The environment did.

> Source: [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)

## A More Down-to-Earth Example

A team used Claude Sonnet to add new API endpoints to a mid-sized Python web app (FastAPI + PostgreSQL + Redis, ~15,000 lines of code).

Initially they gave only one sentence: "add user preferences endpoints under `/api/v2/users`." The result? The agent spent much of the session exploring the repo structure, produced code that looked reasonable but didn't follow the project's error handling patterns, used old SQLAlchemy syntax, and declared completion while the endpoint had runtime errors. The next session had to redo all the discovery work.

Later they added `AGENTS.md` (describing project architecture and tech stack versions), explicit verification commands (`pytest tests/api/v2/ && python -m mypy src/`), and architecture decision records. The same model then followed the project's conventions and checked its work with commands it could run.

They didn't change the model. They changed the harness.

## Key Takeaways

- Model capability and execution reliability are two different things. Even a thoroughbred needs good tack.
- When things fail, check the harness first, then the model. Swapping models is the most expensive option — and more often than not, it's not even a model problem.
- Every failure is a signal: your harness has a structural defect. Find it and fix it.
- Don't just say "the model isn't good enough." Work through the five layers systematically: task not clearly defined, insufficient context, misconfigured environment, missing verification, loss of state between sessions. Nine times out of ten the problem lives in one of those layers.
- One `AGENTS.md` file might be more effective than upgrading to a more expensive model.

## Further Reading

- [OpenAI: Harness Engineering — Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [HumanLayer: Skill Issue — Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [SWE-bench Leaderboard](https://www.swebench.com/)
- [Thoughtworks Technology Radar: Harness Engineering](https://www.thoughtworks.com/radar)

## Exercises

1. **Comparison experiment**: Pick a codebase you know well and a non-trivial modification task. First, run the agent with no harness support and record failures. Then add an `AGENTS.md` and explicit verification commands, and run again with the same agent. Compare the two results, attributing each failure to one of the five defense layers.

2. **Verification gap measurement**: Pick 5 coding tasks. After each task, record whether the agent claims completion, then verify actual correctness with independent tests. Calculate the proportion of times the agent claims done when it's actually not done — that's your verification gap. Then think: what verification commands would reduce this proportion?

3. **Diagnostic loop practice**: Find a task where the agent repeatedly fails in your project. Run once, record the failure. Attribute it to one of the five layers. Fix that layer. Run again. Repeat three to five rounds, recording improvements each time.
