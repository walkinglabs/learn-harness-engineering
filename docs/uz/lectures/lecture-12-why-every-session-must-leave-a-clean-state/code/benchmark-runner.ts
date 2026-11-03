/**
 * benchmark-runner.ts
 *
 * Reads a benchmark task definition (JSON array of tasks with pass criteria),
 * "executes" each task, records timing and pass/fail, outputs a comparison
 * report showing which tasks pass and which fail.
 *
 * Run: npx tsx docs/lectures/lecture-12-why-every-session-must-leave-a-clean-state/code/benchmark-runner.ts
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BenchmarkTask {
  id: string;
  name: string;
  category: string;
  passCriteria: string[];
  expectedDurationMs: number;
  // Simulated actual results
  actualDurationMs: number;
  actualPass: boolean;
  failureReason?: string;
}

interface BenchmarkResult {
  id: string;
  name: string;
  category: string;
  criteriaTotal: number;
  criteriaPassed: number;
  pass: boolean;
  expectedMs: number;
  actualMs: number;
  durationDelta: number;
  failureReason?: string;
}

// ---------------------------------------------------------------------------
// Benchmark task definitions
// ---------------------------------------------------------------------------

const benchmarkTasks: BenchmarkTask[] = [
  {
    id: "bench-001",
    name: "Import markdown document",
    category: "Document Pipeline",
    passCriteria: ["File accepted", "Chunks created", "Metadata stored"],
    expectedDurationMs: 100,
    actualDurationMs: 95,
    actualPass: true,
  },
  {
    id: "bench-002",
    name: "Import PDF document",
    category: "Document Pipeline",
    passCriteria: ["File accepted", "Text extracted", "Chunks created", "Metadata stored"],
    expectedDurationMs: 200,
    actualDurationMs: 310,
    actualPass: false,
    failureReason: "PDF text extraction failed on page 3 -- encoding issue",
  },
  {
    id: "bench-003",
    name: "Ask grounded question",
    category: "Q&A Pipeline",
    passCriteria: ["Query received", "Relevant chunks retrieved", "Answer generated", "Citations present"],
    expectedDurationMs: 500,
    actualDurationMs: 480,
    actualPass: true,
  },
  {
    id: "bench-004",
    name: "Ask question with no relevant docs",
    category: "Q&A Pipeline",
    passCriteria: ["Query received", "Graceful 'no results' message", "No hallucinated citations"],
    expectedDurationMs: 400,
    actualDurationMs: 420,
    actualPass: false,
    failureReason: "Model hallucinated a citation instead of saying 'no results'",
  },
  {
    id: "bench-005",
    name: "Delete imported document",
    category: "Document Pipeline",
    passCriteria: ["Document removed from list", "Chunks removed from index", "No orphan data"],
    expectedDurationMs: 150,
    actualDurationMs: 145,
    actualPass: true,
  },
  {
    id: "bench-006",
    name: "Concurrent user access",
    category: "Security",
    passCriteria: ["Users isolated", "No cross-user data leak", "Performance within SLA"],
    expectedDurationMs: 300,
    actualDurationMs: 850,
    actualPass: false,
    failureReason: "Cross-user data leak detected + response time exceeded SLA (850ms > 500ms)",
  },
  {
    id: "bench-007",
    name: "Session continuity after restart",
    category: "Reliability",
    passCriteria: ["State persisted", "Session recovers", "No data loss"],
    expectedDurationMs: 200,
    actualDurationMs: 180,
    actualPass: true,
  },
  {
    id: "bench-008",
    name: "API rate limiting",
    category: "Security",
    passCriteria: ["Rate limit enforced", "429 response after limit", "Legitimate traffic unaffected"],
    expectedDurationMs: 100,
    actualDurationMs: 100,
    actualPass: true,
  },
];

// ---------------------------------------------------------------------------
// Execution simulation
// ---------------------------------------------------------------------------

function executeBenchmark(tasks: BenchmarkTask[]): BenchmarkResult[] {
  return tasks.map((task) => ({
    id: task.id,
    name: task.name,
    category: task.category,
    criteriaTotal: task.passCriteria.length,
    criteriaPassed: task.actualPass ? task.passCriteria.length : Math.floor(task.passCriteria.length * 0.5),
    pass: task.actualPass,
    expectedMs: task.expectedDurationMs,
    actualMs: task.actualDurationMs,
    durationDelta: task.actualDurationMs - task.expectedDurationMs,
    failureReason: task.failureReason,
  }));
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function run(): void {
  console.log("\n" + "=".repeat(100));
  console.log("  BENCHMARK RUNNER -- Task Execution Report");
  console.log("=".repeat(100));

  const results = executeBenchmark(benchmarkTasks);

  // Detailed results
  const header = `| ${pad("ID", 10)}| ${pad("Task", 35)}| ${pad("Category", 18)}| ${pad("Pass?", 6)}| ${pad("Criteria", 10)}| ${pad("Expected", 10)}| ${pad("Actual", 10)}| ${pad("Delta", 8)}|`;
  const sep = `|${"-".repeat(12)}|${"-".repeat(37)}|${"-".repeat(20)}|${"-".repeat(8)}|${"-".repeat(12)}|${"-".repeat(12)}|${"-".repeat(12)}|${"-".repeat(10)}|`;
  console.log("\n" + header);
  console.log(sep);

  for (const r of results) {
    const passLabel = r.pass ? "PASS" : "FAIL";
    const criteriaLabel = `${r.criteriaPassed}/${r.criteriaTotal}`;
    const deltaLabel = r.durationDelta >= 0 ? `+${r.durationDelta}ms` : `${r.durationDelta}ms`;
    const marker = r.pass ? "  " : ">>";

    console.log(
      `${marker}| ${pad(r.id, 10)}| ${pad(r.name, 35)}| ${pad(r.category, 18)}| ${pad(passLabel, 6)}| ${pad(criteriaLabel, 10)}| ${pad(r.expectedMs + "ms", 10)}| ${pad(r.actualMs + "ms", 10)}| ${pad(deltaLabel, 8)}|`
    );
  }

  // Failure details
  const failures = results.filter((r) => !r.pass);
  if (failures.length > 0) {
    console.log("\n" + "-".repeat(100));
    console.log("  FAILURE DETAILS");
    console.log("-".repeat(100));
    for (const f of failures) {
      console.log(`\n  [${f.id}] ${f.name}`);
      console.log(`    Category:    ${f.category}`);
      console.log(`    Criteria:    ${f.criteriaPassed}/${f.criteriaTotal} passed`);
      console.log(`    Reason:      ${f.failureReason ?? "Unknown"}`);
      console.log(`    Timing:      Expected ${f.expectedMs}ms, actual ${f.actualMs}ms (delta: ${f.durationDelta >= 0 ? "+" : ""}${f.durationDelta}ms)`);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(100));
  console.log("  SUMMARY BY CATEGORY");
  console.log("=".repeat(100) + "\n");

  const categories = [...new Set(results.map((r) => r.category))];
  const catHeader = `| ${pad("Category", 20)}| ${pad("Total", 8)}| ${pad("Passed", 8)}| ${pad("Failed", 8)}| ${pad("Pass Rate", 12)}|`;
  const catSep = `|${"-".repeat(22)}|${"-".repeat(10)}|${"-".repeat(10)}|${"-".repeat(10)}|${"-".repeat(14)}|`;
  console.log(catHeader);
  console.log(catSep);

  for (const cat of categories) {
    const catResults = results.filter((r) => r.category === cat);
    const catPassed = catResults.filter((r) => r.pass).length;
    const catFailed = catResults.filter((r) => !r.pass).length;
    const rate = Math.round((catPassed / catResults.length) * 100);

    console.log(`| ${pad(cat, 20)}| ${pad(String(catResults.length), 8)}| ${pad(String(catPassed), 8)}| ${pad(String(catFailed), 8)}| ${pad(rate + "%", 12)}|`);
  }

  // Overall
  const totalPassed = results.filter((r) => r.pass).length;
  const totalFailed = results.filter((r) => !r.pass).length;
  console.log("\n" + "-".repeat(100));
  console.log(`  OVERALL: ${totalPassed}/${results.length} passed (${Math.round((totalPassed / results.length) * 100)}%), ${totalFailed} failures`);
  console.log("=".repeat(100) + "\n");
}

run();
