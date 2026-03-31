/**
 * scope-tracker.ts
 *
 * Reads a feature list and a change log. Enforces single-active-feature
 * policy. Given a log of changes, flags any changes outside the active
 * feature scope. Demonstrates how scope drift happens and how the tracker
 * catches it.
 *
 * Run: npx tsx docs/lectures/lecture-07-why-agents-overreach-and-under-finish/code/scope-tracker.ts
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Feature {
  id: string;
  name: string;
  status: "active" | "pending" | "done";
}

interface ChangeLogEntry {
  step: number;
  file: string;
  description: string;
  featureId: string; // The feature this change claims to belong to
}

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const features: Feature[] = [
  { id: "F-001", name: "Search endpoint", status: "active" },
  { id: "F-002", name: "Delete endpoint", status: "pending" },
  { id: "F-003", name: "Rate limiting", status: "pending" },
  { id: "F-004", name: "User dashboard", status: "pending" },
];

// A realistic change log where the agent gradually drifts from the active feature
const changeLog: ChangeLogEntry[] = [
  { step: 1, file: "src/routes/search.ts", description: "Add search route handler", featureId: "F-001" },
  { step: 2, file: "src/routes/search.ts", description: "Add query parameter validation", featureId: "F-001" },
  { step: 3, file: "src/routes/search.ts", description: "Add search results pagination", featureId: "F-001" },
  { step: 4, file: "src/routes/delete.ts", description: "Add delete route handler", featureId: "F-002" }, // DRIFT
  { step: 5, file: "src/middleware/rate-limit.ts", description: "Add rate limiter middleware", featureId: "F-003" }, // DRIFT
  { step: 6, file: "src/routes/search.ts", description: "Integrate rate limiter into search", featureId: "F-001" },
  { step: 7, file: "src/dashboard/ui.tsx", description: "Create dashboard layout component", featureId: "F-004" }, // DRIFT
  { step: 8, file: "src/routes/search.ts", description: "Add search response formatting", featureId: "F-001" },
  { step: 9, file: "src/routes/delete.ts", description: "Add delete confirmation logic", featureId: "F-002" }, // DRIFT
  { step: 10, file: "src/routes/search.ts", description: "Add search tests", featureId: "F-001" },
];

// ---------------------------------------------------------------------------
// Scope tracker
// ---------------------------------------------------------------------------

interface ScopeCheckResult {
  step: number;
  file: string;
  description: string;
  featureId: string;
  inScope: boolean;
  activeFeature: string;
}

function trackScope(
  featureList: Feature[],
  changes: ChangeLogEntry[]
): ScopeCheckResult[] {
  const activeFeatures = featureList.filter((f) => f.status === "active");
  const activeIds = new Set(activeFeatures.map((f) => f.id));
  const activeNames = activeFeatures.map((f) => f.name).join(", ");

  return changes.map((change) => ({
    step: change.step,
    file: change.file,
    description: change.description,
    featureId: change.featureId,
    inScope: activeIds.has(change.featureId),
    activeFeature: activeNames,
  }));
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function run(): void {
  const results = trackScope(features, changeLog);

  console.log("\n" + "=".repeat(100));
  console.log("  SCOPE TRACKER -- Single Active Feature Enforcement");
  console.log("=".repeat(100));

  console.log("\n  Active feature: " + features.filter((f) => f.status === "active").map((f) => `${f.id} (${f.name})`).join(", "));
  console.log("  Pending features: " + features.filter((f) => f.status === "pending").map((f) => `${f.id} (${f.name})`).join(", "));

  // Detailed change log
  console.log("\n" + "-".repeat(100));
  const header = `| ${pad("Step", 5)}| ${pad("File", 35)}| ${pad("Description", 40)}| ${pad("Feature", 8)}| ${pad("In Scope", 10)}|`;
  const sep = `|${"-".repeat(7)}|${"-".repeat(37)}|${"-".repeat(42)}|${"-".repeat(10)}|${"-".repeat(12)}|`;
  console.log(header);
  console.log(sep);

  let inScopeCount = 0;
  let driftCount = 0;

  for (const r of results) {
    const scopeLabel = r.inScope ? "OK" : "DRIFT";
    if (r.inScope) inScopeCount++;
    else driftCount++;

    const marker = r.inScope ? "  " : ">>";
    console.log(`${marker}| ${pad(String(r.step), 5)}| ${pad(r.file, 35)}| ${pad(r.description, 40)}| ${pad(r.featureId, 8)}| ${pad(scopeLabel, 10)}|`);
  }

  // Summary
  console.log("\n" + "=".repeat(100));
  console.log("  SCOPE DRIFT SUMMARY");
  console.log("=".repeat(100) + "\n");

  const sHeader = `| ${pad("Metric", 40)}| ${pad("Value", 15)}|`;
  const sSep = `|${"-".repeat(42)}|${"-".repeat(17)}|`;
  console.log(sHeader);
  console.log(sSep);
  console.log(`| ${pad("Total changes", 40)}| ${pad(String(results.length), 15)}|`);
  console.log(`| ${pad("Changes within active scope (F-001)", 40)}| ${pad(String(inScopeCount), 15)}|`);
  console.log(`| ${pad("Changes outside active scope (DRIFT)", 40)}| ${pad(String(driftCount), 15)}|`);
  console.log(`| ${pad("Features touched (total)", 40)}| ${pad(String(new Set(results.map((r) => r.featureId)).size), 15)}|`);

  // Drift detail
  const driftFeatures = [...new Set(results.filter((r) => !r.inScope).map((r) => r.featureId))];
  if (driftFeatures.length > 0) {
    console.log("\n  DRIFTED FEATURES:");
    for (const fid of driftFeatures) {
      const feat = features.find((f) => f.id === fid);
      const driftChanges = results.filter((r) => r.featureId === fid);
      console.log(`    ${fid} (${feat?.name}): ${driftChanges.length} unauthorized changes`);
    }
  }

  console.log("\n  Without a scope tracker, the agent silently worked on " + driftFeatures.length + " unrelated features.");
  console.log("  The tracker catches this drift and enforces the single-active-feature policy.\n");
}

run();
