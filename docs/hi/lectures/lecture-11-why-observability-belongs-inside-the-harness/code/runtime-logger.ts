/**
 * runtime-logger.ts
 *
 * A structured logging module demo. Shows ad-hoc console.log output vs
 * structured JSON log output when diagnosing a failure. Includes a seeded
 * failure scenario and demonstrates how structured logs pinpoint the issue
 * faster.
 *
 * Run: npx tsx docs/lectures/lecture-11-why-observability-belongs-inside-the-harness/code/runtime-logger.ts
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StructuredLogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  component: string;
  action: string;
  durationMs?: number;
  input?: unknown;
  output?: unknown;
  error?: string;
  correlationId: string;
}

// ---------------------------------------------------------------------------
// Simulated pipeline with a seeded failure
// ---------------------------------------------------------------------------

const CORRELATION_ID = "req-" + Math.random().toString(36).slice(2, 8);

// Simulated stages of a document Q&A pipeline
interface PipelineStage {
  component: string;
  action: string;
  durationMs: number;
  success: boolean;
  errorMessage?: string;
  input?: unknown;
  output?: unknown;
}

function runPipeline(): PipelineStage[] {
  return [
    {
      component: "DocumentLoader",
      action: "parse_upload",
      durationMs: 45,
      success: true,
      input: { filename: "report.pdf", size: "2.3MB" },
      output: { chunks: 47 },
    },
    {
      component: "ChunkIndexer",
      action: "embed_and_store",
      durationMs: 230,
      success: true,
      input: { chunks: 47 },
      output: { indexed: 47, embeddingDim: 1536 },
    },
    {
      component: "QueryRouter",
      action: "route_query",
      durationMs: 12,
      success: true,
      input: { query: "What is the revenue target?" },
      output: { routedTo: "RetrievalEngine" },
    },
    {
      // SEEDED FAILURE: Retrieval returns 0 results due to dimension mismatch
      component: "RetrievalEngine",
      action: "semantic_search",
      durationMs: 180,
      success: false,
      errorMessage: "Vector dimension mismatch: query embedding dim=768, index embedding dim=1536",
      input: { query: "What is the revenue target?", topK: 5 },
      output: { results: 0 },
    },
    {
      component: "AnswerGenerator",
      action: "generate_with_citations",
      durationMs: 1500,
      success: true, // Doesn't crash, but produces a bad answer
      input: { context: [], query: "What is the revenue target?" },
      output: { answer: "I could not find relevant information.", citations: 0 },
    },
  ];
}

// ---------------------------------------------------------------------------
// Ad-hoc logging (console.log style)
// ---------------------------------------------------------------------------

function printAdHocLog(stages: PipelineStage[]): void {
  console.log("Starting document Q&A pipeline...");
  console.log("User uploaded report.pdf");

  for (const stage of stages) {
    if (stage.success) {
      console.log(`${stage.component}: ${stage.action} done (${stage.durationMs}ms)`);
    } else {
      console.log(`${stage.component}: something went wrong`);
    }
  }

  console.log("Pipeline finished. Answer: I could not find relevant information.");
}

// ---------------------------------------------------------------------------
// Structured logging (JSON)
// ---------------------------------------------------------------------------

function printStructuredLog(stages: PipelineStage[]): StructuredLogEntry[] {
  const entries: StructuredLogEntry[] = [];

  for (const stage of stages) {
    entries.push({
      timestamp: new Date().toISOString(),
      level: stage.success ? "info" : "error",
      component: stage.component,
      action: stage.action,
      durationMs: stage.durationMs,
      input: stage.input,
      output: stage.output,
      error: stage.errorMessage,
      correlationId: CORRELATION_ID,
    });
  }

  return entries;
}

// ---------------------------------------------------------------------------
// Diagnose failure from structured logs
// ---------------------------------------------------------------------------

function diagnoseFromStructured(entries: StructuredLogEntry[]): string[] {
  const diagnosis: string[] = [];

  // Find errors
  const errors = entries.filter((e) => e.level === "error");
  if (errors.length > 0) {
    diagnosis.push("ERRORS FOUND:");
    for (const err of errors) {
      diagnosis.push(`  - ${err.component}.${err.action}: ${err.error}`);
    }
  }

  // Check for latency spikes
  const slowStages = entries.filter((e) => (e.durationMs ?? 0) > 1000);
  if (slowStages.length > 0) {
    diagnosis.push("LATENCY SPIKES:");
    for (const s of slowStages) {
      diagnosis.push(`  - ${s.component}.${s.action}: ${s.durationMs}ms`);
    }
  }

  // Check for cascading failures
  const emptyOutputs = entries.filter((e) => {
    const out = e.output as Record<string, unknown> | undefined;
    return out && typeof out === "object" && "results" in out && (out.results as number) === 0;
  });
  if (emptyOutputs.length > 0) {
    diagnosis.push("EMPTY OUTPUTS (possible cascade):");
    for (const e of emptyOutputs) {
      diagnosis.push(`  - ${e.component}.${e.action}: returned 0 results`);
    }
  }

  return diagnosis;
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function run(): void {
  const pipeline = runPipeline();

  console.log("\n" + "=".repeat(90));
  console.log("  OBSERVABILITY DEMO -- Ad-hoc vs Structured Logging");
  console.log("=".repeat(90));

  // --- Ad-hoc output ---
  console.log("\n" + "-".repeat(90));
  console.log("  SCENARIO A: Ad-hoc console.log output");
  console.log("-".repeat(90) + "\n");
  printAdHocLog(pipeline);
  console.log("\n  Diagnosis from ad-hoc logs: ??? Hard to tell what went wrong.");
  console.log("  The failure message is vague: 'something went wrong'.");
  console.log("  No dimensions, no input/output data, no correlation ID.");

  // --- Structured output ---
  console.log("\n" + "-".repeat(90));
  console.log("  SCENARIO B: Structured JSON log output");
  console.log("-".repeat(90) + "\n");

  const structuredEntries = printStructuredLog(pipeline);

  const header = `| ${pad("Timestamp", 26)}| ${pad("Level", 6)}| ${pad("Component", 20)}| ${pad("Action", 25)}| ${pad("Duration", 9)}| Error?`;
  const sep = `|${"-".repeat(28)}|${"-".repeat(8)}|${"-".repeat(22)}|${"-".repeat(27)}|${"-".repeat(11)}|${"-".repeat(30)}`;
  console.log(header);
  console.log(sep);

  for (const entry of structuredEntries) {
    const hasError = entry.error ? entry.error.slice(0, 30) : "";
    const marker = entry.level === "error" ? ">>" : "  ";
    console.log(
      `${marker}| ${pad(entry.timestamp, 26)}| ${pad(entry.level, 6)}| ${pad(entry.component, 20)}| ${pad(entry.action, 25)}| ${pad(String(entry.durationMs) + "ms", 9)}| ${hasError}`
    );
  }

  // --- Diagnosis ---
  console.log("\n" + "-".repeat(90));
  console.log("  AUTOMATED DIAGNOSIS FROM STRUCTURED LOGS");
  console.log("-".repeat(90) + "\n");

  const errors = structuredEntries.filter((e) => e.level === "error");
  for (const err of errors) {
    console.log(`  ROOT CAUSE: ${err.component}.${err.action}`);
    console.log(`  Error: ${err.error}`);
    console.log(`  Input: ${JSON.stringify(err.input)}`);
    console.log(`  Output: ${JSON.stringify(err.output)}`);
    console.log(`  Correlation ID: ${err.correlationId}`);
  }

  // Downstream impact
  console.log("\n  DOWNSTREAM IMPACT:");
  const answerGen = structuredEntries.find((e) => e.component === "AnswerGenerator");
  if (answerGen) {
    const out = answerGen.output as Record<string, unknown>;
    console.log(`  AnswerGenerator received empty context (${JSON.stringify(answerGen.input)})`);
    console.log(`  Produced answer: "${out.answer}" with ${out.citations} citations`);
  }

  // Comparison summary
  console.log("\n" + "=".repeat(90));
  console.log("  COMPARISON");
  console.log("=".repeat(90) + "\n");

  const cHeader = `| ${pad("Metric", 35)}| ${pad("Ad-hoc Logs", 18)}| ${pad("Structured Logs", 18)}|`;
  const cSep = `|${"-".repeat(37)}|${"-".repeat(20)}|${"-".repeat(20)}|`;
  console.log(cHeader);
  console.log(cSep);
  console.log(`| ${pad("Root cause identifiable", 35)}| ${pad("No", 18)}| ${pad("Yes", 18)}|`);
  console.log(`| ${pad("Input/output traceable", 35)}| ${pad("No", 18)}| ${pad("Yes", 18)}|`);
  console.log(`| ${pad("Correlation across steps", 35)}| ${pad("No", 18)}| ${pad("Yes", 18)}|`);
  console.log(`| ${pad("Machine-parseable", 35)}| ${pad("No", 18)}| ${pad("Yes", 18)}|`);
  console.log(`| ${pad("Time to diagnose", 35)}| ${pad("Minutes (manual)", 18)}| ${pad("Seconds (auto)", 18)}|`);

  console.log("\n  Structured logging transforms debugging from guesswork into a deterministic lookup.\n");
}

run();
