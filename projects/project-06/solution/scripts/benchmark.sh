#!/usr/bin/env bash
set -euo pipefail

echo "benchmark: parser fixtures"
test "$(find fixtures/interviews -name '*.transcript' | wc -l | tr -d ' ')" -ge 5

echo "benchmark: service tests"
npm run test -- --run src/services/analysis-pipeline.test.ts src/services/transcript-parser.test.ts src/services/safety-boundary-checker.test.ts

echo "benchmark: evidence coverage and safety checks covered by tests"
