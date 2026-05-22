#!/usr/bin/env bash
set -euo pipefail

echo "=== Project 06 Interview Debrief Harness Init ==="

echo "[1/6] Installing dependencies..."
npm install

echo "[2/6] Type check..."
npm run check

echo "[3/6] Tests..."
npm run test

echo "[4/6] Build..."
npm run build

echo "[5/6] Harness files..."
for file in AGENTS.md CLAUDE.md feature_list.json clean-state-checklist.md session-handoff.md evaluator-rubric.md quality-document.md; do
  test -f "$file"
done
for doc in docs/ARCHITECTURE.md docs/PRODUCT.md docs/DATA_MODEL.md docs/INTERVIEW_ANALYSIS_MODEL.md docs/SAFETY_BOUNDARIES.md docs/RELIABILITY.md; do
  test -f "$doc"
done
for script in scripts/benchmark.sh scripts/cleanup-scanner.sh scripts/check-architecture.sh scripts/run-fixture-analysis.sh; do
  test -f "$script"
done

echo "[6/6] Transcript fixtures..."
for fixture in fixtures/interviews/*.transcript; do
  test -s "$fixture"
done

echo "=== Init complete ==="
