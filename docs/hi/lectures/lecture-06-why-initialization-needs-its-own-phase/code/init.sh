#!/usr/bin/env bash
set -euo pipefail

echo "[init] installing dependencies"
npm install

echo "[init] starting the docs site is optional"
echo "[init] use npm run docs:dev for course docs"

echo "[init] project-specific startup would go here"
