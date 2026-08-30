# Project Model and Traceability

Read this when creating a harness, retrofitting an existing one, or diagnosing requirement
coverage. The model is a compact contract index, not a replacement for the cited source
documents.

## Source authority

Classify every source before deriving requirements:

- `contract`: customer, regulatory, or product material that defines required outcomes.
- `authoritative`: current architecture or decision material that governs implementation.
- `context`: evidence, tests, code, transcripts, or history that informs interpretation.
- `superseded`: retained provenance that must not direct new implementation.

Conflicting contract or authoritative sources create an unknown. Resolve the conflict or keep
the affected requirement blocked. A test is evidence of current behavior; it becomes a
requirement source only when the project explicitly treats that behavior as contractual.

## Model fields

`project-model.json` holds:

- `reviewStatus`: `draft` until a human or domain-capable reviewer has checked the model;
- `purpose`: the observable project outcome and beneficiary;
- `sources`: stable IDs, paths, kinds, authority, revision/fingerprint, and notes;
- `vocabulary`: domain terms whose meaning affects implementation;
- `capabilities`: observable behavior, inputs, outputs, dependencies, and boundaries;
- `requirements`: sourced statements, knowledge state, capability links, acceptance criteria;
- `verificationPlan`: acceptance links, procedure, expected observation, and evidence location;
- `unknowns`: question, impact, status, and the exact requirements/capabilities blocked;
- `decisions`: the ruling, sources, and unknowns it resolves.

The schema lives in `templates/project-model.schema.json`. Stable IDs survive wording changes;
references should not depend on array position.

For a local contract or authoritative file, prefer `revision: "sha256:<digest>"`; the
repository-local validator will fail when its content changes. For external sources, record a
document version, ticket revision, or decision date so staleness is visible even when it cannot
be checked offline.

## Knowledge states

- `confirmed`: a governing source states it or an authorized decision settled it.
- `inferred`: evidence supports it, but no governing source states it. Keep the inference and
  its basis visible.
- `unknown`: the available material does not answer it.
- `needs-decision`: alternatives are understood and an authorized choice is required.

A reviewed model may contain open unknowns. `reviewed` means the model honestly represents the
known state, not that every question is answered. Open unknowns block only the capabilities or
requirements named in `blocks`.

## Capability and feature grain

A capability states something the project can do: ingest a source, map its records, suppress a
duplicate, enforce required fields, or export a conforming artifact. Setup, test coverage,
documentation, and handoff are completion work around a capability rather than peer business
features.

One derived feature normally implements one capability. Split it when independent outcomes have
different sources, dependencies, risks, or verification procedures. Merge only when separate
delivery would produce no observable value.

## Acceptance and verification

Acceptance criteria describe observable outcomes independently of the implementation. Each
confirmed or inferred criterion needs at least one verification plan entry with:

- `kind`: test, fixture comparison, invariant, contract, end-to-end run, analysis, or review;
- `procedure`: the exact runnable command or reproducible human procedure;
- `expected`: the outcome predicted from the requirement, not merely “passes”;
- `evidencePath`: where the observation will survive the session.

Generic tests, lint, types, and builds remain necessary engineering checks. They satisfy a
requirement only when their assertions can distinguish the required behavior from a plausible
wrong implementation.

Planned verification and observed evidence are different records. A done feature attaches one
evidence item per `verificationRef`, with the observation time, result, and artifact reference.

## Retrofit an existing harness

1. Preserve current instruction, feature, progress, handoff, and evidence files.
2. Inventory their project claims and trace each claim to its best source.
3. Build the project model from existing business capabilities; mark unsupported claims inferred
   or unknown.
4. Map existing features to capability, requirement, acceptance, and verification IDs. Preserve
   their IDs, status, and evidence where possible.
5. Run `validate-harness.mjs` and resolve broken references. Do not use `--force` to replace
   established state with newly derived empty features.
6. Review semantic coverage with a domain-capable person and run representative tasks. Structural
   validation is not independent review.

## Audit questions

- Does every confirmed/inferred requirement cite a governing source?
- Does every requirement reach a capability and implementation feature?
- Can every acceptance criterion be falsified by its verification procedure?
- Does the expected observation come from the contract rather than mirror the code?
- Does every done feature carry observed evidence for every linked verification?
- Are open decisions visible and scoped instead of silently defaulted?
- Is the traceability snapshot current for the source tree it claims to describe?
