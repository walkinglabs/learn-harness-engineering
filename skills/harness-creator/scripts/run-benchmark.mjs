#!/usr/bin/env node
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import {
  formatScoreReport,
  htmlReport,
  loadHarnessFiles,
  parseArgs,
  readJson,
  deriveFeatureList,
  scoreHarness,
  writeText
} from './lib/harness-utils.mjs';

const execFileAsync = promisify(execFile);
const SELF_CHECK_SOURCE = 'A saved UTF-8 note is retrieved byte-for-byte.\n';

const args = parseArgs(process.argv.slice(2));
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDir, '..');

if (args.help) {
  console.log(`Usage: node scripts/run-benchmark.mjs [--target DIR] [--output FILE] [--html FILE] [--no-self-check]

Runs a lightweight harness benchmark:
  1. Self-check: refuse premature generation, then derive a throwaway harness from a reviewed model.
  2. Scores the current target harness.
  3. Checks eval coverage in evals/evals.json.
  4. Produces a JSON report and optional HTML report.

This checks structural traceability, not semantic truth and not LLM effectiveness. Use it before/after real agent sessions.`);
  process.exit(0);
}

const target = path.resolve(args.target || args._[0] || process.cwd());
const output = path.resolve(args.output || path.join(target, 'harness-benchmark.json'));
const evalPath = path.resolve(args.evals || path.join(skillRoot, 'evals', 'evals.json'));

const harnessResult = scoreHarness(await loadHarnessFiles(target));
const evals = await readJson(evalPath);
const evalResult = scoreEvals(evals);
const selfCheck = args.noSelfCheck ? { skipped: true } : await runSelfCheck();
const report = {
  generatedAt: new Date().toISOString(),
  target,
  selfCheck,
  harness: harnessResult,
  evals: evalResult,
  recommendation: recommend(harnessResult, evalResult)
};

await writeText(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Benchmark report written to ${output}`);
console.log('');
if (!selfCheck.skipped) {
    console.log(`Self-check: ${selfCheck.pass ? 'PASS' : 'FAIL'} — premature generation refused: ${selfCheck.prematureGenerationRefused ? 'yes' : 'no'}; draft model refused: ${selfCheck.draftModelRefused ? 'yes' : 'no'}; stale source refused: ${selfCheck.staleSourceRefused ? 'yes' : 'no'}; stale source lowered score: ${selfCheck.staleSourceScoreRefused ? 'yes' : 'no'}; broken traceability refused: ${selfCheck.brokenTraceabilityRefused ? 'yes' : 'no'}; stale existing state refused: ${selfCheck.staleExistingStateRefused ? 'yes' : 'no'}; derived harness scored ${selfCheck.score}/100`);
  if (!selfCheck.pass && selfCheck.error) console.log(`  ${selfCheck.error}`);
}
console.log(formatScoreReport(harnessResult, target));
console.log(`Eval coverage: ${evalResult.score}/100 (${evalResult.passed}/${evalResult.total})`);
console.log(`Recommendation: ${report.recommendation}`);

if (args.html) {
  const htmlPath = path.resolve(args.html);
  await writeText(htmlPath, renderBenchmarkHtml(report));
  console.log(`HTML benchmark report written to ${htmlPath}`);
}

if (
    harnessResult.overall < Number(args.minScore || 70) ||
    harnessResult.subsystems.projectModel.score < Number(args.minContractScore || 5) ||
    harnessResult.subsystems.traceability.score < Number(args.minContractScore || 5) ||
    evalResult.score < Number(args.minEvalScore || 80) ||
    selfCheck.pass === false
) {
  process.exitCode = 1;
}

// Prove the bundled scripts actually work end-to-end: refuse incomplete inputs, derive a
// reviewed contract into a throwaway harness, break its links, then score it. Eval coverage can't catch a broken
// create-harness.mjs — this can. Failure here means the skill ships broken, not just thin.
async function runSelfCheck() {
  let dir;
  try {
    dir = await mkdtemp(path.join(os.tmpdir(), 'harness-selfcheck-'));
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'selfcheck', scripts: { check: 'tsc', test: 'vitest run', build: 'vite build' } })
    );
    await writeFile(path.join(dir, 'README.md'), SELF_CHECK_SOURCE);
    let prematureGenerationRefused = false;
    try {
      await execFileAsync('node', [path.join(scriptDir, 'create-harness.mjs'), '--target', dir]);
    } catch (error) {
      prematureGenerationRefused = error.code === 2;
    }
    await execFileAsync('node', [path.join(scriptDir, 'create-harness.mjs'), '--target', dir, '--scaffold-only']);
    let draftModelRefused = false;
    try {
      await execFileAsync('node', [path.join(scriptDir, 'create-harness.mjs'), '--target', dir]);
    } catch (error) {
      draftModelRefused = error.code === 2;
    }
    await writeFile(path.join(dir, 'project-model.json'), JSON.stringify(selfCheckProjectModel(), null, 2));
    await execFileAsync('node', [path.join(scriptDir, 'create-harness.mjs'), '--target', dir]);
    await execFileAsync('node', [path.join(dir, 'scripts', 'harness', 'validate-project-contract.mjs'), dir]);
    await writeFile(path.join(dir, 'README.md'), 'Changed after the project model was reviewed.\n');
    let staleSourceRefused = false;
    try {
      await execFileAsync('node', [path.join(dir, 'scripts', 'harness', 'validate-project-contract.mjs'), dir]);
    } catch (error) {
      staleSourceRefused = error.code === 1;
    }
    const staleSourceScoreRefused = scoreHarness(await loadHarnessFiles(dir)).subsystems.projectModel.score < 5;
    await writeFile(path.join(dir, 'README.md'), SELF_CHECK_SOURCE);
    const featurePath = path.join(dir, 'feature_list.json');
    const featureState = JSON.parse(await readFile(featurePath, 'utf8'));
    featureState.features[0].requirementRefs = ['req-does-not-exist'];
    await writeFile(featurePath, JSON.stringify(featureState, null, 2));
    let brokenTraceabilityRefused = false;
    try {
      await execFileAsync('node', [path.join(dir, 'scripts', 'harness', 'validate-project-contract.mjs'), dir]);
    } catch (error) {
      brokenTraceabilityRefused = error.code === 1;
    }
    let staleExistingStateRefused = false;
    try {
      await execFileAsync('node', [path.join(scriptDir, 'create-harness.mjs'), '--target', dir]);
    } catch (error) {
      staleExistingStateRefused = error.code === 2;
    }
    const cleanFeatureState = deriveSelfCheckFeatureState();
    await writeFile(featurePath, JSON.stringify(cleanFeatureState, null, 2));
    const scored = scoreHarness(await loadHarnessFiles(dir));
    return {
      pass: prematureGenerationRefused && draftModelRefused && staleSourceRefused && staleSourceScoreRefused && brokenTraceabilityRefused && staleExistingStateRefused && scored.overall >= Number(args.minSelfCheckScore || 90),
      prematureGenerationRefused,
      draftModelRefused,
      staleSourceRefused,
      staleSourceScoreRefused,
      brokenTraceabilityRefused,
      staleExistingStateRefused,
      score: scored.overall,
      bottleneck: scored.bottleneck
    };
  } catch (error) {
    return { pass: false, score: 0, error: error.message };
  } finally {
    if (dir) await rm(dir, { recursive: true, force: true });
  }
}

function deriveSelfCheckFeatureState() {
  return deriveFeatureList(selfCheckProjectModel());
}

function selfCheckProjectModel() {
  return {
    $schema: './project-model.schema.json',
    modelVersion: 1,
    reviewStatus: 'reviewed',
    purpose: 'Let a user save and retrieve a note reliably.',
    sources: [{ id: 'src-001', path: 'README.md', kind: 'requirements', authority: 'contract', revision: `sha256:${createHash('sha256').update(SELF_CHECK_SOURCE).digest('hex')}`, notes: '' }],
    vocabulary: [],
    capabilities: [{
      id: 'cap-notes',
      name: 'Note persistence',
      description: 'A user can save a note and retrieve the same content.',
      inputs: ['note text'],
      outputs: ['stored note'],
      dependencies: [],
      boundaries: ['single-user local storage']
    }],
    requirements: [{
      id: 'req-save-note',
      statement: 'Saved note text is returned unchanged.',
      state: 'confirmed',
      sourceRefs: ['src-001'],
      capabilityRefs: ['cap-notes'],
      acceptanceCriteria: [{ id: 'ac-note-roundtrip', statement: 'A saved UTF-8 note is retrieved byte-for-byte.' }]
    }],
    verificationPlan: [{
      id: 'ver-note-roundtrip',
      acceptanceCriteriaRefs: ['ac-note-roundtrip'],
      kind: 'integration-test',
      procedure: 'npm test -- note-roundtrip',
      expected: 'The retrieved bytes equal the saved bytes.',
      evidencePath: 'artifacts/note-roundtrip.json'
    }],
    unknowns: [],
    decisions: []
  };
}

function scoreEvals(evalsJson) {
  const cases = Array.isArray(evalsJson.evals) ? evalsJson.evals : [];
  const checks = [];
  checks.push({ pass: cases.length >= 10, message: 'At least 10 eval cases' });
  checks.push({ pass: cases.some((item) => /minimal|creation/i.test(item.name)), message: 'Covers minimal harness creation' });
  checks.push({ pass: cases.some((item) => /session|continuity/i.test(item.name)), message: 'Covers session continuity' });
  checks.push({ pass: cases.some((item) => /assessment|score/i.test(item.name)), message: 'Covers harness assessment' });
  checks.push({ pass: cases.some((item) => /verification/i.test(item.name)), message: 'Covers verification workflow' });
  checks.push({ pass: cases.some((item) => /memory/i.test(item.name)), message: 'Covers memory taxonomy' });
  checks.push({ pass: cases.some((item) => /tool|permission|safety/i.test(item.name)), message: 'Covers tool safety' });
  checks.push({ pass: cases.some((item) => /multi-agent|delegation|coordination/i.test(item.name)), message: 'Covers multi-agent coordination' });
  checks.push({ pass: cases.some((item) => /discover|project model/i.test(item.name)), message: 'Covers discovery and project modelling before generation' });
  checks.push({ pass: cases.some((item) => /uncertainty|unknown|decision/i.test(item.name)), message: 'Covers confirmed, inferred, and unresolved requirements' });
  checks.push({ pass: cases.some((item) => /traceability|requirement-linked/i.test(item.name)), message: 'Covers requirement-to-evidence traceability' });
  checks.push({ pass: cases.some((item) => /premature|refusal/i.test(item.name)), message: 'Covers refusal to generate an authoritative harness too early' });
  checks.push({ pass: cases.every((item) => item.prompt && item.expected_output && Array.isArray(item.expectations)), message: 'Each eval has prompt, expected output, expectations' });
  checks.push({ pass: cases.every((item) => item.expectations?.length >= 3), message: 'Each eval has at least three expectation checks' });

  const passed = checks.filter((check) => check.pass).length;
  return {
    score: Math.round((passed / checks.length) * 100),
    passed,
    total: checks.length,
    cases: cases.length,
    checks
  };
}

function recommend(harnessResult, evalResult) {
  if (harnessResult.subsystems.projectModel?.score < 5) {
    return 'Discover and review the project model before treating the harness as authoritative.';
  }
  if (harnessResult.subsystems.traceability?.score < 5) {
    return 'Repair requirement-to-evidence traceability before implementation continues.';
  }
  if (harnessResult.overall >= 85 && evalResult.score >= 90) {
    return 'Ready for realistic before/after agent-session benchmarking.';
  }
  if (harnessResult.overall < 70) {
    return `Improve the ${harnessResult.bottleneck} subsystem before benchmarking agent behavior.`;
  }
  if (evalResult.score < 80) {
    return 'Expand eval coverage before treating benchmark results as representative.';
  }
  return 'Usable, with some gaps worth tightening after first real sessions.';
}

function renderBenchmarkHtml(report) {
  const selfCheckSection = report.selfCheck?.skipped
    ? ''
    : `<section>
      <h2>Script Self-Check <span>${report.selfCheck.pass ? 'PASS' : 'FAIL'}</span></h2>
      <p>Premature generation refused: ${report.selfCheck.prematureGenerationRefused ? 'yes' : 'no'}; draft model refused: ${report.selfCheck.draftModelRefused ? 'yes' : 'no'}; stale source refused: ${report.selfCheck.staleSourceRefused ? 'yes' : 'no'}; stale source lowered structural score: ${report.selfCheck.staleSourceScoreRefused ? 'yes' : 'no'}; broken traceability refused: ${report.selfCheck.brokenTraceabilityRefused ? 'yes' : 'no'}; stale existing state refused: ${report.selfCheck.staleExistingStateRefused ? 'yes' : 'no'}; reviewed-model derivation scored ${report.selfCheck.score}/100. This confirms the bundled scripts run end-to-end, not that the sample contract is true.${report.selfCheck.error ? ` Error: ${escapeHtml(report.selfCheck.error)}` : ''}</p>
    </section>`;
  const evalHtml = htmlReport(report.harness, `Harness Benchmark: ${path.basename(report.target)}`)
    .replace('</main>', `${selfCheckSection}<section>
      <h2>Eval Coverage <span>${report.evals.score}/100</span></h2>
      <p>${report.evals.passed}/${report.evals.total} benchmark checks passed across ${report.evals.cases} eval cases.</p>
      <ul>${report.evals.checks.map((check) => `<li class="${check.pass ? 'pass' : 'fail'}">${check.pass ? 'PASS' : 'FAIL'} ${escapeHtml(check.message)}</li>`).join('')}</ul>
    </section>
    <section>
      <h2>Recommendation</h2>
      <p>${escapeHtml(report.recommendation)}</p>
    </section>
  </main>`);
  return evalHtml;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
