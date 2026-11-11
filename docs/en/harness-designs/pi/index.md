# Breaking Down Pi's Harness Design

[Pi](https://pi.dev/) (npm package `@earendil-works/pi-coding-agent`) describes itself as a "minimal agent harness." That phrase is worth unpacking: it does not call itself "the most powerful coding agent" or "the best AI programming tool." Instead, it anchors its identity firmly in the word **harness**.

In this article, we use the course's five-subsystem framework—instructions, tools, environment, state, and feedback—to examine Pi and identify how its design philosophy differs fundamentally from Claude Code and Codex. Here is the answer up front: **Pi's philosophy is "minimize the core + make extensions programmable." It moves context engineering beyond the system prompt and lets users—even Pi itself—modify the harness, instead of having Pi decide the harness for you.**

## In One Sentence

Pi is a minimal core: its official positioning deliberately keeps the core small and returns control to you. In the words of the [pi.dev homepage](https://pi.dev/), "Ask Pi to build what you want, or install a package that does it your way." It divides the harness into four customizable layers:

- **Extensions**: TypeScript hooks attached to Pi lifecycle events, providing a programmable surface at the runtime level.
- **Skills**: On-demand capability packages containing instructions and tools, using progressive disclosure.
- **Prompt templates**: Reusable Markdown prompts that expand when you enter `/name`.
- **Themes**: The appearance of the TUI.

This layered approach is itself a form of harness design: **rules and extensions fully determine what the model can see and when it can see it, instead of those decisions being hard-coded into the core.**

## Core Loop

Like every coding agent, Pi is fundamentally a while loop of "reasoning → tool execution → observation → more reasoning." What matters is not the loop itself, but how Pi handles the layer around it: it expands context management from "compaction" inside the loop to "control" outside the loop.

Pi's runtime exposes a programmable interface. In addition to an interactive TUI, the [Programmatic Usage section of the source README](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) supports scriptable print/JSON modes, an RPC protocol, and SDK embedding. This means the same harness can be driven one step at a time by a human or automatically by CI/CD or another program. It provides the prerequisite for moving "from manual control to automated loops" described in Lecture 13 on loop engineering: a harness that can only be driven interactively by humans can never enter an automated loop.

## Instruction Subsystem: AGENTS.md and SYSTEM.md

Pi is restrained in how it handles instructions, but its hierarchy is clear:

- **AGENTS.md**: The [Project Context Files section of the source README](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) explicitly documents the loading order: global `~/.pi/agent/AGENTS.md` → traverse parent directories upward level by level → current-directory `./AGENTS.md` (with CLAUDE.md compatibility as well). This puts "the repository as the system of record" into practice—instructions are files, not reminders typed into a chat box.
- **SYSTEM.md**: The [official pi.dev documentation](https://pi.dev/docs/usage/project-context) says the default system prompt can be replaced or appended to per project. This is Pi's only official entry point for modifying the "system prompt" and also serves as its "environment self-description" layer.

Pi officially emphasizes that its system prompt is **minimal**. This reflects an explicit tradeoff: the core does not pack in long lists of "if...then..." rules. Instead, it exposes extension points so rules appear as skills and extensions only when needed. This directly echoes Lecture 4, "Why One Giant Instruction File Fails"—Pi naturally avoids the giant-instruction-file problem through a "minimal core + split files + on-demand loading" approach.

## State and Context: Where Pi Is Most Granular

Pi's context engineering deserves special attention because it turns course concepts such as "context continuity" and "preventing context corruption" into concrete mechanisms:

**1. Programmable compaction.** As the context limit approaches, old messages are automatically summarized. The [official pi.dev documentation](https://pi.dev/docs/usage/sessions) explains that the compaction strategy itself is **customizable**: you can use extensions to implement topic-based compaction, code-aware summaries, or even use a different model for summarization. The source README also reveals details of the default mechanism: automatic compaction is triggered in two cases (recovery from context overflow / exceeding the retention threshold), the split point preserves approximately the most recent 20,000 tokens, and earlier messages are summarized into a "context handoff" and compacted incrementally in a chain. In other words, Pi treats "how to compact" not as a fixed constant, but as part of the harness.

**2. Dynamic context.** The [official pi.dev documentation](https://pi.dev/docs/usage/extensions) says extensions can inject messages before every reasoning turn, filter message history, implement RAG, and build long-term memory. This goes beyond "compact when the context is full": it lets you decide what enters the context window before it gets there. In terms of the course's goals of "making agent execution observable and debuggable" and "maintaining context continuity," Pi pushes both down into the extension surface.

**3. Session tree.** The [pi.dev homepage](https://pi.dev/) explicitly says "sessions are stored as trees"; `/tree` can return to any historical node and continue from there, with every branch stored in the same file. This addresses the cross-session context breaks repeatedly emphasized in the course—not by forcing summaries to bridge the gap, but through structured history replay. Branches can be exported as HTML or uploaded as a gist for sharing, which also provides observability.

## Tool Subsystem: Skills and Extensions

Pi's "tools" have two layers:

- **Skills**: The [Skills section of the source README](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) defines these clearly as "self-contained capability packages that the agent loads on-demand." They contain instructions and tools and follow the Agent Skills standard. Progressive disclosure ensures that skill details enter the context only when triggered, **without blowing up the prompt cache**. This is harness design from a cost perspective: every extra token in the context has to be paid for on every inference. Loading skills on demand is another expression of "give the map, not the manual."
- **Extensions**: TypeScript hooks attached to built-in lifecycle events. The [Hooks section of the source README](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) gives official examples: intercepting dangerous commands (a permission gate), checkpointing code state when switching tasks, protecting paths (for example, prohibiting writes to `.env`), modifying tool output before passing it to the model, and injecting messages from external sources (file watchers/Webhooks/CI) to wake the agent. These hook APIs are also exported from `@mariozechner/pi-coding-agent/hooks`. The community harness [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness) further packages this hook surface into ready-made extensions such as skill-router, session-summary, extract-patterns, and telemetry.

Extensions are Pi's most important design decision: **instead of merely giving users a few toggles, Pi exposes the entire event surface inside the runtime.** Want to add memory? Inject it at `agent/pre-step`. Want to record behavior? Subscribe to session events. Want to modify a model request? Hook into `agent/request`. You can have Pi modify its own harness—this comes closer to the definition of a "programmable harness" than any set of configuration options.

## Feedback and Verification: Making "Learning" Part of the Harness

Pi itself does not include mandatory test gates (users must specify verification commands in AGENTS.md), but the community harness [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness) uses extensions to structure the "feedback loop." The official README's Hooks section provides the foundation for similar mechanisms:

- **session-summary** (a pi-agent-harness extension): Maintains rolling `PROGRESS.md` entries—the course's state subsystem, used for progress tracking on long-running tasks.
- **extract-patterns** (a pi-agent-harness extension): Collects candidate lessons from sessions and records them in `LESSONS.md`—turning "leave a good handoff before every session ends" from a convention into a mechanism.
- **telemetry** (a pi-agent-harness extension): Records token usage, cost, and related metrics—observability.

The same community repository further demonstrates the pattern: `VISION.md` (goals), `PROGRESS.md` (progress), `LESSONS.md` (lessons), and `STANDARDS.md` (standards) are all Markdown files persisted across sessions. This is exactly the "repository as the system of record + progress files + handoff mechanism" pattern recommended by the course, made available out of the box through Pi's extension mechanism.

## Mapping to the Course Framework

Scoring Pi with the course's five subsystems (subjective, for comparison):

| Subsystem | Pi's Implementation | Assessment |
| --- | --- | --- |
| Instructions | Hierarchical AGENTS.md loading + SYSTEM.md | Clear hierarchy, but users must write the rules themselves |
| Tools | On-demand skills + full-lifecycle extension hooks | Extremely strong; turns the tool system into a programmable surface |
| Environment | SYSTEM.md for environment self-description; users declare the runtime environment in AGENTS.md | The mechanism is open, but reproducibility depends on user-written descriptions |
| State | Session tree + customizable compaction + PROGRESS.md | Extremely strong; cross-session continuity and recoverability are central |
| Feedback | User-defined verification commands; structured session-summary / extract-patterns mechanisms | The mechanism is provided; users supply the content |

Pi's tradeoffs stand in sharp contrast to Claude Code and Codex. Claude Code puts "memory, permissions, and subagents" into the core for an out-of-the-box experience; Codex makes "repository conventions and environment isolation" the defaults. Pi chooses to **decide nothing for you**—it turns decisions into extension points. The cost is that you must either write extensions yourself or install packages written by others.

## Designs Worth Adopting

1. **Make the compaction strategy pluggable.** "How context is compacted" in your harness should not be a hard-coded parameter; it should be a replaceable strategy interface.
2. **Use a session tree instead of forced summaries.** Cross-session recovery does not have to rely on "the previous turn's summary"; structured history replay is often a more reliable state subsystem.
3. **Be prompt-cache friendly.** Load skills on demand instead of putting every rule into the system prompt at once. This is both context engineering and cost engineering.
4. **Let the agent modify its own harness.** If the harness exposes enough extension points, optimizing agent behavior itself can be partially automated by the agent.

## References (Original Sources / Source Code)

Every claim can be traced back to the original sources or source code below, avoiding secondhand recollections:

- **pi.dev**: The original positioning, "Ask Pi to build what you want, or install a package that does it your way"; the four customizable layers; and session trees ("sessions are stored as trees," `/tree`, single-file storage, HTML export / gist sharing).<br/>https://pi.dev/
- **pi.dev · Sessions**: Pluggable compaction (topic-based / code-aware / alternative summarization model), automatic compaction, and dynamic context injection mechanisms.<br/>https://pi.dev/docs/usage/sessions
- **pi.dev · Extensions**: Extensions can inject messages before each reasoning turn, filter history, perform RAG, and build long-term memory.<br/>https://pi.dev/docs/usage/extensions
- **pi.dev · Project Context**: The replace / append semantics of SYSTEM.md.<br/>https://pi.dev/docs/usage/project-context
- **Pi Coding Agent README** (badlogic/pi-mono): The three-level AGENTS.md loading order (global → parent directories → current directory), `/compact` and the trigger conditions and 20,000-token split point for automatic compaction, on-demand Skills and the Agent Skills standard, the Hooks lifecycle and four official example uses, and Programmatic Usage (JSON / RPC / SDK).<br/>https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md
- **pi-agent-harness**: The skill-router / session-summary / extract-patterns / telemetry extensions and the VISION.md / PROGRESS.md / LESSONS.md / STANDARDS.md file system.<br/>https://github.com/LabidySabidy/pi-agent-harness

Related lectures: [Lecture 2 · What a Harness Actually Is](../../lectures/lecture-02-what-a-harness-actually-is/) ｜ [Lecture 5 · Why Long-Running Tasks Lose Continuity](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/) ｜ [Lecture 13 · From Manual Control to Automated Loops](../../lectures/lecture-13-loop-engineering/)
