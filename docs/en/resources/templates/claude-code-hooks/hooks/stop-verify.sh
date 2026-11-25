#!/usr/bin/env bash
# Stop hook: the agent may not end its turn while verification is red (Lecture 09).
# Exit 2 refuses the stop and feeds stderr back to the agent, so "done" requires a
# passing VERIFY_CMD rather than the agent's confidence.
#
# Keep VERIFY_CMD fast (type-check + unit tests); it runs every time the agent stops.
# Set it to "" to disable the gate. It is executed as a shell command, from the
# environment or the default below, so only set it from trusted configuration.

VERIFY_CMD="${VERIFY_CMD-npm test --silent}"
[ -z "$VERIFY_CMD" ] && exit 0

INPUT=$(cat)
# When the agent is already continuing because of this hook, let it stop: one
# forced retry per turn avoids an endless loop on a failure it cannot fix.
if command -v jq >/dev/null 2>&1 &&
   [ "$(printf '%s' "$INPUT" | jq -r '.stop_hook_active // false' 2>/dev/null)" = "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0

# Nothing changed since the last commit: nothing new to verify.
if git rev-parse --is-inside-work-tree >/dev/null 2>&1 &&
   [ -z "$(git status --porcelain 2>/dev/null)" ]; then
  exit 0
fi

if OUTPUT=$(bash -c "$VERIFY_CMD" 2>&1); then
  exit 0
fi

{
  echo "Verification failed (\`$VERIFY_CMD\`), so the work is not done yet."
  echo "Fix the failure and rerun it. If it cannot be fixed in this session, record the"
  echo "failure and the next step in claude-progress.md instead of reporting success."
  echo
  printf '%s\n' "$OUTPUT" | tail -n 30
} >&2
exit 2
