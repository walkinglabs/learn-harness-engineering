/**
 * e2e-runner.ts
 *
 * A minimal E2E test harness. Defines test cases as user action sequences
 * (import doc -> index -> ask question -> verify citation). Simulates
 * running them and shows the difference between "unit tests pass" and
 * "full pipeline works".
 *
 * Run: npx tsx docs/lectures/lecture-10-why-end-to-end-testing-changes-results/code/e2e-runner.ts
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PipelineStep {
  name: string;
  unitTestPasses: boolean;
  // Simulated actual behavior in the pipeline
  actualBehavior: "works" | "fails" | "partial";
  failureReason?: string;
}

interface TestCase {
  name: string;
  steps: PipelineStep[];
}

interface TestResult {
  testCase: string;
  unitTestsPassed: number;
  unitTestsTotal: number;
  unitTestResult: "PASS" | "FAIL";
  e2eResult: "PASS" | "FAIL";
  e2eFailureStep?: string;
  e2eFailureReason?: string;
}

// ---------------------------------------------------------------------------
// Test cases -- realistic scenarios where unit tests pass but E2E fails
// ---------------------------------------------------------------------------

const testCases: TestCase[] = [
  {
    name: "Import document and ask question",
    steps: [
      {
        name: "Parse uploaded document",
        unitTestPasses: true,
        actualBehavior: "works",
      },
      {
        name: "Store document chunks",
        unitTestPasses: true,
        actualBehavior: "works",
      },
      {
        name: "Index chunks for retrieval",
        unitTestPasses: true,
        actualBehavior: "partial", // Indexes but with wrong embedding dimensions
        failureReason: "Embedding dimension mismatch between indexer and retriever",
      },
      {
        name: "Retrieve relevant chunks",
        unitTestPasses: true, // Unit test uses mock data with correct dimensions
        actualBehavior: "fails",
        failureReason: "Empty results due to dimension mismatch from previous step",
      },
      {
        name: "Generate answer with citations",
        unitTestPasses: true, // Unit test provides pre-retrieved chunks
        actualBehavior: "fails",
        failureReason: "No chunks retrieved, so answer has no citations",
      },
    ],
  },
  {
    name: "Delete document and verify removal",
    steps: [
      {
        name: "Find document by ID",
        unitTestPasses: true,
        actualBehavior: "works",
      },
      {
        name: "Delete document record",
        unitTestPasses: true,
        actualBehavior: "works",
      },
      {
        name: "Remove indexed chunks",
        unitTestPasses: true,
        actualBehavior: "fails", // Orphaned chunks remain in the index
        failureReason: "Index cleanup query timed out, chunks remain orphaned",
      },
      {
        name: "Verify document not in search results",
        unitTestPasses: true, // Unit test mocks the search
        actualBehavior: "fails",
        failureReason: "Orphaned chunks from previous step still appear in results",
      },
    ],
  },
  {
    name: "Multi-user concurrent access",
    steps: [
      {
        name: "User A imports document",
        unitTestPasses: true,
        actualBehavior: "works",
      },
      {
        name: "User B imports document",
        unitTestPasses: true,
        actualBehavior: "works",
      },
      {
        name: "User A queries their document",
        unitTestPasses: true,
        actualBehavior: "partial", // Cross-contamination of results
        failureReason: "No user-scoping on retrieval, returns chunks from User B's doc",
      },
      {
        name: "Verify only User A's results returned",
        unitTestPasses: true,
        actualBehavior: "fails",
        failureReason: "Results include documents from other users",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Run tests
// ---------------------------------------------------------------------------

function runUnitTests(tc: TestCase): { passed: number; total: number } {
  const passed = tc.steps.filter((s) => s.unitTestPasses).length;
  return { passed, total: tc.steps.length };
}

function runE2ETest(tc: TestCase): { pass: boolean; failureStep?: string; failureReason?: string } {
  // Pipeline: if any step actually fails, the whole E2E fails
  for (const step of tc.steps) {
    if (step.actualBehavior === "fails") {
      return {
        pass: false,
        failureStep: step.name,
        failureReason: step.failureReason ?? "Unknown failure",
      };
    }
    // "partial" means the step technically completes but creates problems downstream
    // We let it continue but track it
  }
  // Check if any step was "partial" (which may cause downstream issues)
  const partialSteps = tc.steps.filter((s) => s.actualBehavior === "partial");
  if (partialSteps.length > 0) {
    // The partial steps may or may not cause overall failure
    // In our simulation, partial steps always lead to failure downstream
    // unless there's an explicit "fails" step that already caught it
    // This case means all steps were either "works" or "partial"
    return {
      pass: false,
      failureStep: partialSteps[partialSteps.length - 1].name,
      failureReason: partialSteps[partialSteps.length - 1].failureReason ?? "Partial completion",
    };
  }

  return { pass: true };
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function run(): void {
  console.log("\n" + "=".repeat(95));
  console.log("  E2E TEST RUNNER -- Unit Tests vs Full Pipeline");
  console.log("=".repeat(95));

  const results: TestResult[] = testCases.map((tc) => {
    const unit = runUnitTests(tc);
    const e2e = runE2ETest(tc);

    return {
      testCase: tc.name,
      unitTestsPassed: unit.passed,
      unitTestsTotal: unit.total,
      unitTestResult: unit.passed === unit.total ? "PASS" : "FAIL",
      e2eResult: e2e.pass ? "PASS" : "FAIL",
      e2eFailureStep: e2e.failureStep,
      e2eFailureReason: e2e.failureReason,
    };
  });

  // Per-test-case detail
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const r = results[i];

    console.log("\n  Test Case: " + tc.name);
    console.log("  " + "-".repeat(70));

    const stepHeader = `  | ${pad("Step", 40)}| ${pad("Unit Test", 11)}| ${pad("E2E Actual", 12)}|`;
    const stepSep = `  |${"-".repeat(42)}|${"-".repeat(13)}|${"-".repeat(14)}|`;
    console.log(stepHeader);
    console.log(stepSep);

    for (const step of tc.steps) {
      const utLabel = step.unitTestPasses ? "PASS" : "FAIL";
      let e2eLabel: string;
      if (step.actualBehavior === "works") e2eLabel = "PASS";
      else if (step.actualBehavior === "partial") e2eLabel = "PARTIAL*";
      else e2eLabel = "FAIL";

      const marker = step.actualBehavior !== "works" ? ">>" : "  ";
      console.log(`${marker}| ${pad(step.name, 40)}| ${pad(utLabel, 11)}| ${pad(e2eLabel, 12)}|`);
    }

    if (r.e2eFailureStep) {
      console.log(`\n  E2E Failure at: ${r.e2eFailureStep}`);
      console.log(`  Reason: ${r.e2eFailureReason}`);
    }
  }

  // Summary comparison
  console.log("\n" + "=".repeat(95));
  console.log("  COMPARISON: Unit Tests vs E2E Tests");
  console.log("=".repeat(95) + "\n");

  const header = `| ${pad("Test Case", 35)}| ${pad("Unit Tests", 15)}| ${pad("E2E Result", 12)}| Discrepancy`;
  const sep = `|${"-".repeat(37)}|${"-".repeat(17)}|${"-".repeat(14)}|${"-".repeat(30)}`;
  console.log(header);
  console.log(sep);

  for (const r of results) {
    const utLabel = `${r.unitTestsPassed}/${r.unitTestsTotal} ${r.unitTestResult}`;
    const discrepancy = r.unitTestResult === "PASS" && r.e2eResult === "FAIL";
    const discLabel = discrepancy ? "UNIT PASS BUT E2E FAIL" : "Consistent";

    console.log(`| ${pad(r.testCase, 35)}| ${pad(utLabel, 15)}| ${pad(r.e2eResult, 12)}| ${discLabel}`);
  }

  const falseConfidence = results.filter((r) => r.unitTestResult === "PASS" && r.e2eResult === "FAIL").length;
  console.log("\n  False confidence count: " + falseConfidence + " of " + results.length);
  console.log("  Unit tests pass but E2E reveals integration failures that units cannot catch.\n");
}

run();
