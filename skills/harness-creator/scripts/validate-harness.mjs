#!/usr/bin/env node
import path from 'node:path';
import {
  formatScoreReport,
  htmlReport,
  loadHarnessFiles,
  parseArgs,
  scoreHarness,
  writeText
} from './lib/harness-utils.mjs';

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(`Usage: node scripts/validate-harness.mjs [--target DIR] [--json] [--html FILE]

Scores the project-contract foundation, five harness subsystems, and traceability:
  projectModel, instructions, state, verification, scope, lifecycle, traceability

Exit code is 0 when the overall score reaches --min-score (default 70) and both
projectModel and traceability reach --min-contract-score (default 5/5).`);
  process.exit(0);
}

const target = path.resolve(args.target || args._[0] || process.cwd());
const minScore = Number(args.minScore || 70);
const minContractScore = Number(args.minContractScore || 5);
const files = await loadHarnessFiles(target);
const result = scoreHarness(files);

if (args.html) {
  const htmlPath = path.resolve(args.html);
  await writeText(htmlPath, htmlReport(result, `Harness Assessment: ${path.basename(target)}`));
  console.log(`HTML report written to ${htmlPath}`);
}

if (args.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(formatScoreReport(result, target));
}

if (
  result.overall < minScore
  || result.subsystems.projectModel.score < minContractScore
  || result.subsystems.traceability.score < minContractScore
) {
  process.exitCode = 1;
}
