#!/usr/bin/env bash
# SessionStart hook: runs the clock-in routine (Lectures 05 and 06) for the agent.
# Whatever this prints on stdout is added to the agent's context before its first
# turn, so the session starts from the recorded state instead of from memory.
# Read-only: it never installs, builds or changes files.

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0

PROGRESS_LINES="${PROGRESS_LINES:-40}"

echo "## Session clock-in (.claude/hooks/session-start.sh)"

progress=""
for f in claude-progress.md PROGRESS.md progress.md; do
  [ -f "$f" ] && { progress="$f"; break; }
done
if [ -n "$progress" ]; then
  echo
  echo "### $progress (last $PROGRESS_LINES lines)"
  tail -n "$PROGRESS_LINES" "$progress"
else
  echo
  echo "No progress log found (claude-progress.md). Create one before ending this session."
fi

if [ -f feature_list.json ] && command -v jq >/dev/null 2>&1; then
  echo
  echo "### feature_list.json: features not yet passing"
  jq -r '.features[]? | select(.status != "passing")
         | "- [\(.status)] \(.id): \(.title)"' feature_list.json 2>/dev/null | head -n 15
fi

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo
  echo "### git"
  echo "branch: $(git branch --show-current 2>/dev/null)"
  git log --oneline -5 2>/dev/null
  changes=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  [ "$changes" -gt 0 ] && echo "uncommitted changes: $changes file(s) — find out whose before editing"
fi

echo
echo "Next: run ./init.sh to confirm a green baseline, then pick exactly one feature."
exit 0
