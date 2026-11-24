/**
 * cleanup-scanner.ts
 *
 * Scans a project directory for stale artifacts, dead code, structural
 * violations, and outputs a cleanup report. Helps enforce the "clean state
 * at end of every session" principle.
 *
 * Usage:
 *   npx tsx docs/lectures/lecture-12.../code/cleanup-scanner.ts [path]
 *   (defaults to current working directory)
 *
 * Run: npx tsx docs/lectures/lecture-12-why-every-session-must-leave-a-clean-state/code/cleanup-scanner.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ScanResult {
  category: string;
  check: string;
  severity: "critical" | "warning" | "info";
  found: string[];
  description: string;
}

// ---------------------------------------------------------------------------
// Scanner checks
// ---------------------------------------------------------------------------

interface ScannerCheck {
  category: string;
  name: string;
  severity: "critical" | "warning" | "info";
  description: string;
  scan: (dir: string) => string[];
}

function createChecks(): ScannerCheck[] {
  return [
    {
      category: "Stale Artifacts",
      name: "Temporary files (*.tmp, *.bak, *.swp)",
      severity: "warning",
      description: "Leftover temp files from editing or processing",
      scan: (dir) => findFiles(dir, [".tmp", ".bak", ".swp", "~"]),
    },
    {
      category: "Stale Artifacts",
      name: "Debug/log files in source",
      severity: "warning",
      description: "Log files that should not be in the source tree",
      scan: (dir) => {
        const found: string[] = [];
        const logPatterns = [".log"];
        for (const p of findFiles(dir, logPatterns)) {
          // Only flag log files in source directories
          if (p.includes("/src/") || p.includes("/lib/") || p.includes("/app/")) {
            found.push(p);
          }
        }
        return found;
      },
    },
    {
      category: "Dead Code",
      name: "Unused imports (placeholder detection)",
      severity: "info",
      description: "Files that may contain unused code (heuristic scan)",
      scan: (dir) => {
        const found: string[] = [];
        const srcDirs = ["src", "lib", "app"];
        for (const srcDir of srcDirs) {
          const srcPath = path.join(dir, srcDir);
          if (fs.existsSync(srcPath)) {
            scanForPatterns(srcPath, ["TODO:", "FIXME:", "HACK:", "XXX:"], found, dir);
          }
        }
        return found;
      },
    },
    {
      category: "Structural Violations",
      name: "Missing .gitignore",
      severity: "warning",
      description: "No .gitignore file found -- risk of committing build artifacts",
      scan: (dir) => fs.existsSync(path.join(dir, ".gitignore")) ? [] : [".gitignore (MISSING)"],
    },
    {
      category: "Structural Violations",
      name: "Build artifacts in source",
      severity: "critical",
      description: "Compiled output (dist/, build/) mixed with source",
      scan: (dir) => {
        const found: string[] = [];
        // Check if dist/ or build/ exists inside src/
        const dirs = ["src/dist", "src/build", "lib/dist", "lib/build"];
        for (const d of dirs) {
          if (fs.existsSync(path.join(dir, d))) {
            found.push(d + "/");
          }
        }
        return found;
      },
    },
    {
      category: "Structural Violations",
      name: "node_modules in source tree",
      severity: "critical",
      description: "node_modules directory found outside root (nested dependency)",
      scan: (dir) => {
        const found: string[] = [];
        const srcDirs = ["src", "lib", "app", "test", "tests"];
        for (const srcDir of srcDirs) {
          const nmPath = path.join(dir, srcDir, "node_modules");
          if (fs.existsSync(nmPath)) {
            found.push(srcDir + "/node_modules/");
          }
        }
        return found;
      },
    },
    {
      category: "Session Cleanliness",
      name: "Uncommitted changes indicator",
      severity: "info",
      description: "Checks for common artifacts of incomplete sessions",
      scan: (dir) => {
        const found: string[] = [];
        const indicators = [
          "WIP.md", "IN_PROGRESS.md", "scratch.ts", "scratch.js",
          "debug.ts", "test-manual.ts", "temp.ts",
        ];
        for (const f of indicators) {
          if (fs.existsSync(path.join(dir, f))) {
            found.push(f);
          }
        }
        return found;
      },
    },
    {
      category: "Session Cleanliness",
      name: "Empty directories",
      severity: "info",
      description: "Empty directories that may be leftover from incomplete work",
      scan: (dir) => {
        const found: string[] = [];
        const commonDirs = ["src", "lib", "app", "test", "tests", "docs"];
        for (const d of commonDirs) {
          const dp = path.join(dir, d);
          if (fs.existsSync(dp) && fs.statSync(dp).isDirectory()) {
            try {
              const contents = fs.readdirSync(dp);
              if (contents.length === 0) {
                found.push(d + "/");
              }
            } catch {
              // Skip directories we can't read
            }
          }
        }
        return found;
      },
    },
    {
      category: "Configuration",
      name: "Environment files in source",
      severity: "critical",
      description: ".env files that may contain secrets",
      scan: (dir) => {
        const found: string[] = [];
        const envFiles = [".env", ".env.local", ".env.production", ".env.staging"];
        for (const f of envFiles) {
          if (fs.existsSync(path.join(dir, f))) {
            found.push(f);
          }
        }
        return found;
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function findFiles(dir: string, extensions: string[]): string[] {
  const found: string[] = [];

  function walk(current: string, depth: number): void {
    if (depth > 4) return; // Limit recursion depth
    try {
      const entries = fs.readdirSync(current, { withFileTypes: true });
      for (const entry of entries) {
        // Skip common non-source directories
        if (entry.isDirectory() && ["node_modules", ".git", "dist", "build", ".next", "coverage"].includes(entry.name)) {
          continue;
        }

        const fullPath = path.join(current, entry.name);
        const relativePath = path.relative(dir, fullPath);

        if (entry.isDirectory()) {
          walk(fullPath, depth + 1);
        } else if (entry.isFile()) {
          if (extensions.some((ext) => entry.name.endsWith(ext))) {
            found.push(relativePath);
          }
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  walk(dir, 0);
  return found;
}

function scanForPatterns(dir: string, patterns: string[], results: string[], baseDir: string): void {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!["node_modules", ".git", "dist", "build"].includes(entry.name)) {
          scanForPatterns(path.join(dir, entry.name), patterns, results, baseDir);
        }
        continue;
      }

      const fullPath = path.join(dir, entry.name);
      if (!entry.name.endsWith(".ts") && !entry.name.endsWith(".tsx") && !entry.name.endsWith(".js")) {
        continue;
      }

      try {
        const content = fs.readFileSync(fullPath, "utf-8");
        const lines = content.split("\n");
        for (let i = 0; i < Math.min(lines.length, 50); i++) {
          for (const pattern of patterns) {
            if (lines[i].includes(pattern)) {
              const relative = path.relative(baseDir, fullPath);
              results.push(`${relative}:${i + 1} contains ${pattern}`);
            }
          }
        }
      } catch {
        // Skip files we can't read
      }
    }
  } catch {
    // Skip directories we can't read
  }
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function run(): void {
  const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

  console.log("\n" + "=".repeat(90));
  console.log("  CLEANUP SCANNER -- Stale Artifact & Violation Report");
  console.log("=".repeat(90));
  console.log(`  Scanning: ${targetDir}\n`);

  const checks = createChecks();
  const results: ScanResult[] = [];

  for (const check of checks) {
    const found = check.scan(targetDir);
    results.push({
      category: check.category,
      check: check.name,
      severity: check.severity,
      found,
      description: check.description,
    });
  }

  // Report
  const header = `| ${pad("Category", 20)}| ${pad("Check", 40)}| ${pad("Severity", 10)}| ${pad("Count", 6)}| Details`;
  const sep = `|${"-".repeat(22)}|${"-".repeat(42)}|${"-".repeat(12)}|${"-".repeat(8)}|${"-".repeat(30)}`;
  console.log(header);
  console.log(sep);

  for (const r of results) {
    const count = r.found.length;
    const detail = count > 0 ? r.found.slice(0, 2).join(", ") : "(clean)";
    const marker = count > 0 && r.severity === "critical" ? ">>" : count > 0 ? " * " : "  ";

    console.log(`${marker}| ${pad(r.category, 20)}| ${pad(r.check, 40)}| ${pad(r.severity, 10)}| ${pad(String(count), 6)}| ${detail}`);
  }

  // Summary
  const criticals = results.filter((r) => r.severity === "critical" && r.found.length > 0);
  const warnings = results.filter((r) => r.severity === "warning" && r.found.length > 0);
  const infos = results.filter((r) => r.severity === "info" && r.found.length > 0);
  const clean = results.filter((r) => r.found.length === 0);

  console.log("\n" + "=".repeat(90));
  console.log("  CLEANUP SUMMARY");
  console.log("=".repeat(90) + "\n");

  console.log(`  Critical issues:    ${criticals.length}`);
  console.log(`  Warnings:           ${warnings.length}`);
  console.log(`  Info items:         ${infos.length}`);
  console.log(`  Clean checks:       ${clean.length}/${results.length}`);

  if (criticals.length > 0) {
    console.log("\n  ACTION REQUIRED (Critical):");
    for (const c of criticals) {
      console.log(`    - ${c.check}: ${c.found.length} item(s) found`);
      console.log(`      ${c.description}`);
    }
  }

  const totalIssues = results.reduce((s, r) => s + r.found.length, 0);
  if (totalIssues === 0) {
    console.log("\n  Project is in a clean state. No issues found.\n");
  } else {
    console.log(`\n  Total issues found: ${totalIssues}. Run this scanner at the end of every session to maintain clean state.\n`);
  }
}

run();
