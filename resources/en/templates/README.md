# Template Guide

These templates are ready to copy into your own project. Each one serves a specific purpose in the agent's workflow. Edit the contents to match your project's commands, paths, feature names, and verification steps.

## How to Get Started

Copy these four files into your project root first:

1. `AGENTS.md` or `CLAUDE.md`
2. `init.sh`
3. `claude-progress.md`
4. `feature_list.json`

Add the remaining files as your project grows.

---

## AGENTS.md

The root instruction file. This is the first thing the agent reads when it starts a session. It defines the operating rules: what to do before writing code, how to work, and how to wrap up.

**How to use it:**

- Copy to your project root directory
- Replace the startup workflow steps with your actual project paths and commands
- Adjust the working rules to match your team's conventions
- Keep the definition of done section — it's the most important part

**What it does for the agent:**

- Tells it to read progress and feature state before starting work
- Forces it to work on one feature at a time
- Requires evidence before marking anything as done
- Defines what a clean end-of-session looks like

Use `AGENTS.md` for Codex or other agents. Use `CLAUDE.md` if you're working with Claude Code — the structure is the same, just formatted for Claude's instruction style.

## init.sh

The startup script. Runs dependency installation, verification, and prints the start command — all in one shot.

**How to use it:**

- Copy to your project root
- Edit these three variables at the top:
  - `INSTALL_CMD` — your dependency install command (e.g. `npm install`, `pip install -r requirements.txt`)
  - `VERIFY_CMD` — your basic verification command (e.g. `npm test`, `pytest`)
  - `START_CMD` — your dev server start command (e.g. `npm run dev`)
- Make it executable: `chmod +x init.sh`

**What it does:**

1. Prints the current directory (so you can confirm it's running in the right place)
2. Installs dependencies
3. Runs the verification command
4. Prints the start command (or runs it if `RUN_START_COMMAND=1` is set)

If verification fails, the agent should stop and fix the baseline before doing anything else.

## claude-progress.md

The progress log. Every session writes to this file, and every new session reads it first.

**How to use it:**

- Copy to your project root
- Fill in the "Current Verified State" section with your project's info
- After each session, update the session record

**What each field means:**

- **Current Verified State** — the single source of truth for where the project stands
  - `Repository root directory` — where the project lives
  - `Standard startup path` — the command to get the project running
  - `Standard verification path` — the command to run tests
  - `Highest priority unfinished feature` — what the next session should work on
  - `Current blocker` — anything that's stuck
- **Session Record** — one entry per session
  - `Goal` — what you planned to do
  - `Completed` — what actually got done
  - `Verification run` — what tests were executed
  - `Evidence recorded` — what proof was captured
  - `Commits` — what was committed
  - `Known risks` — what might be broken
  - `Next best action` — where the next session should start

## feature_list.json

The feature tracker. A machine-readable list of every feature the agent needs to implement, along with its status, verification steps, and evidence.

**How to use it:**

- Copy to your project root
- Replace the example features with your own
- Each feature needs:
  - `id` — a short unique identifier
  - `priority` — integer, lower = higher priority
  - `area` — which part of the app (e.g. "chat", "import", "search")
  - `title` — short description
  - `user_visible_behavior` — what the user should see when it works
  - `status` — one of `not_started`, `in_progress`, `blocked`, `passing`
  - `verification` — step-by-step instructions to confirm it works
  - `evidence` — recorded proof that verification passed (filled in by the agent)
  - `notes` — any extra context

**Status rules:**

- `not_started` — hasn't been touched
- `in_progress` — the one feature currently being worked on (only one at a time)
- `blocked` — can't proceed due to a documented issue
- `passing` — verification passed and evidence is recorded

The agent should only have one feature in `in_progress` at any time.

## session-handoff.md

A compact handoff note between sessions. Use this when a session ends and you want the next one to pick up quickly.

**How to use it:**

- Copy to your project root
- Fill it out at the end of each session (or have the agent fill it out)

**What each section covers:**

- **Currently verified** — what's confirmed working and what verification was run
- **Changes this session** — what code or infrastructure changed
- **Still broken or unverified** — known issues and risky areas
- **Next best action** — what the next session should do, and what not to touch
- **Commands** — startup, verification, and debug commands for quick reference

This file is optional for small sessions. It becomes important when sessions are long or when the project has multiple active areas.

## clean-state-checklist.md

A checklist to run through before ending each session. Makes sure the repo is in a good state for the next session to start cleanly.

**How to use it:**

- Copy to your project root
- Run through it before you close a session
- The agent should also check these items as part of its end-of-session routine

**What it checks:**

- Standard startup still works
- Standard verification still runs
- Progress log is updated
- Feature list reflects actual state (no false `passing` entries)
- No half-finished work left unrecorded
- Next session can continue without manual fixes

## evaluator-rubric.md

A scorecard for reviewing agent output quality. Use this after a session or at project milestones to evaluate whether the work meets the bar.

**How to use it:**

- Copy to your project root
- After a session (or a set of sessions), score the agent's work across six dimensions
- Each dimension is scored 0-2

**The six dimensions:**

1. **Correctness** — does the implementation match the target behavior?
2. **Verification** — were the required checks actually run, with evidence?
3. **Scope discipline** — did the agent stay within the selected feature?
4. **Reliability** — does the result survive a restart or re-run?
5. **Maintainability** — is the code and documentation clear enough for the next session?
6. **Handoff readiness** — can a new session continue using only repo artifacts?

**Conclusion options:**

- Accept — meets the bar
- Revise — needs fixes before accepting
- Block — fundamental issues that need to be resolved first

**Important: the evaluator needs tuning.** Out of the box, agents are poor self-judges — they identify issues then talk themselves into approving. You will need to iterate:

1. Run the evaluator on a completed sprint.
2. Compare its scores against your own human judgment.
3. Where they diverge, make the rubric more specific about pass/fail criteria.
4. Re-run and check alignment.
5. Repeat until the evaluator consistently matches human review.

Plan for 3-5 tuning rounds. Record each change so you can track what improved alignment.

## quality-document.md

A quality snapshot that grades each product domain and architectural layer in your project. Tracks codebase health over time, not just individual session output.

**How to use it:**

- Copy to your project root
- Before starting a session: read it to understand where the codebase is weakest
- After a session: update grades based on what changed
- Over time: compare snapshots to see which harness changes actually improved codebase health

**What it grades:**

- **Product domains** (e.g., document import, Q&A flow, indexing): each domain gets a grade (A-D) across verification status, agent legibility, test stability, and key gaps
- **Architectural layers** (e.g., main process, preload, renderer, services): each layer gets a grade for boundary enforcement and agent legibility

**Why it matters:**

The evaluator rubric scores individual agent outputs. The quality document scores the codebase itself. They answer different questions:

- Evaluator rubric: "Did the agent do good work this session?"
- Quality document: "Is the project getting stronger or weaker over time?"

**When to update:**

- After each significant session
- Before benchmark comparisons
- After cleanup or simplification passes
- When onboarding a new agent or model to the project

**Harness simplification tie-in:**

The quality document also supports harness simplification. Every harness component encodes an assumption about what the model cannot do. As models improve, these assumptions go stale. To check whether a component is still needed:

1. Take a quality document snapshot.
2. Remove one harness component.
3. Run the benchmark task suite.
4. Take another snapshot.
5. Compare — if grades didn't drop, the component was overhead. If they did, restore it.
