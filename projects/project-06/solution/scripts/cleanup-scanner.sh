#!/usr/bin/env bash
set -euo pipefail

pattern="knowledge""-base|personal knowledge|document import|document list|document detail|indexing service|grounded Q""&A|qa panel"

if grep -R -i -E "$pattern" README.md AGENTS.md CLAUDE.md docs src fixtures feature_list.json quality-document.md session-handoff.md >/tmp/interview-cleanup-scan.txt 2>/dev/null; then
  cat /tmp/interview-cleanup-scan.txt
  echo "cleanup scanner found forbidden or stale terms"
  exit 1
fi

echo "cleanup scanner ok"
