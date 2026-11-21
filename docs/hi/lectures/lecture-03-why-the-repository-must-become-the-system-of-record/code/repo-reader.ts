/**
 * repo-reader.ts
 *
 * Reads a directory structure and scores it on discoverability.
 * Checks for: AGENTS.md, docs/, architecture docs, feature tracking,
 * handoff files, and other signals of a repository that serves as the
 * system of record.
 *
 * Usage:
 *   npx tsx docs/lectures/lecture-03.../code/repo-reader.ts [path]
 *   (defaults to current working directory if no path given)
 *
 * Run: npx tsx docs/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/code/repo-reader.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ---------------------------------------------------------------------------
// Scoring criteria
// ---------------------------------------------------------------------------

interface Check {
  name: string;
  description: string;
  maxPoints: number;
  check: (dir: string) => { points: number; found: string[]; missing: string[] };
}

const checks: Check[] = [
  {
    name: "AGENTS.md / CLAUDE.md",
    description: "Agent-readable instruction file at repo root",
    maxPoints: 15,
    check: (dir) => {
      const candidates = ["AGENTS.md", "CLAUDE.md", ".claude/CLAUDE.md"];
      const found = candidates.filter((f) => fs.existsSync(path.join(dir, f)));
      return { points: found.length > 0 ? 15 : 0, found, missing: found.length > 0 ? [] : candidates };
    },
  },
  {
    name: "Documentation directory",
    description: "Dedicated docs/ or documentation/ directory",
    maxPoints: 10,
    check: (dir) => {
      const candidates = ["docs", "documentation", "doc"];
      const found = candidates.filter((f) => {
        const p = path.join(dir, f);
        return fs.existsSync(p) && fs.statSync(p).isDirectory();
      });
      return { points: found.length > 0 ? 10 : 0, found, missing: found.length > 0 ? [] : ["docs/"] };
    },
  },
  {
    name: "Architecture documentation",
    description: "Files describing system architecture",
    maxPoints: 15,
    check: (dir) => {
      const patterns = [
        "architecture.md", "ARCHITECTURE.md", "docs/architecture.md",
        "docs/architecture/", "design.md", "DESIGN.md",
      ];
      const found = patterns.filter((f) => fs.existsSync(path.join(dir, f)));
      return { points: found.length > 0 ? 15 : 0, found, missing: found.length > 0 ? [] : ["architecture.md or docs/architecture/"] };
    },
  },
  {
    name: "Feature tracking",
    description: "Feature list or task tracking file",
    maxPoints: 15,
    check: (dir) => {
      const patterns = [
        "feature_list.json", "features.md", "FEATURES.md",
        "docs/features.md", "tasks.json", "TODO.md",
      ];
      const found = patterns.filter((f) => fs.existsSync(path.join(dir, f)));
      return { points: found.length > 0 ? 15 : 0, found, missing: found.length > 0 ? [] : ["feature_list.json or features.md"] };
    },
  },
  {
    name: "Handoff / session continuity",
    description: "Files for multi-session continuity",
    maxPoints: 15,
    check: (dir) => {
      const patterns = [
        "HANDOFF.md", "handoff.md", "SESSION_NOTES.md",
        "docs/handoff.md", ".handoff", "PROGRESS.md",
      ];
      const found = patterns.filter((f) => fs.existsSync(path.join(dir, f)));
      return { points: found.length > 0 ? 15 : 0, found, missing: found.length > 0 ? [] : ["HANDOFF.md or PROGRESS.md"] };
    },
  },
  {
    name: "Testing structure",
    description: "Test directory or test configuration",
    maxPoints: 10,
    check: (dir) => {
      const patterns = ["test", "tests", "__tests__", "spec"];
      const found = patterns.filter((f) => {
        const p = path.join(dir, f);
        return fs.existsSync(p) && fs.statSync(p).isDirectory();
      });
      return { points: found.length > 0 ? 10 : 0, found, missing: found.length > 0 ? [] : ["test/ or tests/"] };
    },
  },
  {
    name: "Configuration files",
    description: "Project config (package.json, tsconfig, etc.)",
    maxPoints: 10,
    check: (dir) => {
      const patterns = ["package.json", "tsconfig.json", "pyproject.toml", "Cargo.toml", "go.mod"];
      const found = patterns.filter((f) => fs.existsSync(path.join(dir, f)));
      return { points: found.length > 0 ? 10 : 0, found, missing: found.length > 0 ? [] : ["package.json or equivalent"] };
    },
  },
  {
    name: "README",
    description: "Root README file",
    maxPoints: 10,
    check: (dir) => {
      const patterns = ["README.md", "README.rst", "README.txt", "README"];
      const found = patterns.filter((f) => fs.existsSync(path.join(dir, f)));
      return { points: found.length > 0 ? 10 : 0, found, missing: found.length > 0 ? [] : ["README.md"] };
    },
  },
];

// ---------------------------------------------------------------------------
// Report generation
// ---------------------------------------------------------------------------

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function scoreRepo(targetDir: string): void {
  const resolved = path.resolve(targetDir);

  if (!fs.existsSync(resolved)) {
    console.error(`  Error: Directory not found: ${resolved}`);
    process.exit(1);
  }

  console.log("\n" + "=".repeat(80));
  console.log("  REPOSITORY DISCOVERABILITY SCORE");
  console.log("=".repeat(80));
  console.log(`  Target: ${resolved}\n`);

  const header = `| ${pad("Criterion", 30)}| ${pad("Points", 8)}| ${pad("Status", 10)}| Details`;
  const sep = `|${"-".repeat(32)}|${"-".repeat(10)}|${"-".repeat(12)}|${"-".repeat(30)}`;
  console.log(header);
  console.log(sep);

  let totalScore = 0;
  let maxScore = 0;

  for (const check of checks) {
    const result = check.check(resolved);
    totalScore += result.points;
    maxScore += check.maxPoints;
    const status = result.points > 0 ? "PASS" : "FAIL";
    const detail = result.found.length > 0 ? result.found.join(", ") : result.missing[0];

    console.log(`| ${pad(check.name, 30)}| ${pad(result.points + "/" + check.maxPoints, 8)}| ${pad(status, 10)}| ${detail}`);
  }

  // Final score
  console.log("\n" + "-".repeat(80));
  console.log(`  TOTAL SCORE: ${totalScore} / ${maxScore}  (${Math.round((totalScore / maxScore) * 100)}%)`);

  // Grade
  const pct = totalScore / maxScore;
  let grade: string;
  if (pct >= 0.9) grade = "A -- Repository is a strong system of record";
  else if (pct >= 0.7) grade = "B -- Good foundation, minor gaps";
  else if (pct >= 0.5) grade = "C -- Partial structure, significant gaps";
  else if (pct >= 0.3) grade = "D -- Minimal structure, hard for agents to navigate";
  else grade = "F -- Repository lacks discoverability signals";

  console.log(`  GRADE: ${grade}`);
  console.log("=".repeat(80) + "\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const target = process.argv[2] || process.cwd();
scoreRepo(target);
