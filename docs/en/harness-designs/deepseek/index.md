# Breaking Down DeepSeek Harness's Design

[DeepSeek Harness](https://deepseek.com/harness) (command name `dsh`, repository `deepseek-ai/deepseek-harness`) was released as a Developer Preview in August 2026. Its official definition is direct: **Agent = Model + Environment + Tools + State**—a four-part combination of model, environment, tools, and state.

If the previous three product breakdowns ask "how should a harness be designed," DeepSeek Harness asks a more radical question: **can a harness become a standalone runtime independent of a particular model?** Its answer is yes, and it takes this idea to the extreme. In the words of the [architecture documentation](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): *Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself*.

In this article, we examine three things in particular: the plugin-based core, capability seams, and the event pipeline, along with its strongest engineering constraint: "Model-visible means logged."

## In One Sentence

A traditional coding agent has the structure "LLM + fixed agent loop + fixed tool set." DeepSeek Harness has the structure "model + a plugin core (Cordis)." The core is responsible only for plugin loading, unloading, dependencies, and events, and **owns no concrete agent capabilities**. In the words of the [architecture documentation](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md), "There is no privileged core to patch" and "you extend dsh by mounting a plugin beside the others." This means that not even the agent loop itself is sacred or immutable: you can combine a DeepSeek model, Claude Code subagents, a remote sandbox, custom memory, a custom loop, and a custom UI into an entirely new agent.

This is the most thorough implementation of the course's statement that "everything outside the model weights is the harness": if the harness is independent, make it an operating system of its own.

## Architectural Core 1: Capability Seam

DeepSeek Harness represents "capabilities" as Services, and divides nearly every capability into three layers:

```
Service Definition
        ↓
Service Provider
        ↓
Consumer
```

Take the file system as an example: under `FS Service` are multiple Providers—Local FS, E2B FS, and Remote FS—all exposed upward through a consistent set of file tools. Shell, Subprocess, Sandbox, Web, LLM, and SubAgent follow the same structure. This three-layer structure is not our own summary. The [architecture documentation · Capability seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) says: *a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool*.

This resolves a longstanding question in harness engineering: **should an agent depend on "concrete tools" or on "capability interfaces"?** DeepSeek Harness chooses the latter. In terms of the course, this means the "tool subsystem" is standardized as an interface. Switching Providers leaves the tool surface exposed to the model unchanged while completely replacing the environment underneath.

## Architectural Core 2: Event Pipeline

DeepSeek Harness is not built around a simple "LLM → tool → LLM" flow. Internally, it uses an event pipeline in which every stage is an event point that plugins can observe:

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → next turn
```

(The pipeline above is adapted from the [architecture documentation · Turn flow](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md): `turn/*`, `step/*`, `user/message`, `assistant/*`, and `tool/*` are persistent session events, while `agent/pre-step`, `agent/request`, `llm/stream`, and `tools/*` are extension points that plugins can observe.)

The greatest benefit of this design is that **many features do not require modifying the agent loop itself**. Want to run a security check before a tool executes? Listen to `tools/pre-execute`. Want to add memory? Inject it at `agent/pre-step`. Want to record behavior? Subscribe to session events. Want to modify the model request? Hook into `agent/request`. Want to decide whether reasoning should continue? Listen to `agent/turn-stopping`.

Compared with Lecture 11, "making agent execution observable," DeepSeek Harness goes further: instead of merely "adding logs," it turns **every step of the loop into an event point**, allowing observability, permissions, memory, and policy to attach to the loop as listeners instead of being hard-coded into it.

## Architectural Core 3: Session Event Log and "Model-visible means logged"

DeepSeek Harness has an **append-only Session Event Log** and establishes a powerful engineering constraint. The [architecture documentation · Session log](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) states:

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

(Anything visible to the model must be logged. Anything that enters a model request must be reconstructable from the log, and a runtime invariant enforces this rule.)

In other words, observability is not logging added after the fact; it is a first-principles constraint of the harness. Anything that enters the model context should be logged by default. This directly echoes the closing lecture's point that "observability belongs inside the harness" and turns the append-only storage design into a principle: logs are appended, never overwritten, and session state can be replayed.

## Mapping to the Course Framework

| Subsystem | DeepSeek Harness's Implementation | Assessment |
| --- | --- | --- |
| Instructions | Plugin-based; rules/skills are injected as plugins | Extremely flexible, but lacks a built-in convention like CLAUDE.md |
| Tools | Service Definition → Provider → Consumer capability seam | Tool subsystem standardization taken to the extreme |
| Environment | Sandbox/FS/Shell Providers are all replaceable (including remote E2B) | The environment is fully pluggable |
| State | Append-only Session Event Log + Model-visible means logged | Observability is a first-principles constraint |
| Feedback | Permission / guard / policy / hook at tools/pre-execute | Feedback mechanisms are event-based |

The fundamental difference between DeepSeek Harness and the other three products is that Pi, Claude Code, and Codex all optimize the harness "inside a specific agent," while DeepSeek Harness defines the harness as an **operating system independent of the model**, with the agent itself merely a replaceable application running on that OS. The tradeoff is equally clear: greater flexibility means higher configuration cost, an inherent downside of the "harness as OS" design (the Developer Preview is also positioned as an early look at mechanisms that are still evolving).

## Designs Worth Adopting

1. **Turn every step of the loop into an event point**: Attach permissions, memory, policies, and logs to the loop as listeners instead of hard-coding them into the loop.
2. **Standardize capability seams**: Depend on "capability interfaces" instead of "concrete tools," allowing the environment to be replaced wholesale without changing the tool surface visible to the model.
3. **Model-visible means logged**: Anything visible to the model must be logged, turning observability from a "nice-to-have" into a "first-principles constraint."
4. **Append-only session logs**: Replayable state and reliable handoffs provide an engineering guarantee that "every session leaves behind clean state."

## References (Original Sources / Source Code)

Every claim can be traced back to the original sources or source code below, avoiding secondhand recollections:

- **DeepSeek Harness**: The product definition "Agent = Model + Environment + Tools + State," Developer Preview positioning, and the `dsh` command.<br/>https://deepseek.com/harness
- **deepseek-ai/deepseek-harness** (command `dsh`, MIT license):<br/>https://github.com/deepseek-ai/deepseek-harness
- **architecture.md**: The central source for this article—"Every part of the product is a plugin," "There is no privileged core to patch," the Turn flow event pipeline, the three roles of Capability seams, "Model-visible means logged" and its runtime invariant, the append-only Session Event Log, and capability seams such as fs/tools/telemetry and the `ctx.*` subsystems.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **Supporting architecture documentation**: An introduction to the Cordis core (plugins contribute services, typed events, reversible effects), capability seam details, and the Session subsystem.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

Related lectures: [Lecture 11 · Why Observability Belongs Inside the Harness](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [Lecture 12 · Why Every Session Must Leave a Clean State](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [Lecture 2 · What a Harness Actually Is](../../lectures/lecture-02-what-a-harness-actually-is/)
