/**
 * victory-detector.ts
 *
 * Simulates an agent that claims task completion, then checks the claimed
 * state against actual verification. Outputs: claimed vs actual, highlighting
 * gaps between what the agent said and what's really true.
 *
 * Run: npx tsx docs/lectures/lecture-09-why-agents-declare-victory-too-early/code/victory-detector.ts
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Task {
  name: string;
  claimedComplete: boolean;
  checks: VerificationCheck[];
}

interface VerificationCheck {
  description: string;
  claimed: boolean; // What the agent says
  actual: boolean;  // What is actually true
  severity: "critical" | "warning";
}

// ---------------------------------------------------------------------------
// Simulated tasks with claimed vs actual states
// ---------------------------------------------------------------------------

const tasks: Task[] = [
  {
    name: "Add search endpoint",
    claimedComplete: true,
    checks: [
      {
        description: "Route handler exists",
        claimed: true,
        actual: true,
        severity: "critical",
      },
      {
        description: "Authentication middleware applied",
        claimed: true,
        actual: false, // Agent forgot auth
        severity: "critical",
      },
      {
        description: "Input validation added",
        claimed: true,
        actual: true,
        severity: "critical",
      },
      {
        description: "Unit tests written",
        claimed: true,
        actual: false, // Agent skipped tests
        severity: "critical",
      },
      {
        description: "Integration tests pass",
        claimed: true,
        actual: false, // No tests to run
        severity: "critical",
      },
      {
        description: "Documentation updated",
        claimed: true,
        actual: false, // Agent skipped docs
        severity: "warning",
      },
    ],
  },
  {
    name: "Fix pagination bug",
    claimedComplete: true,
    checks: [
      {
        description: "Bug reproduction case confirmed",
        claimed: true,
        actual: true,
        severity: "critical",
      },
      {
        description: "Root cause identified",
        claimed: true,
        actual: true,
        severity: "critical",
      },
      {
        description: "Fix applied",
        claimed: true,
        actual: true,
        severity: "critical",
      },
      {
        description: "Edge cases tested",
        claimed: true,
        actual: false, // Only happy path tested
        severity: "warning",
      },
      {
        description: "Regression tests added",
        claimed: true,
        actual: false,
        severity: "critical",
      },
    ],
  },
  {
    name: "Refactor auth module",
    claimedComplete: true,
    checks: [
      {
        description: "Old code removed",
        claimed: true,
        actual: false, // Old code still present
        severity: "warning",
      },
      {
        description: "All existing tests still pass",
        claimed: true,
        actual: false, // Two tests broke
        severity: "critical",
      },
      {
        description: "New auth flow works",
        claimed: true,
        actual: true,
        severity: "critical",
      },
      {
        description: "Migration guide written",
        claimed: true,
        actual: false,
        severity: "warning",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Verification
// ---------------------------------------------------------------------------

interface TaskVerification {
  taskName: string;
  claimedComplete: boolean;
  actuallyComplete: boolean;
  totalChecks: number;
  claimedPassing: number;
  actualPassing: number;
  gaps: { description: string; severity: string }[];
}

function verifyTask(task: Task): TaskVerification {
  const claimedPassing = task.checks.filter((c) => c.claimed).length;
  const actualPassing = task.checks.filter((c) => c.actual).length;
  const gaps = task.checks.filter((c) => c.claimed && !c.actual);

  return {
    taskName: task.name,
    claimedComplete: task.claimedComplete,
    actuallyComplete: gaps.length === 0,
    totalChecks: task.checks.length,
    claimedPassing,
    actualPassing,
    gaps: gaps.map((g) => ({ description: g.description, severity: g.severity })),
  };
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function run(): void {
  console.log("\n" + "=".repeat(90));
  console.log("  VICTORY DETECTOR -- Claimed vs Actual Verification");
  console.log("=".repeat(90));

  const verifications = tasks.map(verifyTask);

  for (const v of verifications) {
    console.log("\n  Task: " + v.taskName);
    console.log("  " + "-".repeat(70));
    console.log(`  Agent claimed:  ${v.claimedComplete ? "COMPLETE" : "NOT COMPLETE"}`);
    console.log(`  Actually is:    ${v.actuallyComplete ? "COMPLETE" : "INCOMPLETE"}`);

    if (!v.actuallyComplete) {
      console.log(`  MISMATCH: Agent declared victory but ${v.gaps.length} check(s) failed!`);
    }

    // Detailed checks for this task
    const task = tasks.find((t) => t.name === v.taskName)!;
    console.log("\n  Check detail:");
    const header = `  | ${pad("Check", 40)}| ${pad("Claimed", 9)}| ${pad("Actual", 9)}| ${pad("Gap?", 6)}|`;
    const sep = `  |${"-".repeat(42)}|${"-".repeat(11)}|${"-".repeat(11)}|${"-".repeat(8)}|`;
    console.log(header);
    console.log(sep);

    for (const check of task.checks) {
      const claimedLabel = check.claimed ? "PASS" : "FAIL";
      const actualLabel = check.actual ? "PASS" : "FAIL";
      const gapLabel = check.claimed && !check.actual ? "GAP" : "";
      const marker = gapLabel ? ">>" : "  ";
      console.log(`${marker}| ${pad(check.description, 40)}| ${pad(claimedLabel, 9)}| ${pad(actualLabel, 9)}| ${pad(gapLabel, 6)}|`);
    }
  }

  // Overall summary
  console.log("\n" + "=".repeat(90));
  console.log("  OVERALL SUMMARY");
  console.log("=".repeat(90) + "\n");

  const sHeader = `| ${pad("Task", 28)}| ${pad("Claimed", 10)}| ${pad("Actual", 10)}| ${pad("Gaps", 6)}| ${pad("Accuracy", 10)}|`;
  const sSep = `|${"-".repeat(30)}|${"-".repeat(12)}|${"-".repeat(12)}|${"-".repeat(8)}|${"-".repeat(12)}|`;
  console.log(sHeader);
  console.log(sSep);

  for (const v of verifications) {
    const accuracy = Math.round((v.actualPassing / v.totalChecks) * 100);
    const cLabel = v.claimedComplete ? "Done" : "Pending";
    const aLabel = v.actuallyComplete ? "Done" : "Incomplete";
    console.log(`| ${pad(v.taskName, 28)}| ${pad(cLabel, 10)}| ${pad(aLabel, 10)}| ${pad(String(v.gaps.length), 6)}| ${pad(accuracy + "%", 10)}|`);
  }

  const totalGaps = verifications.reduce((s, v) => s + v.gaps.length, 0);
  const falseVictories = verifications.filter((v) => v.claimedComplete && !v.actuallyComplete).length;

  console.log("\n  False victories: " + falseVictories + " of " + verifications.length + " tasks");
  console.log("  Total undetected gaps: " + totalGaps);
  console.log("\n  The agent declared 'done' on every task, but verification reveals " + totalGaps + " unmet criteria.");
  console.log("  Without explicit verification, premature victory declarations go unchecked.\n");
}

run();
