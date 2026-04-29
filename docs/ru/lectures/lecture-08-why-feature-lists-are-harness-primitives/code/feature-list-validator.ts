/**
 * feature-list-validator.ts
 *
 * Reads a feature_list.json, validates its schema, and checks for features
 * marked "pass" without verification evidence. Outputs a structured report.
 * Can run against any project directory that has a feature_list.json.
 *
 * Usage:
 *   npx tsx docs/lectures/lecture-08.../code/feature-list-validator.ts [path-to-dir]
 *   (defaults to the directory containing this script)
 *
 * Run: npx tsx docs/lectures/lecture-08-why-feature-lists-are-harness-primitives/code/feature-list-validator.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FeatureEntry {
  id?: string;
  category?: string;
  description?: string;
  verification?: string[];
  passes?: boolean;
  // Allow unknown fields for flexibility
  [key: string]: unknown;
}

interface ValidationResult {
  featureId: string;
  schemaValid: boolean;
  schemaErrors: string[];
  hasVerification: boolean;
  markedPassWithoutEvidence: boolean;
  passes: boolean;
  verificationCount: number;
}

// ---------------------------------------------------------------------------
// Schema validation
// ---------------------------------------------------------------------------

function validateSchema(entry: FeatureEntry, index: number): string[] {
  const errors: string[] = [];
  const label = entry.id ?? `entry ${index + 1}`;

  if (!entry.id || typeof entry.id !== "string") {
    errors.push(`[${label}] Missing or invalid 'id' field`);
  }
  if (!entry.category || typeof entry.category !== "string") {
    errors.push(`[${label}] Missing or invalid 'category' field`);
  }
  if (!entry.description || typeof entry.description !== "string") {
    errors.push(`[${label}] Missing or invalid 'description' field`);
  }
  if (entry.verification !== undefined && !Array.isArray(entry.verification)) {
    errors.push(`[${label}] 'verification' must be an array if present`);
  }
  if (entry.passes !== undefined && typeof entry.passes !== "boolean") {
    errors.push(`[${label}] 'passes' must be a boolean if present`);
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Evidence validation
// ---------------------------------------------------------------------------

function checkEvidence(entry: FeatureEntry): {
  hasVerification: boolean;
  markedPassWithoutEvidence: boolean;
} {
  const hasVerification = Array.isArray(entry.verification) && entry.verification.length > 0;
  const markedPassWithoutEvidence = entry.passes === true && !hasVerification;

  return { hasVerification, markedPassWithoutEvidence };
}

// ---------------------------------------------------------------------------
// Process feature list
// ---------------------------------------------------------------------------

function processFeatureList(entries: FeatureEntry[]): ValidationResult[] {
  return entries.map((entry, index) => {
    const schemaErrors = validateSchema(entry, index);
    const evidence = checkEvidence(entry);

    return {
      featureId: (entry.id as string) ?? `entry-${index + 1}`,
      schemaValid: schemaErrors.length === 0,
      schemaErrors,
      hasVerification: evidence.hasVerification,
      markedPassWithoutEvidence: evidence.markedPassWithoutEvidence,
      passes: entry.passes === true,
      verificationCount: Array.isArray(entry.verification) ? entry.verification.length : 0,
    };
  });
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function run(): void {
  // Resolve target directory
  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  const targetDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : scriptDir;

  const filePath = path.join(targetDir, "feature_list.json");

  console.log("\n" + "=".repeat(90));
  console.log("  FEATURE LIST VALIDATOR");
  console.log("=".repeat(90));
  console.log(`  Reading: ${filePath}\n`);

  if (!fs.existsSync(filePath)) {
    console.error(`  ERROR: feature_list.json not found at ${filePath}`);
    console.error("  Usage: npx tsx feature-list-validator.ts [path-to-directory-containing-feature_list.json]\n");
    process.exit(1);
  }

  let entries: FeatureEntry[];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    entries = JSON.parse(raw);
  } catch (err) {
    console.error(`  ERROR: Could not parse feature_list.json: ${err}`);
    process.exit(1);
  }

  if (!Array.isArray(entries)) {
    console.error("  ERROR: feature_list.json must contain a JSON array at the top level.");
    process.exit(1);
  }

  // For demo purposes, also validate an extended test set
  const demoEntries: FeatureEntry[] = [
    ...entries,
    {
      id: "qna-002",
      category: "import",
      description: "User can import a PDF document.",
      verification: ["Upload a PDF file", "Verify it appears in the document list"],
      passes: true,
    },
    {
      id: "qna-003",
      category: "grounded_qa",
      description: "System hallucination rate is below 5%.",
      verification: [], // Empty -- no evidence
      passes: true, // Marked as pass WITHOUT evidence
    },
    {
      id: "missing-fields",
      // Missing 'category' and 'description'
      passes: true,
    } as FeatureEntry,
  ];

  const results = processFeatureList(demoEntries);

  // Print report
  const header = `| ${pad("Feature ID", 14)}| ${pad("Schema", 8)}| ${pad("Passes", 7)}| ${pad("Verifications", 14)}| ${pad("Evidence?", 12)}| Notes`;
  const sep = `|${"-".repeat(16)}|${"-".repeat(10)}|${"-".repeat(9)}|${"-".repeat(16)}|${"-".repeat(14)}|${"-".repeat(30)}`;
  console.log(header);
  console.log(sep);

  for (const r of results) {
    const schemaLabel = r.schemaValid ? "OK" : "INVALID";
    const passesLabel = r.passes ? "PASS" : "FAIL";
    const evidenceLabel = r.hasVerification ? "Present" : "MISSING";
    const notes = r.markedPassWithoutEvidence
      ? "FLAGGED: passes without evidence!"
      : r.schemaErrors.length > 0
        ? r.schemaErrors[0]
        : "";

    const marker = r.markedPassWithoutEvidence ? ">>" : r.schemaValid ? "  " : "!!";
    console.log(
      `${marker}| ${pad(r.featureId, 14)}| ${pad(schemaLabel, 8)}| ${pad(passesLabel, 7)}| ${pad(String(r.verificationCount), 14)}| ${pad(evidenceLabel, 12)}| ${notes}`
    );
  }

  // Summary
  const total = results.length;
  const schemaOk = results.filter((r) => r.schemaValid).length;
  const passing = results.filter((r) => r.passes).length;
  const flagged = results.filter((r) => r.markedPassWithoutEvidence).length;
  const withEvidence = results.filter((r) => r.hasVerification).length;

  console.log("\n" + "-".repeat(90));
  console.log("  SUMMARY");
  console.log("-".repeat(90));
  console.log(`  Total features:                     ${total}`);
  console.log(`  Schema valid:                       ${schemaOk}/${total}`);
  console.log(`  Marked as passing:                  ${passing}/${total}`);
  console.log(`  With verification evidence:         ${withEvidence}/${total}`);
  console.log(`  Flagged (pass without evidence):    ${flagged}`);

  if (flagged > 0) {
    console.log(`\n  WARNING: ${flagged} feature(s) marked as "pass" without any verification evidence.`);
    console.log("  These features need verification before they can be trusted.\n");
  } else {
    console.log("\n  All passing features have verification evidence. Feature list is healthy.\n");
  }
}

run();
