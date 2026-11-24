/**
 * init-check.ts
 *
 * Programmatically checks initialization prerequisites:
 *   - Node.js version
 *   - Dependencies installed (node_modules exists)
 *   - Data directory exists
 *   - Config files present
 *
 * Simulates running with and without an explicit init phase,
 * showing how missing prerequisites cause silent failures later.
 *
 * Run: npx tsx docs/lectures/lecture-06-why-initialization-needs-its-own-phase/code/init-check.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as childProcess from "node:child_process";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CheckItem {
  name: string;
  category: string;
  check: () => { pass: boolean; detail: string };
  impactIfMissing: string;
}

interface CheckResult {
  name: string;
  category: string;
  passed: boolean;
  detail: string;
  impactIfMissing: string;
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

function createChecks(targetDir: string): CheckItem[] {
  return [
    {
      name: "Node.js version >= 18",
      category: "Runtime",
      check: () => {
        try {
          const version = process.version; // e.g. "v20.11.0"
          const major = parseInt(version.replace("v", "").split(".")[0], 10);
          return {
            pass: major >= 18,
            detail: `Detected: ${version} (need >= v18)`,
          };
        } catch {
          return { pass: false, detail: "Could not detect Node.js version" };
        }
      },
      impactIfMissing: "TypeScript features and built-in APIs unavailable",
    },
    {
      name: "package.json exists",
      category: "Config",
      check: () => {
        const p = path.join(targetDir, "package.json");
        const exists = fs.existsSync(p);
        return {
          pass: exists,
          detail: exists ? `Found: ${p}` : "Not found in target directory",
        };
      },
      impactIfMissing: "Cannot install dependencies or run scripts",
    },
    {
      name: "Dependencies installed (node_modules)",
      category: "Dependencies",
      check: () => {
        const p = path.join(targetDir, "node_modules");
        const exists = fs.existsSync(p);
        return {
          pass: exists,
          detail: exists ? `Found: ${p}` : "node_modules/ not found -- run npm install",
        };
      },
      impactIfMissing: "All imports fail at runtime",
    },
    {
      name: "TypeScript available",
      category: "Toolchain",
      check: () => {
        try {
          const result = childProcess.execSync("npx tsc --version", {
            encoding: "utf-8",
            timeout: 10000,
            stdio: ["pipe", "pipe", "pipe"],
          }).trim();
          return { pass: true, detail: `Detected: ${result}` };
        } catch {
          return { pass: false, detail: "TypeScript not available via npx" };
        }
      },
      impactIfMissing: "Cannot compile TypeScript files",
    },
    {
      name: "tsconfig.json exists",
      category: "Config",
      check: () => {
        const p = path.join(targetDir, "tsconfig.json");
        const exists = fs.existsSync(p);
        return {
          pass: exists,
          detail: exists ? `Found: ${p}` : "Not found",
        };
      },
      impactIfMissing: "TypeScript compiler uses defaults, may not match project needs",
    },
    {
      name: "Source directory exists",
      category: "Structure",
      check: () => {
        const candidates = ["src", "lib", "app"];
        const found = candidates.filter((d) => {
          const p = path.join(targetDir, d);
          return fs.existsSync(p) && fs.statSync(p).isDirectory();
        });
        return {
          pass: found.length > 0,
          detail: found.length > 0 ? `Found: ${found.join(", ")}` : "No src/ lib/ or app/ directory found",
        };
      },
      impactIfMissing: "Agent cannot locate source files to modify",
    },
    {
      name: "Test directory exists",
      category: "Structure",
      check: () => {
        const candidates = ["test", "tests", "__tests__", "spec"];
        const found = candidates.filter((d) => {
          const p = path.join(targetDir, d);
          return fs.existsSync(p) && fs.statSync(p).isDirectory();
        });
        return {
          pass: found.length > 0,
          detail: found.length > 0 ? `Found: ${found.join(", ")}` : "No test directory found",
        };
      },
      impactIfMissing: "Agent cannot find or run existing tests",
    },
    {
      name: "Git repository initialized",
      category: "Version Control",
      check: () => {
        const gitDir = path.join(targetDir, ".git");
        const exists = fs.existsSync(gitDir);
        return {
          pass: exists,
          detail: exists ? "Git repository detected" : "No .git directory found",
        };
      },
      impactIfMissing: "No rollback capability, no change history",
    },
  ];
}

// ---------------------------------------------------------------------------
// Simulation: with and without init phase
// ---------------------------------------------------------------------------

interface SimResult {
  scenario: string;
  checksRun: boolean;
  failuresBeforeWork: number;
  workAttempted: boolean;
  workSucceeded: boolean;
  timeWastedMs: number;
}

function simulateWithoutInit(): SimResult {
  // Agent skips init, goes straight to work.
  // Encounters failures one at a time as it hits missing prerequisites.
  const checks = createChecks(process.cwd());
  let failures = 0;
  let timeWasted = 0;

  for (const check of checks) {
    const result = check.check();
    if (!result.pass) {
      failures++;
      timeWasted += 200; // Agent spends time discovering each missing piece
    }
  }

  return {
    scenario: "NO INIT PHASE",
    checksRun: false,
    failuresBeforeWork: 0, // Didn't check upfront
    workAttempted: true,
    workSucceeded: failures === 0,
    timeWastedMs: timeWasted,
  };
}

function simulateWithInit(): SimResult {
  // Agent runs init phase first, discovers all issues upfront.
  const checks = createChecks(process.cwd());
  let failures = 0;

  for (const check of checks) {
    if (!check.check().pass) {
      failures++;
    }
  }

  return {
    scenario: "WITH INIT PHASE",
    checksRun: true,
    failuresBeforeWork: failures,
    workAttempted: failures === 0,
    workSucceeded: failures === 0,
    timeWastedMs: 0,
  };
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function run(): void {
  const targetDir = process.cwd();
  console.log("\n" + "=".repeat(80));
  console.log("  INITIALIZATION PREREQUISITE CHECK");
  console.log("=".repeat(80));
  console.log(`  Target: ${targetDir}\n`);

  const checks = createChecks(targetDir);
  const results: CheckResult[] = checks.map((c) => {
    const r = c.check();
    return {
      name: c.name,
      category: c.category,
      passed: r.pass,
      detail: r.detail,
      impactIfMissing: c.impactIfMissing,
    };
  });

  // Detailed report
  const header = `| ${pad("Check", 35)}| ${pad("Category", 12)}| ${pad("Status", 6)}| Detail`;
  const sep = `|${"-".repeat(37)}|${"-".repeat(14)}|${"-".repeat(8)}|${"-".repeat(40)}`;
  console.log(header);
  console.log(sep);

  for (const r of results) {
    const status = r.passed ? "PASS" : "FAIL";
    console.log(`| ${pad(r.name, 35)}| ${pad(r.category, 12)}| ${pad(status, 6)}| ${r.detail}`);
  }

  const passCount = results.filter((r) => r.passed).length;
  const failCount = results.filter((r) => !r.passed).length;

  console.log("\n" + "-".repeat(80));
  console.log(`  Results: ${passCount} passed, ${failCount} failed out of ${results.length} checks`);

  if (failCount > 0) {
    console.log("\n  FAILED CHECKS -- Impact if not resolved:");
    for (const r of results.filter((r) => !r.passed)) {
      console.log(`    - ${r.name}: ${r.impactIfMissing}`);
    }
  }

  // Comparison: with vs without init
  const noInit = simulateWithoutInit();
  const withInit = simulateWithInit();

  console.log("\n" + "=".repeat(80));
  console.log("  INIT PHASE COMPARISON");
  console.log("=".repeat(80) + "\n");

  const cHeader = `| ${pad("Metric", 35)}| ${pad("No Init Phase", 18)}| ${pad("With Init Phase", 18)}|`;
  const cSep = `|${"-".repeat(37)}|${"-".repeat(20)}|${"-".repeat(20)}|`;
  console.log(cHeader);
  console.log(cSep);
  console.log(`| ${pad("Prerequisites checked upfront", 35)}| ${pad("No", 18)}| ${pad("Yes", 18)}|`);
  console.log(`| ${pad("Work attempted despite issues", 35)}| ${pad(String(noInit.workAttempted), 18)}| ${pad(String(withInit.workAttempted), 18)}|`);
  console.log(`| ${pad("Time wasted discovering issues late", 35)}| ${pad(noInit.timeWastedMs + "ms", 18)}| ${pad(withInit.timeWastedMs + "ms", 18)}|`);
  console.log(`| ${pad("Work succeeded", 35)}| ${pad(String(noInit.workSucceeded), 18)}| ${pad(String(withInit.workSucceeded), 18)}|`);

  console.log("\n  An explicit init phase catches problems before they waste time.\n");
}

run();
