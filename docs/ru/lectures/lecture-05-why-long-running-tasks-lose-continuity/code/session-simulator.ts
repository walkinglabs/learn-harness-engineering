/**
 * session-simulator.ts
 *
 * Simulates two sessions working on a multi-step task.
 *   Run 1: No handoff file -- Session B starts from scratch and duplicates work.
 *   Run 2: With handoff file -- Session B picks up where Session A left off.
 *
 * Run: npx tsx docs/lectures/lecture-05-why-long-running-tasks-lose-continuity/code/session-simulator.ts
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TaskStep {
  id: number;
  name: string;
  durationMs: number;
}

interface SessionResult {
  session: string;
  stepsCompleted: number;
  totalDurationMs: number;
  duplicatedSteps: number;
  output: string[];
}

// ---------------------------------------------------------------------------
// Task definition
// ---------------------------------------------------------------------------

const taskSteps: TaskStep[] = [
  { id: 1, name: "Read project structure", durationMs: 50 },
  { id: 2, name: "Understand existing auth module", durationMs: 80 },
  { id: 3, name: "Design new search endpoint", durationMs: 60 },
  { id: 4, name: "Implement search endpoint", durationMs: 100 },
  { id: 5, name: "Write integration tests", durationMs: 70 },
  { id: 6, name: "Update documentation", durationMs: 40 },
];

// ---------------------------------------------------------------------------
// Simulated session executor
// ---------------------------------------------------------------------------

/** Simulate a session doing work. */
function runSession(
  sessionName: string,
  startStep: number,
  endStep: number
): SessionResult {
  const output: string[] = [];
  let totalDuration = 0;

  for (let i = startStep; i <= endStep; i++) {
    const step = taskSteps.find((s) => s.id === i)!;
    totalDuration += step.durationMs;
    output.push(`  [${sessionName}] Step ${step.id}: ${step.name} (${step.durationMs}ms)`);
  }

  return {
    session: sessionName,
    stepsCompleted: endStep - startStep + 1,
    totalDurationMs: totalDuration,
    duplicatedSteps: 0,
    output,
  };
}

// ---------------------------------------------------------------------------
// Run 1: No handoff file
// ---------------------------------------------------------------------------

function simulateNoHandoff(): { sessionA: SessionResult; sessionB: SessionResult } {
  // Session A does steps 1-3 before timing out
  const sessionA = runSession("Session A", 1, 3);

  // Session B has no context, starts from scratch
  const sessionB = runSession("Session B", 1, 6);
  sessionB.duplicatedSteps = 3; // Redoes steps 1-3 that A already did

  return { sessionA, sessionB };
}

// ---------------------------------------------------------------------------
// Run 2: With handoff file
// ---------------------------------------------------------------------------

function simulateWithHandoff(): { sessionA: SessionResult; sessionB: SessionResult } {
  // Session A does steps 1-3 and writes a handoff file
  const sessionA = runSession("Session A", 1, 3);

  // Session B reads handoff, starts from step 4
  const sessionB = runSession("Session B", 4, 6);
  sessionB.duplicatedSteps = 0;

  return { sessionA, sessionB };
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function printRun(title: string, result: { sessionA: SessionResult; sessionB: SessionResult }): void {
  console.log("\n" + "=".repeat(80));
  console.log(`  ${title}`);
  console.log("=".repeat(80));

  console.log("\n  Session A output:");
  for (const line of result.sessionA.output) {
    console.log(line);
  }

  console.log("\n  Session B output:");
  for (const line of result.sessionB.output) {
    console.log(line);
  }

  console.log("\n  Session B notes:");
  if (result.sessionB.duplicatedSteps > 0) {
    console.log(`    - Redid ${result.sessionB.duplicatedSteps} steps that Session A already completed`);
    console.log(`    - Wasted ${result.sessionB.totalDurationMs - (taskSteps.slice(3).reduce((s, t) => s + t.durationMs, 0))}ms on duplicate work`);
  } else {
    console.log("    - Read handoff file, continued from step 4");
    console.log("    - No duplicate work performed");
  }
}

function printComparison(): void {
  const noHandoff = simulateNoHandoff();
  const withHandoff = simulateWithHandoff();

  printRun("RUN 1: NO HANDOFF FILE", noHandoff);
  printRun("RUN 2: WITH HANDOFF FILE", withHandoff);

  // Comparison table
  console.log("\n" + "=".repeat(80));
  console.log("  COMPARISON TABLE");
  console.log("=".repeat(80) + "\n");

  const header = `| ${pad("Metric", 35)}| ${pad("No Handoff", 15)}| ${pad("With Handoff", 15)}|`;
  const sep = `|${"-".repeat(37)}|${"-".repeat(17)}|${"-".repeat(17)}|`;
  console.log(header);
  console.log(sep);

  const noTotal = noHandoff.sessionA.totalDurationMs + noHandoff.sessionB.totalDurationMs;
  const withTotal = withHandoff.sessionA.totalDurationMs + withHandoff.sessionB.totalDurationMs;

  console.log(`| ${pad("Session A steps completed", 35)}| ${pad(String(noHandoff.sessionA.stepsCompleted), 15)}| ${pad(String(withHandoff.sessionA.stepsCompleted), 15)}|`);
  console.log(`| ${pad("Session B steps completed", 35)}| ${pad(String(noHandoff.sessionB.stepsCompleted), 15)}| ${pad(String(withHandoff.sessionB.stepsCompleted), 15)}|`);
  console.log(`| ${pad("Duplicated steps", 35)}| ${pad(String(noHandoff.sessionB.duplicatedSteps), 15)}| ${pad(String(withHandoff.sessionB.duplicatedSteps), 15)}|`);
  console.log(`| ${pad("Total work (ms)", 35)}| ${pad(String(noTotal), 15)}| ${pad(String(withTotal), 15)}|`);
  console.log(`| ${pad("Time saved by handoff", 35)}| ${pad("-", 15)}| ${pad(String(noTotal - withTotal) + "ms", 15)}|`);

  console.log("\n  A handoff file eliminates duplicate work and ensures continuity across sessions.\n");
}

printComparison();
