#!/usr/bin/env bash
set -eo pipefail

REPO="${1:-.}"

FL_PATH=""
for candidate in "$REPO/feature_list.json" "$REPO/features.json"; do
  if [[ -f "$candidate" ]]; then
    FL_PATH="$candidate"
    break
  fi
done

if [[ -z "$FL_PATH" ]]; then
  echo "Error: No feature_list.json or features.json found in $REPO"
  exit 1
fi

python3 - "$FL_PATH" << 'PYEOF'
import json, sys

fl_file = sys.argv[1]
try:
    with open(fl_file) as f:
        d = json.load(f)
except Exception as e:
    print(f"Error reading {fl_file}: {e}")
    sys.exit(1)

feats = d.get("features", [])
passing = [f for f in feats if f.get("state") == "passing"]
active = [f for f in feats if f.get("state") == "active"]
planned = [f for f in feats if f.get("state") in ("planned", "not_started")]

GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"
BOLD = "\033[1m"

print("\n" + BOLD + "=========================== TASK STATUS ===========================" + RESET)
print(f"Developed (Passing): {GREEN}{len(passing)}{RESET} | In Progress: {YELLOW}{len(active)}{RESET} | Left (Planned): {BLUE}{len(planned)}{RESET} | Total: {len(feats)}")
print("-" * 67)
print(f"{BOLD}{'ID':<10} {'STATUS':<14} {'TITLE'}{RESET}")
print("-" * 67)

for f in feats:
    fid = f.get("id", "")
    title = f.get("title", "")
    st = f.get("state", "")
    if st == "passing":
        badge = f"{GREEN}[DONE]{RESET}"
    elif st == "active":
        badge = f"{YELLOW}[ACTIVE]{RESET}"
    else:
        badge = f"{BLUE}[TODO]{RESET}"
    print(f"{fid:<10} {badge:<23} {title}")

print(BOLD + "===================================================================" + RESET + "\n")
PYEOF
