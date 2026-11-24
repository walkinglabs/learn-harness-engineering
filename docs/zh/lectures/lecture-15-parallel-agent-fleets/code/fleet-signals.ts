/**
 * fleet-signals.ts
 *
 * Behavioral signals for an agent fleet. Runtime logs tell you what the
 * system did; these detectors tell you what each AGENT is doing, and
 * whether a human needs to look right now:
 *   - waiting on a human (the session is blocked, not done)
 *   - permission workaround (a denied tool, then "another approach")
 *   - stall (inactivity, separate from a long but active run)
 *   - retry depth past its cap
 *
 * The patterns are deliberately simple heuristics: tune them on your own
 * transcripts, and prefer false positives that a human dismisses over
 * silent misses.
 *
 * Run: npx tsx docs/zh/lectures/lecture-15-parallel-agent-fleets/code/fleet-signals.ts
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TranscriptEvent {
  at: number; // seconds since session start
  kind: "assistant" | "tool_call" | "tool_denied";
  text: string;
}

interface Session {
  id: string;
  events: TranscriptEvent[];
  retryChainDepth: number;
  now: number; // seconds since session start
  finished: boolean;
}

type Severity = "page" | "review" | "info";

interface Signal {
  session: string;
  signal: string;
  severity: Severity;
  evidence: string;
}

// Teaching defaults, not established thresholds.
const INACTIVITY_LIMIT_S = 10 * 60;
const RETRY_CHAIN_CAP = 2;

// ---------------------------------------------------------------------------
// Detectors
// ---------------------------------------------------------------------------

/** The final assistant message ends by asking the user something. */
function waitingOnHuman(s: Session): Signal | null {
  const last = [...s.events].reverse().find((e) => e.kind === "assistant");
  if (!s.finished || !last) return null;
  const tail = last.text.trim();
  const asks = /\?\s*$/.test(tail) || /\b(should I|do you want|which (one|option)|please confirm)\b/i.test(tail);
  return asks
    ? { session: s.id, signal: "waiting-on-human", severity: "page", evidence: tail.slice(-120) }
    : null;
}

/** A tool was denied and the agent pivots instead of stopping. */
const PIVOT = /\b(another approach|different approach|work ?around|instead,? (i'?ll|let me)|let me try)\b/i;
function permissionWorkaround(s: Session): Signal | null {
  for (let i = 0; i < s.events.length; i++) {
    const denied = s.events[i];
    if (denied.kind !== "tool_denied") continue;
    const pivot = s.events.slice(i + 1, i + 4).find((e) => e.kind === "assistant" && PIVOT.test(e.text));
    if (pivot) {
      return {
        session: s.id,
        signal: "permission-workaround",
        severity: "review",
        evidence: `denied: ${denied.text} | then: "${pivot.text.slice(0, 80)}"`,
      };
    }
  }
  return null;
}

/** No events for longer than the inactivity limit (independent of total runtime). */
function stalled(s: Session): Signal | null {
  if (s.finished) return null;
  const lastAt = s.events.length ? s.events[s.events.length - 1].at : 0;
  const idle = s.now - lastAt;
  return idle > INACTIVITY_LIMIT_S
    ? { session: s.id, signal: "stalled", severity: "page", evidence: `no activity for ${Math.round(idle / 60)} min` }
    : null;
}

function retryCapReached(s: Session): Signal | null {
  return s.retryChainDepth >= RETRY_CHAIN_CAP
    ? { session: s.id, signal: "retry-cap", severity: "review", evidence: `chain depth ${s.retryChainDepth}` }
    : null;
}

const DETECTORS = [waitingOnHuman, permissionWorkaround, stalled, retryCapReached];

export function scan(sessions: Session[]): Signal[] {
  const order: Record<Severity, number> = { page: 0, review: 1, info: 2 };
  return sessions
    .flatMap((s) => DETECTORS.map((d) => d(s)).filter((x): x is Signal => x !== null))
    .sort((a, b) => order[a.severity] - order[b.severity]);
}

// ---------------------------------------------------------------------------
// Demo: four sessions; a "completed" counter shows 3/4 finished and no alerts
// ---------------------------------------------------------------------------

const sessions: Session[] = [
  {
    id: "A",
    finished: true,
    retryChainDepth: 0,
    now: 900,
    events: [
      { at: 10, kind: "tool_call", text: "npm test" },
      { at: 600, kind: "assistant", text: "Tests pass. The export can be CSV or XLSX — which one do you want?" },
    ],
  },
  {
    id: "B",
    finished: true,
    retryChainDepth: 0,
    now: 1200,
    events: [
      { at: 30, kind: "tool_denied", text: "Bash(sqlite3 prod.db ...)" },
      { at: 35, kind: "assistant", text: "I'm blocked from sqlite3, let me try another approach with a small script." },
      { at: 900, kind: "assistant", text: "Done. Migrated the rows." },
    ],
  },
  {
    id: "C",
    finished: false,
    retryChainDepth: 0,
    now: 3000,
    events: [{ at: 120, kind: "tool_call", text: "cargo build --release" }],
  },
  {
    id: "D",
    finished: true,
    retryChainDepth: 2,
    now: 2000,
    events: [{ at: 1900, kind: "assistant", text: "Verification still failing on the same test." }],
  },
];

console.log("Completed counter: " + sessions.filter((s) => s.finished).length + "/4 finished\n");
console.log("Fleet signals, most urgent first:");
for (const sig of scan(sessions)) {
  console.log(`  [${sig.severity}] session ${sig.session}: ${sig.signal} — ${sig.evidence}`);
}
