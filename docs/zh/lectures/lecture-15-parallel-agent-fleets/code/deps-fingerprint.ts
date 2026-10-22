/**
 * deps-fingerprint.ts
 *
 * Keep SHARED environments (main checkout, long-running dev server) in sync
 * with dependency changes that arrive through merged agent branches.
 * Hash the dependency manifests + lockfiles; reinstall only when the hash
 * differs from the last successful install. On failure, keep the old
 * install so the environment still starts — the next restart retries.
 *
 * Run:
 *   npx tsx docs/zh/lectures/lecture-15-parallel-agent-fleets/code/deps-fingerprint.ts demo
 *   npx tsx .../deps-fingerprint.ts <project-dir> "npm ci"
 */

import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const INPUTS = [
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "Cargo.toml",
  "Cargo.lock",
  "pyproject.toml",
  "uv.lock",
  "poetry.lock",
];
const STAMP = ".harness/deps-fingerprint";

export function fingerprint(dir: string): string {
  const hash = createHash("sha256");
  for (const name of INPUTS) {
    const path = join(dir, name);
    if (existsSync(path)) hash.update(name).update("\0").update(readFileSync(path));
  }
  return hash.digest("hex");
}

export type SyncResult = "unchanged" | "installed" | "install-failed";

export function syncDeps(dir: string, installCommand: string, run = defaultRun): SyncResult {
  const stampPath = join(dir, STAMP);
  const current = fingerprint(dir);
  const recorded = existsSync(stampPath) ? readFileSync(stampPath, "utf8").trim() : "";
  if (recorded === current) return "unchanged";
  try {
    run(installCommand, dir);
  } catch {
    // Don't take the environment down: start with the old dependencies and retry next time.
    return "install-failed";
  }
  mkdirSync(join(dir, ".harness"), { recursive: true });
  writeFileSync(stampPath, current + "\n");
  return "installed";
}

function defaultRun(command: string, cwd: string): void {
  execSync(command, { cwd, stdio: "inherit" });
}

// ---------------------------------------------------------------------------
// Demo: a merged branch adds a dependency to a shared environment
// ---------------------------------------------------------------------------

function demo(): void {
  const dir = mkdtempSync(join(tmpdir(), "deps-fingerprint-"));
  const installs: string[] = [];
  const fakeInstall = (command: string) => void installs.push(command);
  try {
    writeFileSync(join(dir, "package.json"), JSON.stringify({ dependencies: { react: "^19" } }));
    console.log("first start:            ", syncDeps(dir, "npm ci", fakeInstall));
    console.log("restart, nothing merged:", syncDeps(dir, "npm ci", fakeInstall));

    // An agent's branch adds a Markdown renderer and gets merged.
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ dependencies: { react: "^19", "markdown-it": "^14" } }),
    );
    console.log("restart after merge:    ", syncDeps(dir, "npm ci", fakeInstall));
    console.log("restart again:          ", syncDeps(dir, "npm ci", fakeInstall));
    console.log(`installs run: ${installs.length} (expected 2)`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const [dirArg, commandArg] = process.argv.slice(2);
if (dirArg && dirArg !== "demo") {
  console.log(syncDeps(dirArg, commandArg ?? "npm ci"));
} else {
  demo();
}
