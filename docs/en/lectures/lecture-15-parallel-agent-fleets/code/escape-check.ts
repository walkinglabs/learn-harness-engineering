/**
 * escape-check.ts
 *
 * Deterministic containment check for agents running in git worktrees.
 * Snapshot the MAIN checkout before a session, snapshot it again after,
 * and report any change the harness did not make. A worktree isolates
 * working files and the index; refs, the stash, config, and everything
 * outside the worktree directory are still reachable by the agent.
 *
 * Run:
 *   npx tsx docs/en/lectures/lecture-15-parallel-agent-fleets/code/escape-check.ts demo
 *   npx tsx .../escape-check.ts snapshot <main-checkout> > before.json
 *   npx tsx .../escape-check.ts compare  <main-checkout> before.json
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Snapshot
// ---------------------------------------------------------------------------

interface CheckoutSnapshot {
  branch: string; // current branch (or "(detached)")
  head: string; // HEAD commit
  statusHash: string; // hash of `git status --porcelain` (tracked + untracked edits)
  statusLines: string[]; // kept for a readable diff
  stashCount: number; // the stash is shared across all worktrees
  takenAt: string;
}

function git(repo: string, args: string[]): string {
  return execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }).trim();
}

export function snapshot(repo: string): CheckoutSnapshot {
  const status = git(repo, ["status", "--porcelain=v1", "--untracked-files=all"]);
  const statusLines = status ? status.split("\n").sort() : [];
  let branch = "(detached)";
  try {
    branch = git(repo, ["symbolic-ref", "--short", "HEAD"]);
  } catch {
    // detached HEAD
  }
  const stash = git(repo, ["stash", "list"]);
  return {
    branch,
    head: git(repo, ["rev-parse", "HEAD"]),
    statusHash: createHash("sha256").update(statusLines.join("\n")).digest("hex"),
    statusLines,
    stashCount: stash ? stash.split("\n").length : 0,
    takenAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Compare
// ---------------------------------------------------------------------------

export interface Breach {
  kind: "branch-switched" | "head-moved" | "working-tree-changed" | "stash-changed";
  detail: string;
}

export function compare(before: CheckoutSnapshot, after: CheckoutSnapshot): Breach[] {
  const breaches: Breach[] = [];
  if (before.branch !== after.branch) {
    breaches.push({ kind: "branch-switched", detail: `${before.branch} -> ${after.branch}` });
  }
  if (before.head !== after.head) {
    breaches.push({ kind: "head-moved", detail: `${before.head.slice(0, 8)} -> ${after.head.slice(0, 8)}` });
  }
  if (before.statusHash !== after.statusHash) {
    const was = new Set(before.statusLines);
    const now = new Set(after.statusLines);
    const added = after.statusLines.filter((l) => !was.has(l));
    const removed = before.statusLines.filter((l) => !now.has(l));
    breaches.push({
      kind: "working-tree-changed",
      detail: [...added.map((l) => `+ ${l}`), ...removed.map((l) => `- ${l}`)].join("; "),
    });
  }
  if (before.stashCount !== after.stashCount) {
    breaches.push({ kind: "stash-changed", detail: `${before.stashCount} -> ${after.stashCount} entries` });
  }
  return breaches;
}

// ---------------------------------------------------------------------------
// Demo: a session that "works in a worktree" but escapes via an absolute path
// ---------------------------------------------------------------------------

function demo(): void {
  const root = mkdtempSync(join(tmpdir(), "escape-check-"));
  const main = join(root, "main");
  const worktree = join(root, "wt-session-a");
  try {
    execFileSync("git", ["init", "-q", "-b", "main", main]);
    git(main, ["config", "user.email", "demo@example.com"]);
    git(main, ["config", "user.name", "demo"]);
    writeFileSync(join(main, "README.md"), "# demo\n");
    git(main, ["add", "."]);
    git(main, ["commit", "-q", "-m", "init"]);
    git(main, ["worktree", "add", "-q", "-b", "session-a", worktree]);

    const before = snapshot(main);

    // Legitimate work inside the worktree: never shows up in the main checkout.
    writeFileSync(join(worktree, "feature.ts"), "export const ok = true;\n");
    git(worktree, ["add", "."]);
    git(worktree, ["commit", "-q", "-m", "feature"]);

    // The escape: an absolute path back into the main checkout, plus a branch switch.
    writeFileSync(join(main, "README.md"), "# demo\n\nEdited from the wrong directory.\n");
    git(main, ["checkout", "-q", "-b", "fix-login"]);

    const breaches = compare(before, snapshot(main));
    console.log("Worktree commit landed on its own branch: OK");
    console.log(breaches.length === 0 ? "No breach detected." : "Containment breach detected:");
    for (const b of breaches) console.log(`  [${b.kind}] ${b.detail}`);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const [cmd, repo, file] = process.argv.slice(2);
if (cmd === "snapshot" && repo) {
  console.log(JSON.stringify(snapshot(repo), null, 2));
} else if (cmd === "compare" && repo && file) {
  const breaches = compare(JSON.parse(readFileSync(file, "utf8")), snapshot(repo));
  for (const b of breaches) console.log(`[${b.kind}] ${b.detail}`);
  process.exitCode = breaches.length === 0 ? 0 : 1;
} else {
  demo();
}
