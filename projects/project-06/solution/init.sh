#!/usr/bin/env bash
# init.sh -- Verify the project builds and its tests pass before starting work.
# Run this after cloning or when resuming work. Any failing step stops the
# script with a non-zero exit code.
set -euo pipefail

echo "=== Project 06 Capstone Init ==="
echo ""

echo "[1/7] Installing dependencies..."
npm install
echo ""

echo "[2/7] Running type checks (app + tests)..."
npm run check
echo ""

echo "[3/7] Running unit test suite..."
npm test
echo ""

echo "[4/7] Building project..."
npm run build
echo ""

echo "[5/7] Running end-to-end tests in a real Electron window..."
# Linux without a display (CI, containers) needs a virtual one.
if [ "$(uname)" = "Linux" ] && [ -z "${DISPLAY:-}" ] && command -v xvfb-run >/dev/null 2>&1; then
  xvfb-run -a npm run test:e2e
else
  npm run test:e2e
fi
echo ""

echo "[6/7] Verifying harness files..."
FILES_OK=true
for file in AGENTS.md CLAUDE.md feature_list.json clean-state-checklist.md session-handoff.md evaluator-rubric.md quality-document.md vitest.config.ts vitest.e2e.config.ts; do
  if [ ! -f "$file" ]; then
    echo "  MISSING: $file"
    FILES_OK=false
  else
    echo "  OK: $file"
  fi
done

for doc in docs/ARCHITECTURE.md docs/PRODUCT.md docs/RELIABILITY.md; do
  if [ ! -f "$doc" ]; then
    echo "  MISSING: $doc"
    FILES_OK=false
  else
    echo "  OK: $doc"
  fi
done

for script in scripts/benchmark.sh scripts/cleanup-scanner.sh scripts/dev.js; do
  if [ ! -f "$script" ]; then
    echo "  MISSING: $script"
    FILES_OK=false
  else
    echo "  OK: $script"
  fi
done
echo ""

echo "[7/7] Verifying sample data..."
for sample in data/sample-documents/design-notes.md data/sample-documents/meeting-summary.txt data/sample-documents/retrieval-plan.md; do
  if [ ! -f "$sample" ]; then
    echo "  MISSING: $sample"
    FILES_OK=false
  else
    echo "  OK: $sample ($(wc -c < "$sample" | tr -d ' ') bytes)"
  fi
done
echo ""

if [ "$FILES_OK" = true ]; then
  echo "=== Init complete. Type checks, unit tests, build and end-to-end tests passed. ==="
  echo "Run 'npm run dev' to launch the application."
  echo "Run 'bash scripts/benchmark.sh' to run performance benchmarks."
  echo "Run 'bash scripts/cleanup-scanner.sh' to check for stale artifacts."
else
  echo "=== Init failed. Some harness files are missing. ==="
  exit 1
fi
