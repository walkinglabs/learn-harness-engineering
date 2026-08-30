# Frontier Harness Design Breakdowns

This section takes the harness theory covered in the course lectures and compares it, product by product, with today's most advanced real-world products. For each product, we focus on just one question: **how is its harness designed?** In other words, we examine the engineering infrastructure surrounding the model: the five subsystems of instructions, tools, environment, state, and feedback, as well as core mechanisms such as context continuity, initialization, verification, observability, handoffs, and loops.

We deliberately do not discuss how strong the model's reasoning is, how high it scores on a particular benchmark, or broadly introduce "what this agent can do." Those are questions at the model and product layers. Here, we examine only the harness—everything outside the model weights.

## Why These Breakdowns Matter

The first lecture explains that strong model capabilities do not guarantee reliable execution. The same model can perform an order of magnitude differently in different harnesses. But while the lectures explain "what should be done," these products show "what leading teams actually do."

Each product represents an independent set of design decisions. Comparing them side by side reveals how different teams implement the same core mechanisms in entirely different ways:

- **Pi** builds its harness as a minimal core with programmable extensions, using a "minimal system prompt + on-demand loading" approach to context engineering.
- **Claude Code** builds its harness as a complete runtime environment: layered memory, five-layer compaction, permissions, hooks, and subagents.
- **Codex** takes the harness philosophy to its logical extreme: the repository is the system of record, AGENTS.md is only a directory page, and worktrees isolate environments.
- **DeepSeek Harness** defines the harness itself as a model-independent runtime: Everything is a Plugin.

## Articles

- [Breaking Down Pi's Harness Design](./pi/): A minimal core with programmable extensions that moves context engineering beyond the system prompt.
- [Breaking Down Claude Code's Harness Design](./claude-code/): Layered memory, five-layer compaction, permissions, and hooks—a complete agent runtime environment.
- [Breaking Down Codex's Harness Design](./codex/): The repository as the system of record, AGENTS.md as a directory page, environment isolation, and feedback loops.
- [Breaking Down DeepSeek Harness's Design](./deepseek/): Everything is a Plugin, including the agent loop itself.
- [Breaking Down the PerryLink DSH Plugin Family's Design](./perrylink-plugins/): 33 third-party plugins as a live case study — the install contract, seam discipline, session-event version gates, and verification as a product surface.

## How to Read This Section

We recommend starting with the first few lectures—especially [Lecture 2: What a Harness Actually Is](../lectures/lecture-02-what-a-harness-actually-is/)—to establish the five-subsystem framework, then returning here to see how real products implement these mechanisms.

Each article ends with "Mapping to the Course Framework" and "Designs Worth Adopting" sections. These help you quickly translate product design choices back into course concepts so you can apply them directly to your own projects.
