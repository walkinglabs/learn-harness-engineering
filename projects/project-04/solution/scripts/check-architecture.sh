#!/usr/bin/env bash
set -euo pipefail

if grep -R "from 'fs'\\|from \"fs\"\\|from 'path'\\|from \"path\"" src/renderer >/dev/null 2>&1; then
  echo "Renderer imports Node core modules"
  exit 1
fi

if grep -R "from 'electron'\\|from \"electron\"\\|from 'react'\\|from \"react\"" src/services >/dev/null 2>&1; then
  echo "Services import Electron or React"
  exit 1
fi

echo "architecture ok"
