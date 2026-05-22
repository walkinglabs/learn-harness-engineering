#!/usr/bin/env bash
set -euo pipefail

npm run test -- --run src/services/analysis-pipeline.test.ts src/services/transcript-parser.test.ts src/services/safety-boundary-checker.test.ts
