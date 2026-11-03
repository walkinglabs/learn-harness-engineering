/**
 * failure-pattern-demo.ts
 *
 * Simulates the 4-step failure pattern that capable agents fall into:
 *   1. Incomplete context
 *   2. Locally reasonable changes
 *   3. No global verification
 *   4. Premature completion
 *
 * Run: npx tsx docs/lectures/lecture-01-why-capable-agents-still-fail/code/failure-pattern-demo.ts
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StepState {
  step: number;
  name: string;
  contextAvailable: string[];
  contextMissing: string[];
  actionTaken: string;
  localOutcome: string;
  globalImpact: string;
  completed: boolean;
}

// ---------------------------------------------------------------------------
// Simulated "model" -- a simple decision function that bases its output
// solely on whatever context it has been given.
// ---------------------------------------------------------------------------

function modelDecide(context: string[], task: string): string {
  const has = (s: string) => context.some((c) => c.includes(s));

  // The task is to "add a search endpoint to the API".
  // Correct answer requires knowing about auth middleware and rate limiting.

  if (!has("auth")) {
    return "Created new route handler /search without authentication checks";
  }
  if (!has("rate-limit")) {
    return "Added search route with auth but forgot rate limiting";
  }
  if (!has("test-standards")) {
    return "Implemented search with auth and rate-limit, but no tests";
  }
  return "Fully implemented search endpoint with auth, rate-limit, and tests";
}

// ---------------------------------------------------------------------------
// Failure simulation
// ---------------------------------------------------------------------------

function simulateFailurePattern(): StepState[] {
  const steps: StepState[] = [];

  // ---- Step 1: Incomplete Context ----
  const step1Context = ["project structure", "route definitions"];
  const step1Missing = ["auth middleware", "rate-limiting policy", "test standards"];
  const step1Decision = modelDecide(step1Context, "add search endpoint");

  steps.push({
    step: 1,
    name: "Incomplete Context",
    contextAvailable: step1Context,
    contextMissing: step1Missing,
    actionTaken: step1Decision,
    localOutcome: "Looks good -- route compiles, returns data",
    globalImpact: "Missing auth means unauthenticated access to search",
    completed: false,
  });

  // ---- Step 2: Locally Reasonable Changes ----
  // The agent adds auth after a hint, but still lacks other context.
  const step2Context = [...step1Context, "auth middleware"];
  const step2Missing = ["rate-limiting policy", "test standards"];
  const step2Decision = modelDecide(step2Context, "add search endpoint");

  steps.push({
    step: 2,
    name: "Locally Reasonable Changes",
    contextAvailable: step2Context,
    contextMissing: step2Missing,
    actionTaken: step2Decision,
    localOutcome: "Route has auth -- looks complete locally",
    globalImpact: "No rate limiting means the endpoint can be abused",
    completed: false,
  });

  // ---- Step 3: No Global Verification ----
  const step3Context = [...step2Context, "rate-limiting policy"];
  const step3Missing = ["test standards"];
  const step3Decision = modelDecide(step3Context, "add search endpoint");

  steps.push({
    step: 3,
    name: "No Global Verification",
    contextAvailable: step3Context,
    contextMissing: step3Missing,
    actionTaken: step3Decision,
    localOutcome: "Feature appears fully implemented",
    globalImpact: "No tests -- regression risk, violates project standards",
    completed: false,
  });

  // ---- Step 4: Premature Completion ----
  steps.push({
    step: 4,
    name: "Premature Completion",
    contextAvailable: step3Context,
    contextMissing: step3Missing,
    actionTaken: 'Agent outputs: "Done. Added search endpoint."',
    localOutcome: "Agent is satisfied, task marked complete",
    globalImpact: "Task is incomplete -- missing tests, no E2E verification",
    completed: true,
  });

  return steps;
}

// ---------------------------------------------------------------------------
// Comparison table
// ---------------------------------------------------------------------------

function printComparisonTable(steps: StepState[]): void {
  console.log("\n" + "=".repeat(90));
  console.log("  FAILURE PATTERN DEMO -- 4 Steps to a Broken Deliverable");
  console.log("=".repeat(90));

  for (const s of steps) {
    console.log(`\n  Step ${s.step}: ${s.name}`);
    console.log("  " + "-".repeat(60));
    console.log(`  Context available : ${s.contextAvailable.join(", ")}`);
    console.log(`  Context missing   : ${s.contextMissing.join(", ") || "(none)"}`);
    console.log(`  Action taken      : ${s.actionTaken}`);
    console.log(`  Local outcome     : ${s.localOutcome}`);
    console.log(`  Global impact     : ${s.globalImpact}`);
    console.log(`  Marked complete?  : ${s.completed ? "YES (premature)" : "No"}`);
  }

  // Summary comparison
  console.log("\n" + "=".repeat(90));
  console.log("  COMPARISON: What the agent saw vs. what was actually needed");
  console.log("=".repeat(90));

  const totalRequired = ["project structure", "route definitions", "auth middleware", "rate-limiting policy", "test standards"];
  const finalAvailable = steps[steps.length - 1].contextAvailable;

  const header = "| Criterion              | Available | Missing | Status   |";
  const sep = "|------------------------|-----------|---------|----------|";
  console.log("\n" + header);
  console.log(sep);

  for (const item of totalRequired) {
    const avail = finalAvailable.includes(item);
    const row = `| ${item.padEnd(23)}| ${(avail ? "Yes" : "No").padEnd(10)}| ${(!avail ? "Yes" : "").padEnd(8)}| ${(avail ? "OK" : "GAP").padEnd(9)}|`;
    console.log(row);
  }

  const gapCount = totalRequired.filter((i) => !finalAvailable.includes(i)).length;
  console.log("\n  Result: Agent completed with " + gapCount + " of " + totalRequired.length + " context items missing.");
  console.log("  This is the core failure pattern: each step looked reasonable in isolation.\n");
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

printComparisonTable(simulateFailurePattern());
