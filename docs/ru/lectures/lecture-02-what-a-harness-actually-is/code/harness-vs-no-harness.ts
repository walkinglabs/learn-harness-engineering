/**
 * harness-vs-no-harness.ts
 *
 * Side-by-side comparison of the same task executor running with and without
 * a harness. The harness version adds explicit rules, verification steps,
 * and stop conditions.
 *
 * Run: npx tsx docs/lectures/lecture-02-what-a-harness-actually-is/code/harness-vs-no-harness.ts
 */

// ---------------------------------------------------------------------------
// Types & helpers
// ---------------------------------------------------------------------------

interface TaskResult {
  name: string;
  passed: boolean;
  durationMs: number;
  issues: string[];
}

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

// ---------------------------------------------------------------------------
// Simulated task executor
// ---------------------------------------------------------------------------

/** A simple task that can succeed or fail depending on rules. */
type Task = {
  name: string;
  requiresAuth: boolean;
  hasTests: boolean;
  withinScope: boolean;
};

const tasks: Task[] = [
  { name: "Add search endpoint", requiresAuth: true, hasTests: false, withinScope: true },
  { name: "Add delete endpoint", requiresAuth: true, hasTests: true, withinScope: true },
  { name: "Refactor auth middleware", requiresAuth: true, hasTests: true, withinScope: false },
  { name: "Add health check", requiresAuth: false, hasTests: true, withinScope: true },
  { name: "Add rate limiter", requiresAuth: true, hasTests: false, withinScope: true },
];

// ---------------------------------------------------------------------------
// Run WITHOUT harness -- just execute every task, no checks
// ---------------------------------------------------------------------------

function runWithoutHarness(taskList: Task[]): TaskResult[] {
  const results: TaskResult[] = [];

  for (const t of taskList) {
    const start = performance.now();
    const issues: string[] = [];

    // The "agent" does the work and calls it done.
    let passed = true;

    // Problems that go undetected without a harness
    if (t.requiresAuth && !t.hasTests) {
      issues.push("No tests for auth-protected endpoint");
      // Agent doesn't notice -- marks as pass anyway
    }
    if (!t.withinScope) {
      issues.push("Task is outside current scope");
      // Agent doesn't notice
    }

    const duration = performance.now() - start;
    results.push({ name: t.name, passed, durationMs: duration, issues });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Run WITH harness -- rules, verification, stop conditions
// ---------------------------------------------------------------------------

function runWithHarness(taskList: Task[]): TaskResult[] {
  const rules = {
    requireTestsForAuth: true,
    enforceScope: true,
  };

  const results: TaskResult[] = [];

  for (const t of taskList) {
    const start = performance.now();
    const issues: string[] = [];
    let passed = true;

    // Rule: auth endpoints must have tests
    if (rules.requireTestsForAuth && t.requiresAuth && !t.hasTests) {
      issues.push("BLOCKED: Auth-protected endpoint missing tests");
      passed = false;
    }

    // Rule: stay in scope
    if (rules.enforceScope && !t.withinScope) {
      issues.push("BLOCKED: Task outside active scope -- skipped");
      passed = false;
    }

    // Verification: re-check after execution
    if (passed && !t.hasTests) {
      issues.push("WARNING: No tests exist for this change");
    }

    const duration = performance.now() - start;
    results.push({ name: t.name, passed, durationMs: duration, issues });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function printComparison(
  noHarness: TaskResult[],
  withHarness: TaskResult[]
): void {
  console.log("\n" + "=".repeat(80));
  console.log("  HARNESS vs NO-HARNESS COMPARISON");
  console.log("=".repeat(80));

  const header = `| ${pad("Task", 28)}| ${pad("No-Harness", 12)}| ${pad("Issues(NH)", 35)}| ${pad("Harness", 12)}| ${pad("Issues(H)", 35)}|`;
  const sep = `|${"-".repeat(30)}|${"-".repeat(14)}|${"-".repeat(37)}|${"-".repeat(14)}|${"-".repeat(37)}|`;

  console.log("\n" + header);
  console.log(sep);

  for (let i = 0; i < noHarness.length; i++) {
    const nh = noHarness[i];
    const wh = withHarness[i];
    const nhPass = nh.passed ? "PASS" : "FAIL";
    const whPass = wh.passed ? "PASS" : "FAIL";
    const nhIssue = nh.issues[0] ?? "(none)";
    const whIssue = wh.issues[0] ?? "(none)";

    console.log(
      `| ${pad(nh.name, 28)}| ${pad(nhPass, 12)}| ${pad(nhIssue, 35)}| ${pad(whPass, 12)}| ${pad(whIssue, 35)}|`
    );
  }

  // Metrics
  const nhPassed = noHarness.filter((r) => r.passed).length;
  const whPassed = withHarness.filter((r) => r.passed).length;
  const nhIssues = noHarness.reduce((sum, r) => sum + r.issues.length, 0);
  const whIssues = withHarness.reduce((sum, r) => sum + r.issues.length, 0);

  console.log("\n" + "=".repeat(80));
  console.log("  SUMMARY METRICS");
  console.log("=".repeat(80));

  const metricsHeader = `| ${pad("Metric", 30)}| ${pad("No Harness", 15)}| ${pad("With Harness", 15)}|`;
  const metricsSep = `|${"-".repeat(32)}|${"-".repeat(17)}|${"-".repeat(17)}|`;
  console.log("\n" + metricsHeader);
  console.log(metricsSep);
  console.log(`| ${pad("Tasks passed", 30)}| ${pad(String(nhPassed) + "/" + noHarness.length, 15)}| ${pad(String(whPassed) + "/" + withHarness.length, 15)}|`);
  console.log(`| ${pad("Issues detected", 30)}| ${pad(String(nhIssues), 15)}| ${pad(String(whIssues), 15)}|`);
  console.log(`| ${pad("False positives (passed but flawed)", 30)}| ${pad(String(nhPassed - truePassCount(noHarness)), 15)}| ${pad(String(whPassed - truePassCount(withHarness)), 15)}|`);

  console.log("\n  The harness catches problems the no-harness run silently ignores.");
  console.log("  Without a harness, every task 'passes' even when it shouldn't.\n");
}

/** Count tasks that actually pass (have tests and are in scope). */
function truePassCount(results: TaskResult[]): number {
  return results.filter((r) => r.passed && r.issues.length === 0).length;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

printComparison(runWithoutHarness(tasks), runWithHarness(tasks));
