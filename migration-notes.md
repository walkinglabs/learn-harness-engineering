# Migration Notes: Interview Debrief Coach

Phase 0 repository audit for migrating `learn-harness-engineering` from the
current personal knowledge-base course project to the Interview Debrief Coach
course project described in `MIGRATION_TO_INTERVIEW_DEBRIEF_COACH.md`.

## Phase 0 Scope

The migration guide requires Phase 0 to do four things before any global rename
or code conversion:

1. List the current top-level directory.
2. List key files under `docs`, `projects`, `scripts`, and `skills`.
3. Identify all knowledge-base / document / indexing / Q&A related references.
4. Record the areas that must change.

This file is the Phase 0 handoff artifact. Phase 1 should start from here and
only then rename global docs.

## Current Top-Level Layout

```text
.git
.github
.gitignore
CLAUDE.md
MIGRATION_TO_INTERVIEW_DEBRIEF_COACH.md
README-CN.md
README-KO.md
README.md
docs
get_anthropic_logo.js
package-lock.json
package.json
projects
scripts
skills
```

Observed repository shape:

- Root package is a VitePress documentation site named
  `learn-harness-engineering`.
- The course site is multilingual: `en`, `zh`, `ko`, `vi`, `ru`, and `uz`.
- There is no root `AGENTS.md` at the time of this audit. There is a root
  `CLAUDE.md`, plus many template/project `AGENTS.md` files.
- There is no top-level `docs-readme` directory in the current checkout.
- The newly added migration guide is untracked together with this notes file
  until staged.

## Key Files: docs

Documentation is a VitePress site rooted at `docs/`.

Important global files:

```text
docs/.vitepress/config.mts
docs/.vitepress/theme/index.js
docs/.vitepress/theme/style.css
docs/index.md
docs/en/index.md
docs/zh/index.md
docs/ko/index.md
docs/vi/index.md
docs/ru/index.md
docs/uz/index.md
```

Course lecture structure:

```text
docs/<locale>/lectures/lecture-01-why-capable-agents-still-fail/
docs/<locale>/lectures/lecture-02-what-a-harness-actually-is/
docs/<locale>/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/
docs/<locale>/lectures/lecture-04-why-one-giant-instruction-file-fails/
docs/<locale>/lectures/lecture-05-why-long-running-tasks-lose-continuity/
docs/<locale>/lectures/lecture-06-why-initialization-needs-its-own-phase/
docs/<locale>/lectures/lecture-07-why-agents-overreach-and-under-finish/
docs/<locale>/lectures/lecture-08-why-feature-lists-are-harness-primitives/
docs/<locale>/lectures/lecture-09-why-agents-declare-victory-too-early/
docs/<locale>/lectures/lecture-10-why-end-to-end-testing-changes-results/
docs/<locale>/lectures/lecture-11-why-observability-belongs-inside-the-harness/
docs/<locale>/lectures/lecture-12-why-every-session-must-leave-a-clean-state/
```

Project documentation structure:

```text
docs/<locale>/projects/index.md
docs/<locale>/projects/project-01-baseline-vs-minimal-harness/index.md
docs/<locale>/projects/project-02-agent-readable-workspace/index.md
docs/<locale>/projects/project-03-multi-session-continuity/index.md
docs/<locale>/projects/project-04-incremental-indexing/index.md
docs/<locale>/projects/project-05-grounded-qa-verification/index.md
docs/<locale>/projects/project-06-runtime-observability-and-debugging/index.md
```

Resource templates that must be migrated:

```text
docs/<locale>/resources/templates/AGENTS.md
docs/<locale>/resources/templates/CLAUDE.md
docs/<locale>/resources/templates/claude-progress.md
docs/<locale>/resources/templates/clean-state-checklist.md
docs/<locale>/resources/templates/evaluator-rubric.md
docs/<locale>/resources/templates/feature_list.json
docs/<locale>/resources/templates/init.sh
docs/<locale>/resources/templates/quality-document.md
docs/<locale>/resources/templates/session-handoff.md
```

Notes:

- `docs/.vitepress/config.mts` hardcodes the site title, repo base path,
  GitHub repo link, and all localized lecture/project nav labels.
- Project slugs still contain knowledge-base specific concepts:
  `project-04-incremental-indexing` and `project-05-grounded-qa-verification`.
- Lecture code examples include feature lists, E2E runner examples, benchmark
  examples, evaluator rubrics, cleanup scanners, and sample task prompts that
  still use document import, indexing, chunks, retrieval, Q&A, and citations.

## Key Files: projects

Project layout:

```text
projects/shared/
projects/project-01/
projects/project-02/
projects/project-03/
projects/project-04/
projects/project-05/
projects/project-06/
```

Each numbered project has localized README files at the project root. The app
code appears under starter/solution variants:

```text
projects/project-01/starter/
projects/project-01/solution/
projects/project-02/starter/
projects/project-02/solution/
projects/project-03/starter/
projects/project-03/solution/
projects/project-04/starter/
projects/project-04/solution/
projects/project-05/starter/
projects/project-05/solution/single-role/
projects/project-05/solution/plan-gen-eval/
projects/project-05/solution/gen-eval/
projects/project-06/starter/
projects/project-06/solution/
```

Shared app files:

```text
projects/shared/package.json
projects/shared/src/main/ipc-handlers.ts
projects/shared/src/main/main.ts
projects/shared/src/preload/preload.ts
projects/shared/src/renderer/App.tsx
projects/shared/src/renderer/components/DocumentDetail.tsx
projects/shared/src/renderer/components/DocumentList.tsx
projects/shared/src/renderer/components/ImportPanel.tsx
projects/shared/src/renderer/components/QuestionPanel.tsx
projects/shared/src/renderer/components/StatusBar.tsx
projects/shared/src/renderer/types.d.ts
projects/shared/src/services/document-service.ts
projects/shared/src/services/indexing-service.ts
projects/shared/src/services/persistence-service.ts
projects/shared/src/services/qa-service.ts
projects/shared/src/shared/types.ts
projects/shared/data/sample-documents/
```

Project app package audit:

- All 15 Electron app `package.json` files are currently named
  `knowledge-base`.
- Their descriptions all describe a personal knowledge base with document
  import, indexing, and grounded Q&A.
- The same product-domain service/component names are copied across starter and
  solution variants.

Project harness artifacts to preserve and migrate:

```text
AGENTS.md
CLAUDE.md
claude-progress.md
clean-state-checklist.md
docs/ARCHITECTURE.md
docs/PRODUCT.md
docs/RELIABILITY.md
evaluator-rubric.md
feature_list.json
init.sh
quality-document.md
scripts/benchmark.sh
scripts/check-architecture.sh
scripts/cleanup-scanner.sh
session-handoff.md
sprint-contract.md
```

Notes:

- There are 45 `data/sample-documents/*` fixture files across shared and
  project variants. These should become timestamped transcript fixtures.
- Project 05 has three solution tracks: `single-role`, `plan-gen-eval`, and
  `gen-eval`; migrate all three rather than collapsing them.
- Project 06 is the capstone and contains the final benchmark,
  cleanup scanner, quality document, session handoff, and reliability docs.

## Key Files: scripts

Root scripts are documentation-site utilities:

```text
scripts/build-course-pdfs.ts
scripts/capture-readme-screenshots.ts
scripts/export-site-utils.ts
scripts/uz-orthography-cleanup.py
scripts/uz-orthography-fix.py
```

Product harness scripts currently live inside project variants, especially:

```text
projects/project-04/solution/scripts/check-architecture.sh
projects/project-05/starter/scripts/check-architecture.sh
projects/project-06/solution/scripts/benchmark.sh
projects/project-06/solution/scripts/check-architecture.sh
projects/project-06/solution/scripts/cleanup-scanner.sh
```

Migration guide Phase 5 requires `init.sh`, `check-architecture.sh`,
fixture-analysis scripts, `benchmark.sh`, and `cleanup-scanner.sh` to be
converted to the interview debrief domain.

## Key Files: skills

Skill package:

```text
skills/README.md
skills/README-CN.md
skills/README-KO.md
skills/harness-creator/README.md
skills/harness-creator/SKILL.md
skills/harness-creator/SKILL.md.en
skills/harness-creator/metadata.json
skills/harness-creator/evals/evals.json
skills/harness-creator/references/
skills/harness-creator/templates/
```

Skill templates that currently encode the old product domain:

```text
skills/harness-creator/templates/feature-list.json
skills/harness-creator/templates/init.sh
skills/harness-creator/templates/progress.md
skills/harness-creator/templates/agents.md
```

Notes:

- The skill body and examples still mention document import, document chunking,
  Q&A, citations, and knowledge-base harness creation.
- These should become Interview Debrief Coach harness templates, not generic
  app templates.

## Knowledge-Base Reference Audit

Search command used for the targeted product-domain file count:

```sh
rg -l -i "knowledge[- ]?base|personal knowledge|document library|document list|document detail|import local documents|document import|document chunking|document-service|indexing-service|qa-service|questionpanel|citation|citations|sample-documents|documents-meta|DocumentService|IndexingService|QaService|grounded q\&a|q\&a|indexed docs|retrieval" --glob '!MIGRATION_TO_INTERVIEW_DEBRIEF_COACH.md' .
```

Targeted product-domain hits:

```text
total files: 404
root files: 3
docs files: 75
projects files: 321
scripts files: 0
skills files: 5
```

Broader term counts, useful as a cleanup baseline:

```text
knowledge[- ]?base: 414
personal knowledge: 22
document library: 8
document import / import local documents: 127
document list / document detail / documents: 5128
document indexing / indexing service / indexed / indexer / indexing: 1636
chunking / chunks: 2542
grounded Q&A / QA panel / QuestionPanel: 473
citation / citations: 873
answer feedback: 0
retrieval: 225
```

The broad `documents` count includes legitimate "documentation" wording, so
future cleanup should use targeted product-domain queries first and broad
queries only as a final pass.

Representative old-domain code surfaces:

```text
src/services/document-service.ts
src/services/indexing-service.ts
src/services/qa-service.ts
src/renderer/components/DocumentList.tsx
src/renderer/components/DocumentDetail.tsx
src/renderer/components/ImportPanel.tsx
src/renderer/components/QuestionPanel.tsx
src/shared/types.ts
src/main/ipc-handlers.ts
src/preload/preload.ts
data/sample-documents/
```

These surfaces appear in `projects/shared` and in every project starter/solution
copy.

## Required Domain Replacement

Use the migration guide's mapping consistently:

```text
Knowledge Base Desktop App -> Interview Debrief Coach
document library -> interview session library
import local documents -> import interview audio or transcript
document list -> interview session list
document detail -> transcript timeline
document indexing -> transcript parsing / segmentation / analysis
chunking -> utterance parsing / question-chain segmentation
grounded Q&A -> evidence-grounded debrief report
citation -> timestamped evidence
QA panel -> debrief report panel
answer feedback -> analysis accuracy feedback
conversation history -> debrief history / training plan history
indexing service -> transcript parser / segmenter / analyzer
document chunks -> utterances / follow-up chains
large document bug -> timestamp / segmentation / long-answer bug
```

Safety boundary to carry through all phases:

- Do not turn the app into an employer screening system.
- Do not implement candidate ranking, hire/reject recommendations, automated
  screening, protected-trait inference, emotion recognition, personality
  judgment, lie detection, or mental-state inference from voice.
- Replace "project authenticity" language with "project evidence gap".
- Every analysis report item must cite timestamped transcript evidence.

## Migration Areas

### Phase 1: Global Docs Rename

Files to update first:

```text
README.md
README-CN.md
README-KO.md
CLAUDE.md
docs/index.md
docs/<locale>/index.md
docs/.vitepress/config.mts
docs/<locale>/projects/index.md
docs/<locale>/resources/index.md
docs/<locale>/skills/index.md
```

Expected changes:

- Rename course/product framing to Interview Debrief Coach while preserving
  harness-engineering teaching structure.
- Update the capstone diagram from document/Q&A panels to sessions/timeline/
  debrief report panels.
- Update project names, especially P04 and P05 slugs/titles if the site
  navigation is changed.
- Add safety boundary language early in the course positioning.

### Phase 2: Shared App Conversion

Primary conversion target:

```text
projects/shared/
```

Expected changes:

- Rename package to an interview debrief app package.
- Replace `src/shared/types.ts` with explicit interview, transcript, and
  analysis types under the guide's requested type structure.
- Replace document/import/indexing/Q&A services with transcript import/parser,
  session storage, deterministic analysis, feedback, and report generation
  services.
- Replace document UI with the three-column layout:
  sessions, transcript timeline, debrief report.
- Replace `data/sample-documents` with transcript fixtures.
- Keep mock transcription as the only testable audio path; do not wire a real
  transcription API.

### Phase 3: Project 01-06 Conversion

Project order must be preserved:

```text
project-01
project-02
project-03
project-04
project-05
project-06
```

For each project:

1. Update project README files.
2. Update starter.
3. Update solution.
4. Verify the project can independently install, check, test, and build where
   those scripts exist.
5. Ensure P(N+1) starter is derived from P(N) solution.

Special cases:

- Project 05 has three solution variants; all must remain coherent.
- Project 06 must become the full Interview Debrief Coach harness with
  benchmark, cleanup scanner, quality document, and session handoff.

### Phase 4: Lecture Conversion

Preserve the 12 lecture theory arc. Replace only the product examples and code
fixtures that currently assume a knowledge-base app.

High-risk lecture example folders:

```text
lecture-01 code/underspecified-task.md
lecture-08 code/feature_list.json and feature-list-validator.ts
lecture-10 code/e2e-runner.ts and architecture-rules.md
lecture-11 code/evaluator-rubric.md, runtime-logger.ts, sprint-contract.md
lecture-12 code/benchmark-runner.ts and cleanup-scanner.ts
```

### Phase 5: Scripts and Benchmark

Convert:

```text
init.sh
check-architecture.sh
benchmark.sh
cleanup-scanner.sh
fixture analysis scripts
```

New benchmark should exercise transcript import, segmentation, follow-up chain
analysis, timestamped evidence, feedback persistence, and safety-boundary
checks.

Cleanup scanner should fail on leftover old-domain product references except
where a historical comparison is explicitly intended.

### Phase 6: Final Verification

Required final verification commands should include:

```sh
rg -n -i "knowledge-base|personal knowledge|document library|document import|document list|document detail|indexing service|document chunks|grounded q&a|qa panel|citation" .
npm run build
```

Then run project-local checks/tests/builds, benchmark scripts, cleanup scanner,
and architecture checks after they have been migrated.

## Initial Risk Register

- The old product domain is deeply duplicated. A root-only rename will leave
  hundreds of stale files in project variants and localized docs.
- Broad search terms such as `document` produce false positives because this is
  a documentation-heavy repository. Use targeted product-domain queries before
  broad cleanup.
- Package descriptions and service/component filenames encode the old domain in
  every app copy.
- Locale coverage is uneven: root has English/Chinese/Korean README files, but
  docs site has six locales. Later phases must decide whether to fully translate
  all locales or minimally keep them consistent.
- `docs-readme` is mentioned in the guide but does not exist in this checkout.
  Treat root README files and `docs/*/index.md` as the current equivalents
  unless a later phase creates a new directory intentionally.
- The migration guide requires `projects/shared/src/types/`, but the current
  app stores shared types in `projects/shared/src/shared/types.ts`; the Phase 2
  conversion should establish the requested type directory deliberately.

## Next Phase Gate

Phase 0 is complete when this file exists and the worktree shows it as a new
root artifact. The next allowed work is Phase 1: global docs rename. Do not
start shared app conversion before the root docs and entry instructions have
been migrated.

## Progress Update

- Phase 0 completed: repository audit and this migration note were created.
- Phase 1 completed: root README files, `CLAUDE.md`, locale home pages,
  locale project overview pages, and VitePress title/navigation now frame the
  course around Interview Debrief Coach.
- Phase 2 completed for `projects/shared/`: shared app package metadata,
  interview/transcript/analysis types, transcript fixtures, parser tests,
  deterministic analysis pipeline, safety checker, local session store,
  Electron IPC/preload API, and three-column renderer UI were converted.
- Phase 3 completed: project 01-06 README files, starter workspaces, solution
  workspaces, feature lists, project docs, fixtures, and verification scripts
  were migrated to the Interview Debrief Coach app surface. All migrated
  project app directories passed `npm run check` and `npm test`.
- Phase 4 completed: the 12-lecture structure is preserved, but lecture titles,
  sidebar labels, practice links, and high-risk code examples now use transcript
  import, question-chain segmentation, evidence-grounded reports, debrief
  history, training plans, and interview benchmark examples.
- Phase 5 completed: resource templates and `skills/harness-creator` now expose
  interview-specific templates, safety boundaries, feature lists, analysis
  model docs, and debrief-oriented examples.
- Phase 6 completed: final cleanup scans are down to the project-06 cleanup
  scanner's own detection pattern, which intentionally contains old-domain
  strings. Root docs build, shared app check/test/build, all 14 project app
  check/test pairs, project-06 architecture check, fixture-analysis script,
  benchmark script, cleanup scanner, and `git diff --check` passed.
