#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# 按你的项目实际情况替换这些命令。
INSTALL_CMD=(npm install)
VERIFY_CMD=(npm test)
START_CMD=(npm run dev)

echo "==> 当前目录: $PWD"
echo "==> 同步依赖"
"${INSTALL_CMD[@]}"

echo "==> 运行基础验证"
"${VERIFY_CMD[@]}"

echo "==> 启动命令"
printf '    %q' "${START_CMD[@]}"
printf '\n'

if [ "${RUN_START_COMMAND:-0}" = "1" ]; then
  echo "==> 启动应用"
  exec "${START_CMD[@]}"
fi

echo "如果希望 init.sh 直接启动应用，请设置 RUN_START_COMMAND=1。"
