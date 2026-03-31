[中文版本 →](/zh/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/)

> Code examples: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/code/)
> Practice project: [Project 02. Agent-readable workspace](./../../projects/project-02-agent-readable-workspace/index.md)

# Lecture 03. Make the Repository Your Single Source of Truth

## What Problem Does This Lecture Solve?

Your team's architecture decisions are scattered across Confluence, Slack, Jira, and a few senior engineers' heads. For humans this barely works — you can ask a colleague, search chat history, dig through docs. But for an AI agent, information that's not in the repository simply does not exist.

This lecture explains why you must put everything an agent needs to know into the repo, and how to do it without turning into "writing a bunch of docs nobody reads." The core idea isn't "write more documentation" — it's "put critical decision information where the agent can see it."

## Core Concepts

- **Knowledge Visibility Gap**: The proportion of total project knowledge that's NOT in the repository. The bigger the gap, the higher the agent's failure rate.
- **Single Source of Truth**: The code repository as the authoritative source for project decisions, architecture constraints, execution state, and verification standards. The repo is the final word.
- **Cold-Start Test**: Open a brand new agent session using only repo contents — can it answer five basic questions: What is this system? How is it organized? How do I run it? How do I verify it? Where are we now?
- **Discovery Cost**: How much context budget the agent burns to find a key piece of information in the repo. Information hidden in obscure locations has high discovery cost, leaving less budget for the actual task.
- **Knowledge Decay Rate**: The proportion of knowledge entries that become stale per unit of time. Documentation going out of sync with code is the biggest enemy.
- **ACID for Agent State**: Applying database transaction principles (Atomicity, Consistency, Isolation, Durability) to agent state management.

## Why This Happens

Think about what an agent's inputs actually are: system prompts and task descriptions, file contents from the repository, and tool execution output. That's it. Your Slack history, Jira tickets, Confluence pages, and that architecture decision you discussed with a colleague over coffee on Friday afternoon — the agent can't see any of it.

This isn't a bug — it's the agent's cognitive architecture. It can't "go ask someone" or "search the chat history" like a human would.

This creates a practical problem: when critical project knowledge only exists outside the repo, the agent either does it wrong (because it doesn't know an implicit rule) or wastes enormous context re-discovering that knowledge. And every new session has to redo this discovery.

OpenAI's harness engineering article states this bluntly: **information that doesn't exist in the repo, doesn't exist for the agent.** They call this the "repo as spec" principle — the repository itself is the highest-authority specification document.

Anthropic's long-running agents documentation echoes this: persistent state is a necessary condition for long-task continuity. Cross-session knowledge recoverability directly determines task success rates. And this state must exist in the repository — because that's the only stable, accessible storage the agent has.

You might think: "Our team is small, knowledge is in everyone's heads, and it works fine." Sure, for humans. But if you're using an agent, accept this fact: the agent can't ask people. Everything it needs to know must be written down and placed where it can find it.

This isn't about "writing more documentation." It's about "putting decision information in the right place." A 50-line `ARCHITECTURE.md` in the `src/api/` directory is ten thousand times more useful than a 500-page design document in Confluence that nobody maintains.

## How to Do It Right

**Principle 1: Knowledge lives next to code.** A rule about API endpoint authentication belongs next to the API code, not buried in a giant global document. Put a short doc in each module directory explaining that module's responsibilities, interfaces, and special constraints.

**Principle 2: Use a standardized entry file.** `AGENTS.md` (or `CLAUDE.md`) is the agent's "landing page." It doesn't need to contain all information, but it must let the agent quickly answer three questions: "What is this project," "How do I run it," and "How do I verify it." 50-100 lines is enough.

**Principle 3: Minimal but complete.** Every piece of knowledge should have a clear use case. If removing a rule doesn't affect the agent's decision quality, that rule shouldn't exist. But every question from the cold-start test must have an answer.

**Principle 4: Update with code.** Bind knowledge updates to code changes. The simplest approach: put architecture docs in the corresponding module directory. When you modify code, you naturally see the doc. After code changes, CI can remind you to check if docs need updating.

**Concrete repo structure**:

```
project/
├── AGENTS.md              # Entry: project overview, run commands, hard constraints
├── src/
│   ├── api/
│   │   ├── ARCHITECTURE.md  # API layer architecture decisions
│   │   └── ...
│   ├── db/
│   │   ├── CONSTRAINTS.md   # Database operation hard constraints
│   │   └── ...
│   └── ...
├── PROGRESS.md             # Current progress: done, in-progress, blocked
└── Makefile                # Standardized commands: setup, test, lint, check
```

**Managing agent state with ACID principles**:

- **Atomicity**: Each "logical operation" (e.g., "add new endpoint and update tests") gets one git commit. If it fails midway, `git stash` to roll back.
- **Consistency**: Define "consistent state" verification predicates — all tests pass, lint reports zero errors. The agent runs verification after each operation; inconsistent intermediate states don't get committed.
- **Isolation**: When multiple agents work concurrently, design state files to avoid race conditions. Simple approach: each agent uses its own progress file, or use git branches for isolation.
- **Durability**: Critical project knowledge lives in git-tracked files. Temporary state can stay in session memory, but cross-session knowledge must be persisted to files.

## Real-World Example

A team maintained an e-commerce platform with ~30 microservices. Architecture decisions (inter-service communication protocols, data consistency strategies, API versioning rules) were scattered across: Confluence (partially outdated), Slack (hard to search), a few senior engineers' heads (not scalable), and sporadic code comments (not systematic).

After introducing AI agents, 70% of tasks required human intervention. Nearly every failure involved the agent violating some "everyone knows but nobody wrote down" implicit constraint.

The team executed a transformation:
1. Created `AGENTS.md` in the repo root with project overview, tech stack versions, and global hard constraints
2. Added `ARCHITECTURE.md` in each microservice directory describing responsibilities, interfaces, and dependencies
3. Created a centralized `CONSTRAINTS.md` with hard constraints in explicit "MUST/MUST NOT" language
4. Added `PROGRESS.md` in each service directory tracking current work status

After transformation: the same agent could answer all key project questions on cold start, and task completion quality improved significantly (Anthropic's controlled experiment showed that a full harness enables agents to deliver runnable applications, while bare runs cannot).

## Key Takeaways

- Knowledge not in the repo doesn't exist for the agent. Putting critical decisions in the repo is the most basic harness investment.
- Use the "cold-start test" to evaluate repo quality: can a fresh session answer five basic questions using only repo contents?
- Knowledge should be near code, minimal but complete, and updated with code. It's not about writing more docs — it's about putting information in the right place.
- Use ACID principles for agent state: atomic commits, consistency verification, concurrency isolation, durable critical knowledge.
- Knowledge decay is the biggest enemy. Documentation out of sync with code is more dangerous than no documentation.

## Further Reading

- [OpenAI: Harness Engineering](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Infrastructure as Code — Martin Fowler](https://martinfowler.com/bliki/InfrastructureAsCode.html)
- [ADR: Architecture Decision Records](https://adr.github.io/)
- [The Twelve-Factor App](https://12factor.net/)

## Exercises

1. **Cold-start test**: Open a completely fresh agent session in your project (no verbal context, repo contents only). Ask it five questions: What is this system? How is it organized? How do I run it? How do I verify it? What's the current progress? Record what it can't answer, then improve the repo until it can.

2. **Knowledge externalization quantification**: List all decisions and constraints important for development work in your project. Mark each as inside or outside the repo. Calculate your knowledge visibility gap (proportion outside repo). Make a plan to get it below 10%.

3. **ACID assessment**: Evaluate your project's state management using this lecture's ACID analogy. Atomicity — can agent operations be cleanly rolled back? Consistency — is there "consistent state" verification? Isolation — do concurrent agents step on each other? Durability — is all cross-session knowledge persisted?
