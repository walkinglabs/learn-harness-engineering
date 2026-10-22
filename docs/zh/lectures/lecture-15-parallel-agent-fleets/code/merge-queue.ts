/**
 * merge-queue.ts
 *
 * A per-repository merge queue for an agent fleet, simulated in memory.
 * Each approved branch passed its own checks against an OLD base. The queue
 * merges one branch at a time, rebases it onto the latest base, and re-runs
 * the deterministic checks on the COMBINED result before landing it.
 *
 * Scenario: session B renames `formatUser` -> `formatAccount`; session C,
 * branched from the same base, adds new calls to `formatUser`. Each branch
 * is green alone. Together they break the build.
 *
 * Run: npx tsx docs/zh/lectures/lecture-15-parallel-agent-fleets/code/merge-queue.ts
 */

// ---------------------------------------------------------------------------
// A tiny "repository": file path -> contents
// ---------------------------------------------------------------------------

type Tree = Record<string, string>;

interface Branch {
  session: string;
  base: Tree; // the base the session started from
  tree: Tree; // the session's result
}

interface CheckResult {
  ok: boolean;
  evidence: string[];
}

/** Deterministic "build": every called function must be defined somewhere. */
function runChecks(tree: Tree): CheckResult {
  const source = Object.values(tree).join("\n");
  const defined = new Set([...source.matchAll(/function (\w+)\(/g)].map((m) => m[1]));
  const called = [...source.matchAll(/(\w+)\(/g)]
    .map((m) => m[1])
    .filter((name) => name !== "function" && !/^[A-Z]/.test(name));
  const missing = [...new Set(called.filter((name) => !defined.has(name)))];
  return missing.length === 0
    ? { ok: true, evidence: ["build: all calls resolve"] }
    : { ok: false, evidence: missing.map((name) => `build: '${name}' is not defined`) };
}

/** Three-way merge at file granularity. Conflicts when both sides changed the same file differently. */
function rebase(branch: Branch, latest: Tree): { tree: Tree; conflicts: string[] } {
  const tree: Tree = { ...latest };
  const conflicts: string[] = [];
  for (const path of new Set([...Object.keys(branch.tree), ...Object.keys(latest)])) {
    const base = branch.base[path];
    const ours = branch.tree[path];
    const theirs = latest[path];
    if (ours === base) continue; // session didn't touch it: keep latest
    if (theirs === base || theirs === ours) {
      if (ours === undefined) delete tree[path];
      else tree[path] = ours;
      continue;
    }
    conflicts.push(path);
  }
  return { tree, conflicts };
}

// ---------------------------------------------------------------------------
// The queue: one merge at a time per repository
// ---------------------------------------------------------------------------

class MergeQueue {
  private queue: Branch[] = [];
  private busy = false;
  constructor(public main: Tree, private log: (line: string) => void) {}

  enqueue(branch: Branch): void {
    this.queue.push(branch);
    this.log(`queued   ${branch.session} (position ${this.queue.length})`);
    if (!this.busy) this.drain();
  }

  private drain(): void {
    this.busy = true;
    while (this.queue.length > 0) {
      const branch = this.queue.shift()!;
      const { tree, conflicts } = rebase(branch, this.main);
      if (conflicts.length > 0) {
        // Source conflicts go to a resolver agent with both intents, or to a human.
        this.log(`conflict ${branch.session}: ${conflicts.join(", ")} -> resolver / human`);
        continue;
      }
      const result = runChecks(tree); // verify the COMBINATION, not the branch
      if (!result.ok) {
        this.log(`rejected ${branch.session}: ${result.evidence.join("; ")} -> back to session with evidence`);
        continue;
      }
      this.main = tree;
      this.log(`merged   ${branch.session}: ${result.evidence.join("; ")}`);
    }
    this.busy = false;
  }
}

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

const base: Tree = {
  "user.ts": "function formatUser(u) { return u.name; }",
  "profile.ts": "function renderProfile(u) { return formatUser(u); }",
};

const sessionB: Branch = {
  session: "session-B (rename formatUser -> formatAccount)",
  base,
  tree: {
    "user.ts": "function formatAccount(u) { return u.name; }",
    "profile.ts": "function renderProfile(u) { return formatAccount(u); }",
  },
};

const sessionC: Branch = {
  session: "session-C (add a header that calls formatUser)",
  base,
  tree: { ...base, "header.ts": "function renderHeader(u) { return formatUser(u); }" },
};

console.log("Each branch checked alone, against the base it started from:");
for (const b of [sessionB, sessionC]) {
  console.log(`  ${b.session}: ${runChecks(b.tree).ok ? "PASS" : "FAIL"}`);
}

console.log("\nThrough the merge queue (re-verified after rebase):");
const queue = new MergeQueue(base, (line) => console.log(`  ${line}`));
queue.enqueue(sessionB);
queue.enqueue(sessionC);

console.log(`\nmain still builds: ${runChecks(queue.main).ok ? "yes" : "no"}`);
