# Lecture 15 Code

Dependency-free examples (Node.js + `npx tsx`, plus `git` for the escape check):

- `escape-check.ts` — snapshot the main checkout before and after a session and report containment breaches (branch switch, moved `HEAD`, working-tree edits, stash changes). Run with no arguments for a self-contained demo in a temporary repository.
- `merge-queue.ts` — an in-memory per-repository merge queue: one merge at a time, rebase onto the latest base, re-run deterministic checks on the combined result. The demo shows two branches that pass alone and break the build together.
- `deps-fingerprint.ts` — fingerprint dependency manifests and lockfiles; reinstall shared environments only when the fingerprint changes, and keep the old install if the new one fails.
- `fleet-signals.ts` — behavioral signal detectors over session transcripts: waiting on a human, permission workarounds, stalls (inactivity, not total runtime), and retry-chain caps.
- `verification-verdict.md` — checker prompt contract and structured verdict schema (completed / actionable / external / unknown / deferred) with a routing table.
