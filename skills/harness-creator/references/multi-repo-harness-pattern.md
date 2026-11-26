# Multi-Repo Harness Pattern

## Problem

The course harness assumes one repository: one `AGENTS.md`, one `feature_list.json`,
one `init.sh`. Real systems are often split across many service repos, and a
per-repo harness alone breaks down:

- **The agent lands in the wrong repo.** "Fix the invoice total" could mean the API,
  the worker that renders PDFs, or the front end. Nothing tells the agent which.
- **Rules drift.** The same safety rules are copied into ten `AGENTS.md` files and
  diverge after the first edit.
- **Cross-repo work has no home.** A change that touches three services has no single
  place for its plan, progress and evidence.
- **Dead code looks alive.** Archived or deprecated repos sit next to live ones, and
  the agent imports from them.

## Golden Rules

### Separate the Instructions Workspace From the Code

Keep one **orchestrator** workspace that holds instructions, catalog, skills, state and
tooling, and **no product code**. The service repos are cloned next to it:

```text
workspace/
├── orchestrator/              ← instructions + tooling, no product code
│   ├── AGENTS.md / CLAUDE.md  ← rules that apply to every repo
│   ├── repos.txt              ← the repo list (one org/name per line)
│   ├── docs/repo-catalog.md   ← what each repo does, stack, live / archived
│   ├── docs/routing.md        ← directory or keyword → which repo skill
│   ├── skills/<repo>/SKILL.md ← one skill per repo: stack, commands, verification, gotchas
│   ├── notes/<TICKET>/        ← per-task state: proposal, tasks, findings, evidence
│   └── bin/ + Makefile        ← clone-all, sync, status, doctor
├── billing-api/               ← service repos: every edit, branch and PR happens here
├── pdf-worker/
└── web/
```

Edits, branches and PRs happen in the service clones. The orchestrator only takes
changes to instructions, skills and tooling.

### One Home per Fact

Decide where each kind of knowledge lives and link instead of copying:

| Kind of content | Home |
|---|---|
| Rule that applies to every task in every repo | Root `AGENTS.md` / `CLAUDE.md` (short) |
| How to build, test and change one repo | That repo's skill (and its references) |
| What one task did, decided and rejected | The task note folder (`notes/<TICKET>/`) |
| A false start worth not repeating | A lessons entry, then promote the fix into a skill or rule |
| One session's work in progress | Session state (see Concurrent Session Coordination) |

A fact in two places drifts. A dated status table inside a skill buries the procedure.

### Route Before Acting

Give the agent a routing table it reads before touching code:

| Signal | Example | Route |
|---|---|---|
| Working directory | `pdf-worker/` | `skills/pdf-worker` |
| Keyword | "invoice", "refund" | `skills/billing-api` |
| Cross-cutting question | "which service sends emails?" | a whole-system map skill |

Routing is cheap to read and saves the agent from searching every repo.

### Each Repo Skill Owns Its Verification

The verification layer stays per repo: each skill states the exact build and test
commands and what "green" looks like for that repo. A change that crosses repo
boundaries also needs a system-level check (the consumer side or an end-to-end path),
recorded in the task note.

### Check the Harness Itself

A `doctor` command keeps the structure honest:

- every repo in `repos.txt` has a skill, and every skill maps to a listed repo;
- settings files are valid JSON and every hook they reference exists and is executable;
- no local credential file (for example an MCP config with tokens) is tracked;
- archived repos are marked as such in the catalog.

Run it in CI or before each session; treat a failure like a red test.

## When To Use

- A product spans three or more repos that change together.
- Agents regularly ask "which repo?" or edit the wrong one.
- The same rules are copied across repos and have started to diverge.

Do **not** use it for a single repo: the root `AGENTS.md` plus the standard templates
is simpler and enough.

## Tradeoffs

| Benefit | Cost |
|---|---|
| One place for rules, routing and task state | One more repo to maintain |
| Repo skills load only when relevant (small context) | Skills drift from code unless checked |
| Cross-repo tasks get a plan and evidence trail | Agents need the routing step before every task |

## Implementation Notes

- **Stamp skills with the commit they were written against** and flag a skill when its
  repo has moved far beyond that commit. Re-read the repo and refresh the skill rather
  than trusting it.
- **Generate the first draft of each repo skill by reading the clone** (manifest, build
  files, CI config, tests), then have a human fix it. Hand-written skills from memory
  are usually wrong about commands.
- **Keep `repos.txt` hand-edited.** Auto-listing an organisation's repos pulls in
  archived and forked repos.
- **Use one worktree per task** when several tasks touch the same repo at once, so two
  agents never share a checkout.
- **Repo-level `AGENTS.md` files still apply.** State the precedence in the root file:
  the service repo's own instructions win for that repo's conventions; the orchestrator's
  safety rules win everywhere.

## Gotchas

- An agent started in the orchestrator directory sees the instructions but not the
  code; one started inside a service clone sees the code but not the orchestrator
  rules. Make the root instructions say which directory to start from, or load them
  from both.
- Tooling that loops over every repo (`make sync`, `make status`) must skip clones with
  uncommitted work instead of resetting them.
- A cross-repo change merged in the wrong order breaks consumers. Put the merge order
  in the task note before opening the PRs.
