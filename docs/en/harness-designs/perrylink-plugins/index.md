# Breaking Down the PerryLink DSH Plugin Family's Design

The [DeepSeek Harness breakdown](./deepseek/) asks whether a harness can become a standalone runtime independent of any particular model. Its answer is yes: *everything is a plugin*. This article asks the natural follow-up question: **what happens when third parties actually build on that runtime at scale?** In other words, once the loop, the model adapter, and the tool registry are all plugins, what does "harness engineering" mean for someone who owns none of them?

The [PerryLink DSH plugin family](https://github.com/PerryLink) is a live case study: 33 Apache-2.0 plugins published to npm with provenance — permission rules, second-model approval, cross-session memory, an MCP panel, supply-chain certification, and research engines — maintained since August 2026, with 100+ community issues and pull requests processed, five-language READMEs, and a monthly compatibility gate. It is a working example of **ecosystem engineering on a plugin operating system**, and it is also a running record of where that model strains.

In this article we examine four things: the install contract that turns a repository into a plugin, the discipline of consuming capability seams without owning the loop, the session-event rules a plugin must obey, and the verification pipeline a plugin family must run to stay installable across host versions.

## In One Sentence

When the harness makes everything a plugin, the unit of engineering becomes the **contract between plugin and harness**. The PerryLink family does not extend the agent loop — it ships manifests, consumes seams, obeys the session log's invariants, and spends a large share of its effort proving it still works on each new host version.

## Architectural Core 1: The Install Contract (`dsh.bundle`)

A repository only becomes an installable DSH plugin when its `package.json` declares a complete `dsh.bundle` — a `bundle.patch` pointing at a root `cordis.patch.yml`. Declaring only `dsh.client` (a browser half) does not make a plugin installable, because there is no host-side composition. The patch file is the plugin's *manifest of needs*:

- **`inject`** names hard dependencies. A plugin that cannot function without a service declares it and lets the loader wait for it.
- **`ctx.get()`** names optional services, handled as possibly absent.
- **Config** is Schemastery-validated at load; a bad config fails the mount loudly instead of defaulting silently.

Two engineering consequences are easy to miss and both are in the family's playbook:

1. **The git install channel builds with production dependencies only.** `typescript` and `tsdown` are regular `dependencies`, not devDependencies, because pnpm's isolated `prepare` for git-hosted packages installs production dependencies alone. (The family also maintains a `pnpm-workspace.yaml` `allowBuilds` entry so esbuild's harmless postinstall validation does not fail the install.)
2. **Official `@deepseek-ai/*` packages are `peerDependencies`.** Depending on them directly would embed a second runtime inside the profile; declaring them as peers keeps the harness's own copies authoritative.

The contract is bidirectional: the plugin promises a manifest, the host promises a seam surface. Everything below is about keeping that promise across versions.

## Architectural Core 2: Consuming Seams Without Owning the Loop

None of the 33 plugins modifies the agent loop. Each one attaches to a published extension point:

- `dsh-permission-rules` listens on `tools/pre-execute`, a **waterfall**. The hard rule: a listener that does not claim the call must call `next()`; an `allow` verdict never short-circuits the chain. Deny/ask decisions end at the official `approval/asked` seam — the plugin never answers its own request.
- `dsh-auto-review` answers the `approval/request` waterfall with a second-model verdict and a fail-closed deadline. The approval seam thus becomes an **ecosystem interface**: one plugin produces `ask`, an unrelated plugin answers it, and neither knows the other exists.
- `dsh-memento` contributes memory through the session and a `ctx.memory` seam; `dsh-talk` registers a tool and a projection unit; `dsh-github` contributes tools whose writes are gated by human approval.

The pattern generalizes: features are **listeners and registries**, not loop patches. This is the same conclusion as the host breakdown, seen from the consumer side — the harness's extension points are the plugin author's entire integration surface, so the author's engineering effort moves to contracts, version gates, and verification.

## Architectural Core 3: Session-Event Discipline

The host's strongest invariant is *model-visible means logged*, enforced by an append-only session event log. A plugin that writes its own event types inherits an obligation the core never had to worry about: **the host's read path only knows its own event vocabulary.** A plugin event type that the host build does not recognize makes the log unreadable — unless the envelope carries the `ignorable: true` marker, which tells the reader the event can be skipped safely.

The family's audit events (`permissionRules/decision`, `dsh-talk/speech`) are therefore written with a marker request, and the runtime gates host versions before the first write: hosts whose `Session.append` predates the marker (the `0.1.0-rc.1`–`rc.7` and `0.1.1-rc.1`–`rc.7` lines) silently drop it, so audit is disabled on those lines with a one-time warning.

August 2026 produced the sharpest version of this lesson. On the `0.1.2-alpha` line, the read path refused out-of-vocabulary event types **even when marked**, so sessions that had run the audit became unloadable on the host that wrote them. The fix ([issue #15](https://github.com/PerryLink/dsh-permission-rules/issues/15)) extended the version gate to the whole alpha line and added a `strip` mode to the log-repair script, which removes audit rows outright for hosts where the marker cannot help. The plugin-side invariant is now: *never assume a host invariant survives the next version; detect, degrade, and ship a repair path before the first polluted log exists.*

The meta-lesson is worth stating plainly: **a plugin family inherits the host's invariants without inheriting its release cadence.** Every harness version can silently change the contract the plugin relies on, and the only defense is a version gate plus a repair story.

## Architectural Core 4: Verification as a Product Surface

Because the contract is version-sensitive, the family spends a large share of its engineering on *proving* compatibility rather than assuming it:

- **Monthly `compat.yml`**: installs the packed tarball into a scratch profile next to the real harness, asserts the bundle row mounts (`--dump-config`), and runs one keyless headless task. A hang (a pending injected service) fails on the timeout — which is exactly how a missing service surfaces.
- **`dsh-test-drive`**: every install/load/boot/uninstall runs in an isolated throwaway `DSH_HOME`; results are published with the harness version, never guessed.
- **Five-language README sync gate**: all five READMEs must share section structure, config keys, and command docs, enforced in CI, because a misdocumented config key is a support bug in five languages.
- **`dsh-plugin-certification`**: a five-dimension, machine-checkable certification — manifest compliance, build hygiene, OpenSSF Scorecard, npm provenance, and a real install smoke — with a security veto. The registry publishes evidence links, never vibes.

The certification dimension is the interesting one for harness engineering: when the ecosystem's canonical list explicitly says "listing is not a security review," a plugin family that runs the review *reproducibly, outside the listings*, turns verification itself into a product.

## Mapping to the Course Framework

| Subsystem | The Family's Implementation | Assessment |
| --- | --- | --- |
| Instructions | Five-language READMEs with a sync gate; rule reasons stay untranslated where correctness matters | Documentation treated as part of the installable artifact |
| Tools | Tools registered per plugin; writes gated by human approval (`dsh-github`) or policy (`dsh-permission-rules`) | Tools as contributions to a shared registry, never private forks |
| Environment | No OS-sandbox changes; tests and installs run in isolated throwaway profiles | Environment isolation applied to the plugin's own verification |
| State | Audit events carry the `ignorable` marker; version-gated writes and a repair script for polluted logs | Session-log invariants respected and defended across host versions |
| Feedback | `ask` ends at the official approval seam; the answerer is a separate plugin | Feedback loops assembled from seams rather than built in |

The family's distinguishing stance is not any single feature — it is that **compatibility, verification, and repair are first-class deliverables**, shipped on the same cadence as features, because on a plugin operating system the host moves underneath you and only evidence travels.

## Designs Worth Adopting

1. **Treat the install contract as the product boundary.** A manifest (`dsh.bundle` + patch file), declared injections, and peer dependencies decide whether a plugin installs at all; get them right before adding features.
2. **Never assume a host invariant survives the next version.** Gate host versions before the first risky write, degrade loudly, and ship a repair path before the first polluted log exists.
3. **Assemble feedback from seams.** Produce `ask` at the official approval seam and let an unrelated plugin answer it; do not build private approval flows.
4. **Make verification reproducible and published.** A monthly real-profile install, an isolated smoke harness, and machine-checkable certification turn "it probably works" into dated evidence.

## References (Original Sources)

- **PerryLink DSH plugin family** (33 plugins, Apache-2.0):<br/>https://github.com/PerryLink
- **The ignorable-marker regression and its fix** (the `0.1.2-alpha` read-path refusal, version gate, and `strip` repair mode):<br/>https://github.com/PerryLink/dsh-permission-rules/issues/15
- **dsh-plugin-certification** (five-dimension spec and registry):<br/>https://github.com/PerryLink/dsh-plugin-certification
- **dsh-test-drive** (isolated install/load/boot/uninstall smoke):<br/>https://github.com/PerryLink/dsh-test-drive
- **The community directory** (install contract and submission rules in practice):<br/>https://github.com/awesome-dsh-plugin/awesome-dsh-plugin

Related breakdowns: [DeepSeek Harness](./deepseek/) ｜ Related lectures: [Lecture 2 · What a Harness Actually Is](../lectures/lecture-02-what-a-harness-actually-is/) ｜ [Lecture 11 · Why Observability Belongs Inside the Harness](../lectures/lecture-11-why-observability-belongs-inside-the-harness/)
