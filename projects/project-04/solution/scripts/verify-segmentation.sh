#!/usr/bin/env bash
set -euo pipefail

npm run test -- --run src/services/analysis-pipeline.test.ts
