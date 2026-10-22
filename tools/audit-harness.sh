#!/usr/bin/env bash
# audit-harness.sh — Zero-dependency shell audit for harness engineering
# Usage: ./tools/audit-harness.sh [path/to/repo]
#        curl -fsSL https://raw.githubusercontent.com/walkinglabs/learn-harness-engineering/main/tools/audit-harness.sh | bash -s -- /path/to/repo
# Checks an existing repo for all five harness subsystems (L03–L12).
# Exit 0 if all CRITICAL items pass; exit 1 otherwise.
# No Node.js required — complements skills/harness-creator/scripts/validate-harness.mjs
#
# Course reference: https://walkinglabs.github.io/learn-harness-engineering/en/
# Author: Stephen Kimoi (https://github.com/Stephen-Kimoi/harness-engineering-template)

set -euo pipefail

REPO="${1:-.}"

# ── Colours ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

pass()  { echo -e "  ${GREEN}[PASS]${RESET} $1"; }
fail()  { echo -e "  ${RED}[FAIL]${RESET} $1"; }
warn()  { echo -e "  ${YELLOW}[WARN]${RESET} $1"; }
header(){ echo -e "\n${CYAN}${BOLD}$1${RESET}"; }

CRITICAL_PASS=0
CRITICAL_FAIL=0
RECOMMENDED_PASS=0
RECOMMENDED_FAIL=0
RECS=()

check_critical() {
  local description="$1"
  local result="$2"   # "pass" or "fail"
  local fix="${3:-}"
  if [[ "$result" == "pass" ]]; then
    pass "[CRITICAL] $description"
    CRITICAL_PASS=$((CRITICAL_PASS + 1))
  else
    fail "[CRITICAL] $description"
    CRITICAL_FAIL=$((CRITICAL_FAIL + 1))
    [[ -n "$fix" ]] && RECS+=("${RED}[CRITICAL]${RESET} $fix")
  fi
  return 0
}

check_recommended() {
  local description="$1"
  local result="$2"
  local fix="${3:-}"
  if [[ "$result" == "pass" ]]; then
    pass "[RECOMMENDED] $description"
    RECOMMENDED_PASS=$((RECOMMENDED_PASS + 1))
  else
    warn "[RECOMMENDED] $description"
    RECOMMENDED_FAIL=$((RECOMMENDED_FAIL + 1))
    [[ -n "$fix" ]] && RECS+=("${YELLOW}[RECOMMENDED]${RESET} $fix")
  fi
  return 0
}

file_exists()    { [[ -f "$REPO/$1" ]] && echo "pass" || echo "fail"; }
dir_exists()     { [[ -d "$REPO/$1" ]] && echo "pass" || echo "fail"; }
any_file_match() {
  # any_file_match "pattern1" "pattern2" ...
  for pattern in "$@"; do
    # Quote "$REPO/$pattern" to prevent word-splitting / command injection (CWE-78).
    # compgen -G does glob matching without spawning ls, so a crafted $REPO value
    # such as "/tmp; rm -rf /" can no longer be split into a second command.
    if compgen -G "$REPO/$pattern" > /dev/null; then
      echo "pass"; return
    fi
  done
  echo "fail"
}

contains_pattern() {
  local file="$REPO/$1"
  local pattern="$2"
  if [[ -f "$file" ]] && grep -qiE "$pattern" "$file" 2>/dev/null; then
    echo "pass"
  else
    echo "fail"
  fi
}

instructions_file() {
  [[ -f "$REPO/AGENTS.md" ]] || [[ -f "$REPO/CLAUDE.md" ]] && echo "pass" || echo "fail"
}

instructions_path() {
  [[ -f "$REPO/AGENTS.md" ]] && echo "AGENTS.md" || echo "CLAUDE.md"
}

makefile_has_target() {
  local target="$1"
  if [[ -f "$REPO/Makefile" ]] && grep -qE "^${target}[[:space:]]*:" "$REPO/Makefile" 2>/dev/null; then
    echo "pass"
  else
    echo "fail"
  fi
}

echo -e "${BOLD}Harness Engineering Audit${RESET}"
echo -e "Repo: ${REPO}"
echo -e "Ref:  https://walkinglabs.github.io/learn-harness-engineering/en/"

# ── Subsystem 1: Instructions ──────────────────────────────────────────────────
header "Subsystem 1: Instructions"

inst="$(instructions_file)"
check_critical "AGENTS.md or CLAUDE.md exists at repo root" "$inst" \
  "Create AGENTS.md (or CLAUDE.md) at the repo root. It must answer 'what is this system?' in the first 10 lines and list the verification command."

if [[ "$inst" == "pass" ]]; then
  ipath="$(instructions_path)"
  check_critical "Instructions file answers 'what is this system?' in first 10 lines" \
    "$(head -10 "$REPO/$ipath" 2>/dev/null | grep -qiE "(project|system|service|app|what|overview|this (is|repo|tool))" && echo "pass" || echo "fail")" \
    "Add a one-line description of the system in the first 10 lines of $ipath (e.g. '# This is a ...' or '## Overview')."
  check_critical "Verification commands are listed in instructions file" \
    "$(contains_pattern "$ipath" "(make check|npm test|mix test|pytest|cargo test|make test|yarn test|verification|verify)")" \
    "Add a Verification section to $ipath listing the command to run (e.g. 'make check' or 'npm test')."
  check_recommended "Hard constraints (MUST / MUST NOT) are stated" \
    "$(contains_pattern "$ipath" "(MUST|MUST NOT|must not|must never|constraint|forbidden|never)")" \
    "Add a Constraints section to $ipath with explicit MUST / MUST NOT rules."
  check_recommended "State files are enumerated (PROGRESS.md, feature_list)" \
    "$(contains_pattern "$ipath" "(PROGRESS\.md|feature_list|DECISIONS\.md|docs/decisions)")" \
    "Reference PROGRESS.md, DECISIONS.md, and feature_list.json in $ipath so agents know where state lives."
  check_recommended "Documentation staleness rule present (update docs with code, no stale docs)" \
    "$(contains_pattern "$ipath" "(stale|staleness|same commit|doc.*update|update.*doc|outdated)")" \
    "Add a rule to $ipath: 'Update docs in the same commit as the code change — no stale documentation.'"
  check_recommended "Commit atomicity rule present (one logical op per commit)" \
    "$(contains_pattern "$ipath" "(atomic|one commit|same commit|partial commit|consistent.*commit|commit.*consistent)")" \
    "Add a rule to $ipath: 'One logical operation per commit; the repo must be in a consistent state after every commit.'"

  # L04: Split instructions
  _inst_lines="$(wc -l < "$REPO/$ipath" 2>/dev/null || echo 999)"
  check_recommended "Entry file is 50–200 lines (router, not encyclopedia) [L04]" \
    "$([[ $_inst_lines -ge 50 && $_inst_lines -le 200 ]] && echo "pass" || echo "fail")" \
    "$ipath is $_inst_lines lines (target 50–200) — if longer, split detailed sections into docs/ topic files and link to them; if shorter, add the missing router sections (overview, verification, constraints, state files)."
  check_recommended "Entry file links to topic documents in docs/ [L04]" \
    "$(contains_pattern "$ipath" "(docs/[a-z])")" \
    "Add links in $ipath to topic docs in docs/ (e.g. 'See [Architecture](docs/architecture.md)')."
  check_recommended "Hard constraints section has source/why annotations per rule [L04]" \
    "$(contains_pattern "$ipath" "(source:|remove when:|why:|added because)")" \
    "Annotate each constraint in $ipath with a 'source:' or 'why:' comment so agents know the reason (e.g. '# source: outage-2024-03')."
else
  fail "[CRITICAL] Cannot check instructions content — file missing"
  RECS+=("${RED}[CRITICAL]${RESET} Create AGENTS.md at the repo root covering: system description, verification command, constraints, and state file references.")
  CRITICAL_FAIL=$((CRITICAL_FAIL + 2))
  warn "[RECOMMENDED] Cannot check hard constraints — file missing"
  warn "[RECOMMENDED] Cannot check state file references — file missing"
  RECOMMENDED_FAIL=$((RECOMMENDED_FAIL + 2))
fi

# Proximity principle: at least one module-level doc exists somewhere under src/lib/app
check_recommended "Module-level doc (ARCHITECTURE.md or CONSTRAINTS.md) co-located with code" \
  "$(find "$REPO" -not -path '*/.git/*' \( -name 'ARCHITECTURE.md' -o -name 'CONSTRAINTS.md' \) 2>/dev/null | grep -qv "^$REPO/ARCHITECTURE.md\|^$REPO/CONSTRAINTS.md" && echo "pass" || echo "fail")" \
  "Create ARCHITECTURE.md or CONSTRAINTS.md inside a code directory (e.g. src/ARCHITECTURE.md) describing that module's design."

# ── Subsystem 2: Tools ─────────────────────────────────────────────────────────
header "Subsystem 2: Tools"

check_recommended "Tool access is scoped (settings.json, .claude/, or MCP config present)" \
  "$(any_file_match ".claude/settings.json" ".claude/settings.local.json" "mcp.json" ".mcp.json")" \
  "Create .claude/settings.json to scope which tools the agent is allowed to use."
check_recommended "MCP or tool integrations documented in instructions file" \
  "$(contains_pattern "$(instructions_path 2>/dev/null || echo "AGENTS.md")" "(MCP|tool|permission|capability)")" \
  "Add a Tools/MCP section to your instructions file listing available integrations and their permitted capabilities."

# ── Subsystem 3: Environment ───────────────────────────────────────────────────
header "Subsystem 3: Environment"

check_critical "Dependency lockfile present" \
  "$(any_file_match "package-lock.json" "yarn.lock" "pnpm-lock.yaml" "mix.lock" "Pipfile.lock" "poetry.lock" "requirements.txt" "Cargo.lock" "go.sum" "Gemfile.lock")" \
  "Commit a dependency lockfile (package-lock.json, yarn.lock, requirements.txt, go.sum, etc.) so installs are reproducible."

check_recommended "Runtime version pinned (.tool-versions, .nvmrc, .python-version, etc.)" \
  "$(any_file_match ".tool-versions" ".nvmrc" ".node-version" ".python-version" ".ruby-version" ".java-version")" \
  "Create a .nvmrc (Node) or .python-version (Python) or .tool-versions (asdf) file pinning the exact runtime version."

check_recommended "Makefile (or equivalent task runner) present" \
  "$(any_file_match "Makefile" "package.json" "mix.exs" "justfile" "Taskfile.yml")" \
  "Create a Makefile with at least setup, check, and test targets so all repo operations are one command."

check_recommended "Single-command setup target exists (make setup / npm install)" \
  "$(makefile_has_target "setup")" \
  "Add a 'setup:' target to your Makefile that installs all dependencies from scratch (e.g. 'setup: npm install')."

check_recommended "Single-command dev server target exists (make dev)" \
  "$(makefile_has_target "dev")" \
  "Add a 'dev:' target to your Makefile that starts the local dev server (e.g. 'dev: npm run dev')."

# ── Subsystem 4: State ─────────────────────────────────────────────────────────
header "Subsystem 4: State"

check_critical "PROGRESS.md exists at repo root" "$(file_exists "PROGRESS.md")" \
  "Create PROGRESS.md at the repo root with sections: Current State (commit hash + test status), In Progress, Next Steps, and Blockers."

if [[ "$(file_exists "PROGRESS.md")" == "pass" ]]; then
  check_recommended "PROGRESS.md references current task / in-progress work" \
    "$(contains_pattern "PROGRESS.md" "(in.progress|current|task|next step|blocker|completed)")" \
    "Add an '## In Progress' section to PROGRESS.md describing the current task."
fi

decisions_result="$(any_file_match "DECISIONS.md" "docs/decisions")"
check_recommended "DECISIONS.md or docs/decisions/ exists" "$decisions_result" \
  "Create DECISIONS.md at the repo root to log architectural decisions and their rationale."

check_recommended "feature_list.json (or equivalent) exists" \
  "$(any_file_match "feature_list.json" "features.json" "features.md" "FEATURES.md")" \
  "Create feature_list.json — an array of objects each with fields: id, behavior, verification, state (values: planned/active/passing)."

if [[ "$(any_file_match "feature_list.json" "features.json")" == "pass" ]]; then
  fl_file=""
  for _f in "$REPO/feature_list.json" "$REPO/features.json"; do
    [[ -f "$_f" ]] && { fl_file="$_f"; break; }
  done
  if [[ -n "$fl_file" ]]; then
    check_recommended "feature_list.json contains required fields (id, behavior, verification, state)" \
      "$(grep -qE '"id"' "$fl_file" && grep -qE '"behavior"' "$fl_file" && grep -qE '"verification"' "$fl_file" && grep -qE '"state"' "$fl_file" && echo "pass" || echo "fail")"
  fi
fi

# ── Subsystem 5: Feedback ──────────────────────────────────────────────────────
header "Subsystem 5: Feedback"

check_recommended "Makefile has a 'check' target (runs full verification pipeline)" \
  "$(makefile_has_target "check")" \
  "Add a 'check:' target to Makefile that runs the full pipeline (lint + tests). This is the single command agents use to verify the repo is green."

check_recommended "Makefile has a 'test' target" \
  "$(makefile_has_target "test")" \
  "Add a 'test:' target to Makefile (e.g. 'test: npm test' or 'test: pytest')."

check_critical "Verification command documented in AGENTS.md or CLAUDE.md" \
  "$(contains_pattern "$(instructions_path 2>/dev/null || echo "AGENTS.md")" "(make check|npm test|mix test|pytest|cargo test|make test|yarn test|verify|verification)")" \
  "Add a Verification section to your instructions file with the exact command to run (e.g. 'Run \`make check\` — must exit 0 before every commit')."

# ── L05: Cross-Session Continuity ─────────────────────────────────────────────
header "L05: Cross-Session Continuity"

ipath_l05="$(instructions_path 2>/dev/null || echo "AGENTS.md")"

check_critical "PROGRESS.md has a Current State block (commit hash + test status)" \
  "$(contains_pattern "PROGRESS.md" "(last commit|current state|commit.*hash|test.*pass|passing.*fail)")" \
  "Add a '## Current State' section to PROGRESS.md, e.g.: 'Last commit: abc1234 | make check: passing'. Update this on every clock-out."

check_recommended "Clock-in routine documented in instructions (read PROGRESS.md then run check)" \
  "$(contains_pattern "$ipath_l05" "(clock.in|session start|before touching)")" \
  "Add a Clock-in section to $ipath_l05: 'Before touching code: read PROGRESS.md, then run make check to confirm green baseline.'"

check_recommended "Clock-out routine documented in instructions (update PROGRESS.md then commit)" \
  "$(contains_pattern "$ipath_l05" "(clock.out|session end|before closing)")" \
  "Add a Clock-out section to $ipath_l05: 'Before closing: update PROGRESS.md current state + next steps, run make check, commit.'"

check_recommended "Context anxiety / rushed-finish warning present in instructions" \
  "$(contains_pattern "$ipath_l05" "(context.*anxi|rushed|running low|skip verif|do not rush)")" \
  "Add a warning to $ipath_l05: 'If running low on context, do NOT rush to finish — stop, update PROGRESS.md, and commit a clean checkpoint.'"

check_recommended "Commit message guidance (explain why, not just what) present" \
  "$(contains_pattern "$ipath_l05" "(commit.*why|why.*commit|explain why|not just what)")" \
  "Add commit guidance to $ipath_l05: 'Write commit messages that explain WHY the change was made, not just what changed.'"

check_recommended "PROGRESS.md Next Steps section exists with specific actions" \
  "$(contains_pattern "PROGRESS.md" "(next step|next action)")" \
  "Add a '## Next Steps' section to PROGRESS.md listing specific, actionable items so the next session can start immediately."

# ── L03: Repository as System of Record ───────────────────────────────────────
header "L03: Repository as System of Record"

ipath_l03="$(instructions_path 2>/dev/null || echo "AGENTS.md")"

_durability="fail"
if [[ -f "$REPO/PROGRESS.md" ]] && { [[ -f "$REPO/DECISIONS.md" ]] || [[ -d "$REPO/docs/decisions" ]]; }; then
  _durability="pass"
fi
check_recommended "ACID – Durability: cross-session knowledge written to tracked files (PROGRESS + DECISIONS present)" "$_durability" \
  "Both PROGRESS.md and DECISIONS.md (or docs/decisions/) must exist so cross-session knowledge is never lost in an agent's context window."

check_recommended "ACID – Consistency: verifiable consistent-state predicate documented (make check / equivalent)" \
  "$(contains_pattern "$ipath_l03" "(make check|consistent state|exits 0|all tests pass|verification pipeline)")" \
  "Document the consistent-state predicate in $ipath_l03 (e.g. 'The repo is consistent when \`make check\` exits 0')."

check_recommended "ACID – Atomicity: commit atomicity rule stated in instructions" \
  "$(contains_pattern "$ipath_l03" "(atomic|one commit|same commit|partial commit|consistent.*commit|commit.*consistent)")" \
  "State commit atomicity in $ipath_l03: 'Each commit must represent one complete logical change; no partial work.'"

check_recommended "Knowledge proximity: at least one module-level doc exists alongside code (not only root-level docs)" \
  "$(find "$REPO" -not -path '*/.git/*' \( -name 'ARCHITECTURE.md' -o -name 'CONSTRAINTS.md' \) 2>/dev/null | grep -qv "^${REPO%/}/ARCHITECTURE.md\|^${REPO%/}/CONSTRAINTS.md" && echo "pass" || echo "fail")" \
  "Create ARCHITECTURE.md or CONSTRAINTS.md inside a code directory (e.g. src/ARCHITECTURE.md) to document that module's design decisions."

# ── L07: WIP=1 and VCR Enforcement ───────────────────────────────────────────
header "L07: WIP=1 and VCR Enforcement"

ipath_l07="$(instructions_path 2>/dev/null || echo "AGENTS.md")"

check_recommended "WIP=1 rule present in instructions (one active feature at a time) [L07]" \
  "$(contains_pattern "$ipath_l07" "(WIP.?1|one.*active|active.*at.*time|single.*active|only.*one.*active|activate.*new.*feature|new.*feature.*while.*active)")" \
  "Add a WIP=1 rule to $ipath_l07: 'Only one feature may have state=active at a time. Complete and move to passing before activating the next.'"

check_recommended "make vcr target exists in Makefile [L07]" \
  "$(makefile_has_target "vcr")" \
  "Add a 'vcr:' target to Makefile that prints the VCR ratio: passing features / activated features (e.g. uses jq on feature_list.json)."

check_recommended "make status target exists in Makefile [L08]" \
  "$(makefile_has_target "status")" \
  "Add a 'status:' target to Makefile that prints task backlog status (developed, in progress, remaining)." 

# Runtime VCR check — compute from feature_list.json
if [[ "$(any_file_match "feature_list.json" "features.json")" == "pass" ]]; then
  _vcr_file=""
  for _f in "$REPO/feature_list.json" "$REPO/features.json"; do
    [[ -f "$_f" ]] && { _vcr_file="$_f"; break; }
  done
  if [[ -n "$_vcr_file" ]]; then
    _vcr_active=0; _vcr_passing=0
    if grep -q '"state":[[:space:]]*"active"' "$_vcr_file" 2>/dev/null; then
      _vcr_active=$(grep -c '"state":[[:space:]]*"active"' "$_vcr_file")
    fi
    if grep -q '"state":[[:space:]]*"passing"' "$_vcr_file" 2>/dev/null; then
      _vcr_passing=$(grep -c '"state":[[:space:]]*"passing"' "$_vcr_file")
    fi
    _vcr_activated=$(( _vcr_active + _vcr_passing ))
    if [[ "$_vcr_activated" -eq 0 ]]; then
      check_recommended "VCR: no activated features yet (OK to activate first feature) [L07]" "pass"
    elif [[ "$_vcr_active" -gt 0 ]]; then
      check_recommended "VCR = $_vcr_passing/$_vcr_activated — $_vcr_active active feature(s) not yet passing (VCR < 1.0) [L07]" "fail"
    else
      check_recommended "VCR = $_vcr_passing/$_vcr_activated = 1.0 — all activated features are passing [L07]" "pass"
    fi
  fi
fi

# ── L08: Feature List as Harness Primitive ────────────────────────────────────
header "L08: Feature List as Harness Primitive"

ipath_l08="$(instructions_path 2>/dev/null || echo "AGENTS.md")"

# Helper: find first present feature list file
_fl_path() {
  for _f in "$REPO/feature_list.json" "$REPO/features.json"; do
    [[ -f "$_f" ]] && { echo "$_f"; return; }
  done
  echo ""
}

_fl="$(_fl_path)"

check_recommended "feature_list.json entries have an 'evidence' field [L08]" \
  "$( [[ -n "$_fl" ]] && grep -q '"evidence"' "$_fl" 2>/dev/null && echo "pass" || echo "fail" )" \
  "Add an 'evidence' field to every entry in feature_list.json. Example: \"evidence\": \"commit abc1234, verified 2026-06-07\"."

check_recommended "verify-feature script present (scripts/verify-feature.sh) [L08]" \
  "$(any_file_match "scripts/verify-feature.sh")" \
  "Create scripts/verify-feature.sh — the harness gate that runs a feature's verification command and transitions state to passing. Get the template from: https://github.com/Stephen-Kimoi/harness-engineering-template/blob/main/scripts/verify-feature.sh"

check_recommended "make verify-feature target exists in Makefile [L08]" \
  "$(makefile_has_target "verify-feature")" \
  "Add a 'verify-feature:' target to Makefile: 'bash scripts/verify-feature.sh \$(F)'. Usage: make verify-feature F=F02"

check_recommended "Feature List Rules documented in instructions (pass-state gating) [L08]" \
  "$(contains_pattern "$ipath_l08" "(verify.feature|verification script|don.t.*state|state.*automatically|harness.*updat|pass.state|never.*set.*state.*passing|never.*edit.*state)")" \
  "Add a Feature List Rules section to $ipath_l08 stating: 'Never set state to passing directly — run make verify-feature F=<id>.'"

check_recommended "Feature granularity rule documented (one session per feature) [L08]" \
  "$(contains_pattern "$ipath_l08" "(one session|completable.*session|session.*complet|one feature.*session|single session)")" \
  "Add a granularity rule to $ipath_l08: 'Each feature must be completable in one session. If it spans sessions, split it.'"

check_recommended "State machine documented (not_started → active → passing) [L08]" \
  "$(contains_pattern "$ipath_l08" "(not_started|state machine|no skipping|active.*passing)")" \
  "Document the state machine in $ipath_l08: not_started → active → passing. Note that skipping states is not allowed."

# ── L09: Preventing Premature Completion Declarations ─────────────────────────
header "L09: Premature Completion Prevention"

ipath_l09="$(instructions_path 2>/dev/null || echo "AGENTS.md")"

check_recommended "Definition of Done section present in instructions [L09]" \
  "$(contains_pattern "$ipath_l09" "(definition of done|feature complete|runtime evidence|code is written|all layers pass)")" \
  "Add a 'Definition of Done' section to $ipath_l09 stating: 'A task is complete when runtime evidence passes — not when code is written or the agent is confident.'"

check_recommended "Three-layer verification model documented [L09]" \
  "$(contains_pattern "$ipath_l09" "(layer 1|layer 2|layer 3|syntax.*static|runtime.*behav|system.*confirm|end.to.end.*verif)")" \
  "Document the three-layer model in $ipath_l09: Layer 1 (syntax/static), Layer 2 (runtime behavior), Layer 3 (system confirmation / e2e)."

check_recommended "Layer ordering rule documented (do not skip layers) [L09]" \
  "$(contains_pattern "$ipath_l09" "(do not proceed|don.t proceed|layer.*fail|skip.*layer|must pass in order|in order)")" \
  "Add the ordering rule to $ipath_l09: 'Do not proceed to Layer N+1 if Layer N fails.'"

check_recommended "Runtime signals documented (app startup, side effects) [L09]" \
  "$(contains_pattern "$ipath_l09" "(ready state|app.*start|startup|side effect|database write|file operation|cleanup|debug artifact)")" \
  "Add runtime signals to $ipath_l09: app reaches ready state, side effects are correct, no debug artifacts remain."

# Check for layers field with repair instructions in feature_list.json
_fl_l09="$(_fl_path)"
_has_layers_repair="fail"
if [[ -n "$_fl_l09" ]] && grep -q '"layers"' "$_fl_l09" 2>/dev/null && grep -q '"repair"' "$_fl_l09" 2>/dev/null; then
  _has_layers_repair="pass"
fi
check_recommended "feature_list.json uses layers with repair instructions [L09]" \
  "$_has_layers_repair" \
  "Add a 'layers' array to feature_list.json entries. Each layer needs: label, cmd, repair. The repair field gives the agent actionable fix instructions on failure."

check_recommended "verify-feature.sh handles multi-layer validation with repair output [L09]" \
  "$(grep -q 'repair\|run_layer\|How to fix' "$REPO/scripts/verify-feature.sh" 2>/dev/null && echo "pass" || echo "fail")" \
  "Update scripts/verify-feature.sh to run layers in sequence and print the repair instruction when a layer fails. Get the updated template from the harness-engineering-template repo."

# ── L10: End-to-End Testing and Architectural Boundaries ─────────────────────
header "L10: E2E Testing and Architectural Boundaries"

ipath_l10="$(instructions_path 2>/dev/null || echo "AGENTS.md")"

check_recommended "make e2e target exists in Makefile [L10]" \
  "$(makefile_has_target "e2e")" \
  "Add an 'e2e:' target to Makefile running your end-to-end suite (e.g. 'npx playwright test', 'pytest tests/e2e/', 'mix test --only e2e'). Required when changes cross component boundaries."

check_recommended "make check-arch target exists in Makefile [L10]" \
  "$(makefile_has_target "check-arch")" \
  "Add a 'check-arch:' target to Makefile: 'bash scripts/check-arch.sh'. This runs architectural constraint rules and outputs WHAT/WHY/FIX on violations."

check_recommended "scripts/check-arch.sh present [L10]" \
  "$(any_file_match "scripts/check-arch.sh")" \
  "Create scripts/check-arch.sh — the architectural constraint runner. Get the template from: https://github.com/Stephen-Kimoi/harness-engineering-template/blob/main/scripts/check-arch.sh"

check_recommended ".harness/arch-rules.json present (architectural rule registry) [L10]" \
  "$(any_file_match ".harness/arch-rules.json")" \
  "Create .harness/arch-rules.json with at least one rule. Each rule needs: id, description, check, expect, what, why, fix. Promote every code-review finding into a rule here."

check_recommended "Arch rules use WHAT/WHY/FIX error format [L10]" \
  "$( [[ -f "$REPO/.harness/arch-rules.json" ]] && grep -q '"what"' "$REPO/.harness/arch-rules.json" && grep -q '"why"' "$REPO/.harness/arch-rules.json" && grep -q '"fix"' "$REPO/.harness/arch-rules.json" && echo "pass" || echo "fail" )" \
  "Ensure each rule in .harness/arch-rules.json has 'what', 'why', and 'fix' fields with agent-actionable text (name the specific file, function, or env var to change)."

check_recommended "Architecture Boundaries section present in instructions [L10]" \
  "$(contains_pattern "$ipath_l10" "(architecture.*boundar|arch.*boundar|layer.*depend|enforce.*invariant|check-arch|arch.rules)")" \
  "Add an Architecture Boundaries section to $ipath_l10 describing your layer model and stating that 'make check-arch' enforces the constraints."

check_recommended "E2E requirement for cross-component changes documented [L10]" \
  "$(contains_pattern "$ipath_l10" "(cross.component|cross.domain|layer 3.*required|e2e.*required|end.to.end.*required|required.*cross)")" \
  "Add a rule to $ipath_l10: 'Layer 3 (e2e) is required when changes cross component or domain boundaries.'"

check_recommended "Review-to-automation promotion principle documented [L10]" \
  "$(contains_pattern "$ipath_l10" "(code review.*automat|review.*promot|promot.*check|new.*error.*rule|catch.*review.*rule|arch.rules)")" \
  "Add the promotion principle to $ipath_l10: 'Every new error category caught in code review becomes a rule in .harness/arch-rules.json.'"

# ── L11: Observability Inside the Harness ─────────────────────────────────────
header "L11: Observability"

ipath_l11="$(instructions_path 2>/dev/null || echo "AGENTS.md")"

check_recommended "templates/sprint-contract.md present [L11]" \
  "$(file_exists "templates/sprint-contract.md")" \
  "Create templates/sprint-contract.md — the pre-feature negotiation template defining scope, DoD, and exclusions. Get it from: https://github.com/Stephen-Kimoi/harness-engineering-template/blob/main/templates/sprint-contract.md"

check_recommended "templates/evaluator-rubric.md present [L11]" \
  "$(file_exists "templates/evaluator-rubric.md")" \
  "Create templates/evaluator-rubric.md — the scoring rubric with A/B/C/D thresholds per dimension (correctness, arch compliance, test coverage, verification evidence)."

check_recommended "scripts/session-trace.sh present (runtime signal collector) [L11]" \
  "$(any_file_match "scripts/session-trace.sh")" \
  "Create scripts/session-trace.sh to record structured JSONL events per session. Get the template from: https://github.com/Stephen-Kimoi/harness-engineering-template/blob/main/scripts/session-trace.sh"

check_recommended ".harness/traces/ directory present [L11]" \
  "$(dir_exists ".harness/traces")" \
  "Create .harness/traces/ directory (add a .gitkeep so it's tracked). Add .harness/traces/traces.jsonl to .gitignore — it's a runtime artifact, not source."

check_recommended "Observability / sprint contract protocol documented in instructions [L11]" \
  "$(contains_pattern "$ipath_l11" "(sprint contract|observabilit|session.trace|session-trace|runtime signal|signal collect)")" \
  "Add an Observability section to $ipath_l11: sprint contract before each feature, session-trace events during verification, evaluator rubric scoring after completion."

check_recommended "Evaluator rubric referenced in instructions [L11]" \
  "$(contains_pattern "$ipath_l11" "(rubric|evaluator.*score|scoring.*dimension|dimension.*score|A or B|passing.*threshold)")" \
  "Reference the evaluator rubric in $ipath_l11: 'Score each completed sprint against templates/evaluator-rubric.md — every dimension must reach B or above.'"

check_recommended "make session-start and session-end targets present [L11]" \
  "$(makefile_has_target "session-start")" \
  "Add session-start and session-end targets to Makefile wrapping scripts/session-trace.sh."

# ── L12: Clean State Protocol ─────────────────────────────────────────────────
header "L12: Clean State Protocol"

ipath_l12="$(instructions_path 2>/dev/null || echo "AGENTS.md")"

check_recommended "templates/clean-state-checklist.md present [L12]" \
  "$(file_exists "templates/clean-state-checklist.md")" \
  "Create templates/clean-state-checklist.md with the 5 dimensions: build passes, tests pass, feature list updated, no debug artifacts, startup path works. A session is not complete until all five pass."

check_recommended "scripts/clean-state-check.sh present (idempotent verifier) [L12]" \
  "$(any_file_match "scripts/clean-state-check.sh")" \
  "Create scripts/clean-state-check.sh — an idempotent script that checks the 5 clean-state dimensions and exits 0 only when all pass. Safe to run repeatedly."

check_recommended "make clean-check target present [L12]" \
  "$(makefile_has_target "clean-check")" \
  "Add a 'clean-check:' target to Makefile: 'bash scripts/clean-state-check.sh .'  Agents run this at clock-out before committing."

check_recommended "Session exit checklist / clean-state referenced in instructions [L12]" \
  "$(contains_pattern "$ipath_l12" "(clean.state|clean-state|clean_state|session exit|exit checklist|debug artifact|no.*debug|remove.*debug)")" \
  "Add a clean-state reference to the Clock-Out section in $ipath_l12: 'Run make clean-check before committing — confirms build, no debug artifacts, PROGRESS.md updated.'"

check_recommended "Quality document present (module health scores) [L12]" \
  "$( [[ -f "$REPO/docs/quality-document.md" ]] || [[ -f "$REPO/templates/quality-document.md" ]] && echo "pass" || echo "fail" )" \
  "Create docs/quality-document.md (or use templates/quality-document.md) scoring each module A/B/C/D across 5 dimensions. New sessions read this to know where to prioritize."

check_recommended "Quality document referenced in instructions [L12]" \
  "$(contains_pattern "$ipath_l12" "(quality.doc|quality doc|quality-doc|quality score|module.*grade|module.*quality|A.*B.*C.*D|grade.*module)")" \
  "Reference the quality document in $ipath_l12 Clock-Out: 'Update docs/quality-document.md for the module you touched (A/B/C/D per dimension).'"

check_recommended "Dual-mode cleanup documented (immediate + periodic/weekly) [L12]" \
  "$(contains_pattern "$ipath_l12" "(periodic|weekly|monthly|dual.mode|immediate.*cleanup|cleanup.*periodic|regular.*sweep|periodic.*sweep)")" \
  "Document the dual-mode cleanup strategy in $ipath_l12: immediate cleanup at every session end + periodic (weekly/monthly) full-system sweep for structural drift."

# ── Summary ────────────────────────────────────────────────────────────────────
TOTAL_PASS=$((CRITICAL_PASS + RECOMMENDED_PASS))
TOTAL=$((CRITICAL_PASS + CRITICAL_FAIL + RECOMMENDED_PASS + RECOMMENDED_FAIL))

echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}Summary${RESET}"
echo -e "  Total:       ${TOTAL_PASS} / ${TOTAL} harness components present"
echo -e "  Critical:    ${CRITICAL_PASS} / $((CRITICAL_PASS + CRITICAL_FAIL)) (must-have for basic function)"
echo -e "  Recommended: ${RECOMMENDED_PASS} / $((RECOMMENDED_PASS + RECOMMENDED_FAIL)) (best practice)"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

if [[ ${#RECS[@]} -gt 0 ]]; then
  echo ""
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${BOLD}What to fix${RESET}"
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  for rec in "${RECS[@]}"; do
    echo -e "  • ${rec}"
  done
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
fi

if [[ $CRITICAL_FAIL -gt 0 ]]; then
  echo -e "\n${RED}${BOLD}CRITICAL items are missing. Address these before running long agent sessions.${RESET}"
  exit 1
else
  echo -e "\n${GREEN}${BOLD}All CRITICAL harness components are present.${RESET}"
  if [[ $RECOMMENDED_FAIL -gt 0 ]]; then
    echo -e "${YELLOW}Some RECOMMENDED items are missing. See above for specific fixes.${RESET}"
  fi
  exit 0
fi
