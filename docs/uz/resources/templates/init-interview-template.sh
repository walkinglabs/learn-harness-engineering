#!/usr/bin/env bash
set -euo pipefail

echo "== AI Interview Debrief Coach initialization =="
pwd

echo "== Installing dependencies =="
npm install

echo "== Type checking =="
npm run check

echo "== Unit and fixture tests =="
npm test

echo "== Optional build =="
npm run build

echo "== Ready =="

