/**
 * split-vs-monolithic.ts
 *
 * Creates a monolithic instruction file (~200 lines) and then shows how
 * splitting into 4 focused files dramatically reduces the context needed
 * for any single query. Simulates an "agent" searching for a specific rule
 * and measures how many lines it must read in each approach.
 *
 * Run: npx tsx docs/lectures/lecture-04-why-one-giant-instruction-file-fails/code/split-vs-monolithic.ts
 */

// ---------------------------------------------------------------------------
// Simulated monolithic instruction file (200 lines of rules)
// ---------------------------------------------------------------------------

const monolithicInstructions: { lineNumber: number; section: string; content: string }[] = [];

// Section 1: Project Overview (lines 1-50)
for (let i = 1; i <= 50; i++) {
  monolithicInstructions.push({
    lineNumber: i,
    section: "Project Overview",
    content: i === 25 ? "This project uses React 18 with TypeScript strict mode." : `Overview detail line ${i}`,
  });
}

// Section 2: Code Style Rules (lines 51-100)
for (let i = 51; i <= 100; i++) {
  monolithicInstructions.push({
    lineNumber: i,
    section: "Code Style",
    content:
      i === 72
        ? "RULE: Always use explicit return types on exported functions."
        : i === 78
          ? "RULE: Use const assertions for immutable arrays."
          : `Style rule detail line ${i}`,
  });
}

// Section 3: Testing Standards (lines 101-150)
for (let i = 101; i <= 150; i++) {
  monolithicInstructions.push({
    lineNumber: i,
    section: "Testing",
    content:
      i === 120
        ? "RULE: Every new endpoint must have integration tests."
        : i === 135
          ? "RULE: Test files must mirror the source file structure."
          : `Testing detail line ${i}`,
  });
}

// Section 4: Deployment Rules (lines 151-200)
for (let i = 151; i <= 200; i++) {
  monolithicInstructions.push({
    lineNumber: i,
    section: "Deployment",
    content:
      i === 175
        ? "RULE: Never deploy on Fridays. Deploy window is Tue-Thu 10am-3pm."
        : `Deployment detail line ${i}`,
  });
}

// ---------------------------------------------------------------------------
// Split instruction files (4 focused files)
// ---------------------------------------------------------------------------

const splitInstructions: Record<string, { lineNumber: number; section: string; content: string }[]> = {
  "01-project-overview.md": monolithicInstructions.filter((l) => l.section === "Project Overview"),
  "02-code-style.md": monolithicInstructions.filter((l) => l.section === "Code Style"),
  "03-testing.md": monolithicInstructions.filter((l) => l.section === "Testing"),
  "04-deployment.md": monolithicInstructions.filter((l) => l.section === "Deployment"),
};

// ---------------------------------------------------------------------------
// Simulated queries -- the agent needs to find specific rules
// ---------------------------------------------------------------------------

interface Query {
  description: string;
  targetRule: string;
  relevantSection: string;
}

const queries: Query[] = [
  {
    description: "Find the rule about return types",
    targetRule: "explicit return types",
    relevantSection: "Code Style",
  },
  {
    description: "Find the deployment window rule",
    targetRule: "deploy on Fridays",
    relevantSection: "Deployment",
  },
  {
    description: "Find the integration test rule",
    targetRule: "integration tests",
    relevantSection: "Testing",
  },
  {
    description: "Find the test file structure rule",
    targetRule: "mirror the source file",
    relevantSection: "Testing",
  },
];

// ---------------------------------------------------------------------------
// Search simulation
// ---------------------------------------------------------------------------

function searchMonolithic(query: Query): { linesRead: number; found: boolean } {
  // Agent must scan from the top, reading each line until it finds the rule.
  // In the worst case it reads all lines.
  let linesRead = 0;
  let found = false;

  for (const line of monolithicInstructions) {
    linesRead++;
    if (line.content.toLowerCase().includes(query.targetRule.toLowerCase())) {
      found = true;
      break;
    }
  }

  return { linesRead, found };
}

function searchSplit(query: Query): { linesRead: number; found: boolean; fileAccessed: string } {
  // Agent knows which file to look in based on the section.
  // It only reads lines from that one file.
  const fileMap: Record<string, string> = {
    "Project Overview": "01-project-overview.md",
    "Code Style": "02-code-style.md",
    Testing: "03-testing.md",
    Deployment: "04-deployment.md",
  };

  const targetFile = fileMap[query.relevantSection];
  const lines = splitInstructions[targetFile];
  let linesRead = 0;
  let found = false;

  for (const line of lines) {
    linesRead++;
    if (line.content.toLowerCase().includes(query.targetRule.toLowerCase())) {
      found = true;
      break;
    }
  }

  return { linesRead, found, fileAccessed: targetFile };
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function run(): void {
  console.log("\n" + "=".repeat(90));
  console.log("  MONOLITHIC vs SPLIT INSTRUCTION FILES");
  console.log("=".repeat(90));

  console.log("\n  Monolithic file: 1 file, " + monolithicInstructions.length + " lines total");
  console.log("  Split files:     4 files, ~" + Math.round(monolithicInstructions.length / 4) + " lines each\n");

  const header = `| ${pad("Query", 42)}| ${pad("Monolithic (lines)", 20)}| ${pad("Split (lines)", 15)}| ${pad("File Accessed", 22)}| Savings`;
  const sep = `|${"-".repeat(44)}|${"-".repeat(22)}|${"-".repeat(17)}|${"-".repeat(24)}|${"-".repeat(10)}`;
  console.log(header);
  console.log(sep);

  let totalMono = 0;
  let totalSplit = 0;

  for (const q of queries) {
    const mono = searchMonolithic(q);
    const split = searchSplit(q);
    totalMono += mono.linesRead;
    totalSplit += split.linesRead;

    const savings = Math.round(((mono.linesRead - split.linesRead) / mono.linesRead) * 100);
    console.log(
      `| ${pad(q.description, 42)}| ${pad(String(mono.linesRead), 20)}| ${pad(String(split.linesRead), 15)}| ${pad(split.fileAccessed, 22)}| ${savings}%`
    );
  }

  console.log(sep);
  const avgMono = Math.round(totalMono / queries.length);
  const avgSplit = Math.round(totalSplit / queries.length);
  console.log(
    `| ${pad("AVERAGE", 42)}| ${pad(String(avgMono), 20)}| ${pad(String(avgSplit), 15)}| ${pad("(targeted file)", 22)}| ${Math.round(((avgMono - avgSplit) / avgMono) * 100)}%`
  );

  console.log("\n" + "=".repeat(90));
  console.log("  KEY INSIGHT");
  console.log("=".repeat(90));
  console.log("  With a monolithic file, the agent must scan up to " + monolithicInstructions.length + " lines for every query.");
  console.log("  With split files, it reads only the relevant " + Math.round(monolithicInstructions.length / 4) + "-line file.");
  console.log("  This means less context window usage, fewer hallucinations, and faster execution.\n");
}

run();
