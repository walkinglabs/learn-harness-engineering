[中文版本 →](../../../zh/lectures/lecture-01-why-capable-agents-still-fail/)

> Code examples: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-01-why-capable-agents-still-fail/code/)
> Practice project: [Project 01. Prompt-only vs. rules-first](./../../projects/project-01-baseline-vs-minimal-harness/index.md)

# Lecture 01. Strong Models Don't Mean Reliable Execution

You consider yourself well-traveled in the AI world — Claude Pro subscription, GPT-4o API key, SWE-bench leaderboard numbers memorized. One day you finally hand a real project to an AI agent, brimming with confidence. The result? It adds a feature but breaks the tests, fixes a bug but introduces two more, runs for 20 minutes and proudly declares "done" — and you look at the code and it's not what you asked for at all.

Your first instinct? "This model isn't good enough. Time to upgrade." Hold on. Before you reach for your wallet, consider that the problem might not be the model at all.

Let's look at some numbers. As of late 2025, the strongest coding agents on SWE-bench Verified achieve roughly 50-60%. And that's on carefully selected tasks with clear issue descriptions and existing test cases. Move to your daily development environment — vague requirements, no existing tests, implicit business rules scattered everywhere — and that number only goes down.

But behind these numbers lies a counterintuitive truth.

## Same Horse, Different Fates

Anthropic ran a controlled experiment. Same prompt ("build a 2D retro game maker"), same model (Opus 4.5). First run: bare, no support — 20 minutes, $9, the game's core features didn't work at all. Second run: full harness (planner + generator + evaluator three-agent architecture) — 6 hours, $200, the game was playable.

They didn't change the model. Opus 4.5 was still Opus 4.5. What changed was the saddle.

OpenAI's 2025 harness engineering article puts it plainly: Codex in a well-harnessed repository goes from "unreliable" to "reliable." Note their wording — not "a bit better," but a qualitative shift. Like a thoroughbred: you can ride it without a saddle, but you won't go far, won't go fast, and falling off is no surprise. The harness is that saddle — **everything in the engineering infrastructure outside the model weights.**

## Where Agents Actually Get Stuck

So what specifically goes wrong?

The most common: you never clearly defined the task. You say "add a search feature," and the agent's understanding is completely different from yours — search what? Full-text or structured? Pagination? Highlighting? You didn't specify, so the agent guesses. A correct guess is luck; a wrong one costs more to fix than being specific would have cost in the first place. It's like walking into a restaurant and telling the chef "I'll have fish" — whether you get it braised, steamed, or in a hot pot is entirely up to chance.

Even when you do specify, the project has implicit architectural conventions the agent doesn't know. Your team standardized on SQLAlchemy 2.0 syntax, but the agent writes 1.x code by default. All API endpoints must use OAuth 2.0 authentication, but that rule only exists in your head and a Slack message from three months ago. The agent can't see these — it's not that it doesn't want to comply, it literally doesn't know these rules exist.

The environment is a trap too. Incomplete dev environment, missing dependencies, wrong tool versions. The agent burns precious context window on `pip install` failures and Node version mismatches instead of solving your actual task. Like hiring a skilled carpenter but forgetting to provide a hammer, nails, or a level workbench — no matter how talented, they can't do the job.

Even more common: there's simply no way to verify. No tests, no lint, or verification commands never communicated to the agent. The agent writes code, looks at it, decides it's fine, says "done." It's like asking a student to submit homework with no answer key — they think they got it right, but when you grade it there's a pile of errors. Anthropic also observed an interesting phenomenon: when agents sense context is running low, they rush to finish, skip verification, and choose a simple solution over the optimal one. They call it "context anxiety" — the same thing that happens when you realize time is almost up on an exam and start randomly guessing on the remaining multiple-choice questions.

Long tasks spanning sessions are even worse — all discoveries from the previous session are lost, and every new session has to re-explore the project structure and re-understand the code organization. Agents without persistent state see failure rates spike sharply on tasks exceeding 30 minutes.

## Core Concepts

With these scenarios in mind, these concepts are no longer just jargon:

- **Capability Gap**: The huge gulf between model performance on benchmarks and performance on real tasks. A 50-60% pass rate on SWE-bench Verified means nearly half of real issues can't be resolved.
- **Harness**: Everything outside the model — instructions, tools, environment, state management, verification feedback. If it's not model weights, it's harness. What we've been calling the "saddle."
- **Harness-Induced Failure**: The model has enough capability, but the execution environment has structural defects. Anthropic's controlled experiment already proved this.
- **Verification Gap**: The gap between the agent's confidence in its output and actual correctness. The agent says "I'm done" when it's not done — this is the most common failure mode.
- **Diagnostic Loop**: Execute, observe failure, attribute to a specific harness layer, fix that layer, re-execute. This is the core methodology of harness engineering.
- **Definition of Done**: A set of machine-verifiable conditions — tests pass, lint is clean, type checks pass. Without an explicit definition of done, the agent will invent its own.

## When Things Fail, Fix the Harness First

Core principle: **When things fail, don't swap the model first — check the harness.** If the same model succeeds on similar, well-structured tasks, assume it's a harness problem. It's like a car breaking down — you don't immediately suspect the engine. You check if it's out of gas first.

Concrete steps:

**Attribute every failure to a specific layer.** Don't just say "the model sucks." Ask: was the task unclear? Was context insufficient? Were there no verification methods? Map each failure to one of the five layers above. Build this habit, and you'll find "the model isn't good enough" appearing less and less in your logs.

**Write an explicit Definition of Done for every task.** Don't say "add a search feature." Say:
```
Completion criteria:
- New endpoint GET /api/search?q=xxx
- Supports pagination, default 20 items
- Results include highlighted snippets
- All new code passes pytest
- Type checking passes (mypy --strict)
```

**Create an AGENTS.md file.** Put it in the repo root to tell the agent the project's tech stack, architectural conventions, and verification commands. This is the first step in harness engineering and the highest-ROI step you can take. One `AGENTS.md` file might be more effective than upgrading to a more expensive model — I'm not joking.

**Build a diagnostic loop.** Don't treat failures as "the model being dumb again." Treat them as signals that your harness has a defect. Each failure, identify the layer, fix it, never fail that way again. After a few rounds, your harness gets stronger and agent performance stabilizes. Like road repair — every pothole you fill makes the next stretch smoother.

**Quantify improvements.** Keep a simple log: did each task succeed or fail, and which layer caused the failure. After a few rounds you'll see which layer is the bottleneck — focus your energy there.

## The Million-Line Experiment

OpenAI ran an aggressive experiment in 2025: use Codex to build a complete internal product from an empty git repository. Five months later, the repo had roughly one million lines of code — application logic, infrastructure, tooling, documentation, internal dev tools — all agent-generated. Three engineers drove Codex, opening and merging about 1,500 PRs. An average of 3.5 PRs per person per day.

The key constraint: **humans never write code directly.** This wasn't a gimmick — it was designed to force the team to figure out what changes when the engineer's primary job is no longer writing code, but designing environments, expressing intent, and building feedback loops.

Early progress was slower than expected. Not because Codex wasn't capable, but because the environment wasn't complete enough — the agent lacked necessary tools, abstractions, and internal structures to advance high-level objectives. The engineers' work became: breaking large goals into small building blocks (design, code, review, test), letting the agent assemble them, then using those blocks to unlock more complex tasks. When something failed, the fix was almost never "try harder" — it was "what capability is the agent missing, and how do we make it both understandable and executable?"

This experiment directly proves this lecture's core thesis: **the same model produces fundamentally different output in a bare environment versus one with a complete harness.** The model didn't change. The environment did.

> Source: [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)

## A More Down-to-Earth Example

A team used Claude Sonnet to add a new API endpoint to a mid-sized Python web app (FastAPI + PostgreSQL + Redis, ~15,000 lines of code).

Initially they gave only one sentence: "add user preferences endpoints under `/api/v2/users`." The result? The agent spent 40% of its context window exploring the repo structure, produced code that looked reasonable but didn't follow the project's error handling patterns, used old SQLAlchemy syntax, and declared completion while the endpoint had runtime errors. The next session had to redo all the discovery work.

Later they added `AGENTS.md` (describing project architecture and tech stack versions), explicit verification commands (`pytest tests/api/v2/ && python -m mypy src/`), and architecture decision records. The same model succeeded in all three independent runs, with ~60% better context efficiency.

They didn't change the model. They changed the harness.

## Key Takeaways

- Model capability and execution reliability are different things. A thoroughbred still needs a good saddle.
- When things fail, check the harness first, then the model. Swapping models is the most expensive option — and often it's not even a model problem.
- Every failure is a signal: your harness has a structural defect. Find it, fix it.
- Five defense layers: task specification, context provision, execution environment, verification feedback, state management. Check them systematically, like a doctor ruling out the most common causes first.
- One `AGENTS.md` file might be more effective than upgrading to a more expensive model. Seriously.

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
