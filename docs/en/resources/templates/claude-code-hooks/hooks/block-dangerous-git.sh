#!/usr/bin/env bash
# PreToolUse(Bash) hook: blocks git commands that destroy work or bypass the
# harness's own checks. Exit 2 refuses the call and shows stderr to the agent.
#
# Blocked:
#   - discarding work:   git reset --hard, git clean -f, git branch -D, git checkout/restore .
#   - bypassing checks:  --no-verify, --no-gpg-sign, git -c core.hooksPath=...
#   - landing unreviewed: a push whose destination is the default branch, and a
#                         force-push without an explicit refspec
#
# Inspired by the "git-guardrails-claude-code" skill in
# https://github.com/mattpocock/skills (MIT), which blocks a fixed list of patterns;
# this version adds command-boundary matching, normalization and push analysis.

DEFAULT_BRANCH="${DEFAULT_BRANCH:-main}"

if ! command -v jq >/dev/null 2>&1; then
  echo "block-dangerous-git.sh needs jq to read the tool call; install jq." >&2
  exit 2
fi
COMMAND=$(jq -r '.tool_input.command // empty')
[ -z "$COMMAND" ] && exit 0

block() {
  echo "BLOCKED by .claude/hooks/block-dangerous-git.sh: \`$1\`" >&2
  echo "Ask the developer to run it themselves if it is really needed." >&2
  exit 2
}

# Disabling hooks through config is a bypass, whatever follows.
printf '%s' "$COMMAND" | grep -qiE 'git[^;&|]*-c[[:space:]]*core\.hookspath' && block "$COMMAND"

# Normalize so `bash -c "git push"` and `git -C ../repo --no-pager push` match like
# `git push`.
SQ="'"
NORMALIZED=$(printf '%s' "$COMMAND" | sed -E \
  -e "s/(^|[^[:alnum:]_])(bash|sh|zsh)[[:space:]]+-c[[:space:]]+[\"$SQ]/\1; /g" \
  -e ':a' \
  -e "s/(^|[^[:alnum:]_])git[[:space:]]+(-[Cc][[:space:]]+(\"[^\"]*\"|$SQ[^$SQ]*$SQ|[^[:space:]]+)|--no-pager|-P|--paginate)/\1git/g" \
  -e 'ta')

# A command starts at line start or after ; & | ( ` $( — optionally behind wrappers
# and VAR=value prefixes — so `grep "git push" docs/` and `echo "git push"` do not match.
START="(^|[;&|(\`]|\\\$\\()[[:space:]]*((sudo|env|command|time|nohup|exec|xargs)[[:space:]]+|[[:alnum:]_]+=[^[:space:]]*[[:space:]]+)*"

PATTERNS=(
  "${START}git[[:space:]]+reset[[:space:]]+--hard"
  "${START}git[[:space:]]+clean[^;&|]*([[:space:]]-[[:alpha:]]*f|[[:space:]]--force)"
  "${START}git[[:space:]]+branch[[:space:]]+(-D|--delete[[:space:]]+--force)"
  "${START}git[[:space:]]+(checkout|restore)[[:space:]]+(--[[:space:]]+)?\.([^[:alnum:]_/.-]|$)"
  "${START}git[[:space:]][^;&|]*--(no-verify|no-gpg-sign)"
)

# Returns 1 for a push that lands on the default branch or force-pushes without an
# explicit refspec (it would rewrite whatever branch is checked out).
check_push() {
  local tok force=0 n=0 dst
  local -a toks
  read -ra toks <<< "${1#*push}"
  for tok in "${toks[@]}"; do
    tok="${tok//\"/}"; tok="${tok//$SQ/}"
    case "$tok" in
      --force|--force-with-lease*|--force-if-includes) force=1 ;;
      --*) ;;
      -*) case "$tok" in -*f*) force=1 ;; esac ;;
      *)
        n=$((n+1))
        [ "$n" -eq 1 ] && continue                 # the remote
        case "$tok" in +*) force=1; tok="${tok#+}" ;; esac
        dst="${tok##*:}"; dst="${dst#refs/heads/}"
        [ "$dst" = "$DEFAULT_BRANCH" ] && return 1 ;;
    esac
  done
  [ "$force" = 1 ] && [ "$n" -le 1 ] && return 1
  # A bare `git push` while on the default branch pushes straight to it.
  [ "$n" -eq 0 ] && [ "$(git branch --show-current 2>/dev/null)" = "$DEFAULT_BRANCH" ] && return 1
  return 0
}

while IFS= read -r line; do
  for pattern in "${PATTERNS[@]}"; do
    printf '%s' "$line" | grep -qE -- "$pattern" && block "$line"
  done
  while IFS= read -r seg; do
    [ -n "$seg" ] && { check_push "$seg" || block "$line"; }
  done < <(printf '%s' "$line" | grep -oE -- "${START}git[[:space:]]+push([[:space:]][^;&|\`)]*)?" || true)
done <<< "$NORMALIZED"

exit 0
