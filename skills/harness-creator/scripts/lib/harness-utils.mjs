import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { access, chmod, copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditProjectContract } from '../runtime/project-contract.mjs';

export const SKILL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const TEMPLATE_DIR = path.join(SKILL_ROOT, 'templates');
export const SUBSYSTEMS = ['projectModel', 'instructions', 'state', 'verification', 'scope', 'lifecycle', 'traceability'];

export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      args._.push(token);
      continue;
    }
    const [rawKey, inlineValue] = token.slice(2).split('=', 2);
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (inlineValue !== undefined) {
      args[key] = inlineValue;
    } else if (argv[i + 1] && !argv[i + 1].startsWith('--')) {
      args[key] = argv[i + 1];
      i += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

export async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readText(filePath) {
  return readFile(filePath, 'utf8');
}

export async function readJson(filePath) {
  return JSON.parse(await readText(filePath));
}

export async function writeText(filePath, contents) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, 'utf8');
}

export async function copyTemplate(templateName, targetPath, replacements = {}, { force = false } = {}) {
  if (!force && await exists(targetPath)) {
    return { path: targetPath, status: 'skipped', reason: 'exists' };
  }

  let contents = await readText(path.join(TEMPLATE_DIR, templateName));
  for (const [key, value] of Object.entries(replacements)) {
    contents = contents.split(`{{${key}}}`).join(value);
  }
  await writeText(targetPath, contents);
  if (templateName.endsWith('.sh')) {
    await chmod(targetPath, 0o755);
  }
  return { path: targetPath, status: 'written' };
}

export function detectPackageManager(root, explicit) {
  if (explicit) return explicit;
  if (existsSync(path.join(root, 'bun.lockb')) || existsSync(path.join(root, 'bun.lock'))) return 'bun';
  if (existsSync(path.join(root, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(path.join(root, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

export async function detectProject(root) {
  const files = await listFiles(root, { maxFiles: 800 });
  const has = (name) => files.some((file) => file === name || file.endsWith(`/${name}`));
  const hasPrefix = (prefix) => files.some((file) => file.startsWith(prefix));
  const packageJsonPath = path.join(root, 'package.json');
  const packageJson = await exists(packageJsonPath).then((ok) => ok ? readJson(packageJsonPath) : null);

  let stack = 'generic';
  if (packageJson) {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    if (deps.react || hasPrefix('src/renderer')) stack = 'typescript-react';
    else if (deps.typescript || has('tsconfig.json')) stack = 'typescript';
    else stack = 'node';
  } else if (has('pyproject.toml') || has('requirements.txt')) {
    stack = 'python';
  } else if (has('go.mod')) {
    stack = 'go';
  } else if (has('Cargo.toml')) {
    stack = 'rust';
  } else if (has('pom.xml')) {
    stack = 'java-maven';
  } else if (has('build.gradle') || has('build.gradle.kts')) {
    stack = 'java-gradle';
  } else if (files.some((file) => file.endsWith('.csproj') || file.endsWith('.sln'))) {
    stack = 'dotnet';
  }

  return {
    root,
    stack,
    packageJson,
    files,
    packageManager: detectPackageManager(root)
  };
}

export function draftProjectModel(project) {
  const likelySource = (file) => /(^|\/)(readme|prd|requirements?|product|spec|brief|architecture|design|adr|context)(\.|\/|$)/i.test(file);
  const candidates = project.files.filter(likelySource).slice(0, 30);
  const sources = (candidates.length ? candidates : ['README.md']).map((file, index) => ({
    id: `src-${String(index + 1).padStart(3, '0')}`,
    path: file,
    kind: sourceKind(file),
    authority: 'context',
    revision: 'unreviewed',
    notes: 'Read and classify this source before marking the model reviewed.'
  }));
  return {
    $schema: './project-model.schema.json',
    modelVersion: 1,
    reviewStatus: 'draft',
    purpose: 'Replace with the outcome this project must produce and for whom.',
    sources,
    vocabulary: [],
    capabilities: [],
    requirements: [],
    verificationPlan: [],
    unknowns: [{
      id: 'unk-001',
      question: 'Which sources, requirements, capabilities, and acceptance criteria are authoritative?',
      impact: 'An implementation harness derived before this is answered would encode guesses as instructions.',
      status: 'open',
      blocks: []
    }],
    decisions: []
  };
}

export function deriveFeatureList(model) {
  const capabilityToFeature = new Map(model.capabilities.map((capability, index) => [
    capability.id,
    `feat-${String(index + 1).padStart(3, '0')}`
  ]));
  const requirements = Array.isArray(model.requirements) ? model.requirements : [];
  const verifications = Array.isArray(model.verificationPlan) ? model.verificationPlan : [];
  const unknowns = Array.isArray(model.unknowns) ? model.unknowns : [];

  const features = model.capabilities.map((capability) => {
    const linkedRequirements = requirements.filter((requirement) =>
      Array.isArray(requirement.capabilityRefs) && requirement.capabilityRefs.includes(capability.id)
    );
    const acceptanceCriteriaRefs = linkedRequirements.flatMap((requirement) =>
      (Array.isArray(requirement.acceptanceCriteria) ? requirement.acceptanceCriteria : []).map((criterion) => criterion.id)
    );
    const verificationRefs = verifications
      .filter((verification) => (verification.acceptanceCriteriaRefs || []).some((ref) => acceptanceCriteriaRefs.includes(ref)))
      .map((verification) => verification.id);
    const blockers = unknowns
      .filter((unknown) => unknown.status === 'open' && (unknown.blocks || []).some((ref) =>
        ref === capability.id || linkedRequirements.some((requirement) => requirement.id === ref)
      ))
      .map((unknown) => unknown.id);
    const unresolvedRequirement = linkedRequirements.some((requirement) => ['unknown', 'needs-decision'].includes(requirement.state));

    return {
      id: capabilityToFeature.get(capability.id),
      name: capability.name,
      description: capability.description,
      capabilityRefs: [capability.id],
      requirementRefs: linkedRequirements.map((requirement) => requirement.id),
      acceptanceCriteriaRefs,
      verificationRefs,
      inputs: capability.inputs || [],
      outputs: capability.outputs || [],
      boundaries: capability.boundaries || [],
      dependencies: (capability.dependencies || []).map((ref) => capabilityToFeature.get(ref)).filter(Boolean),
      status: blockers.length || unresolvedRequirement ? 'blocked' : 'not-started',
      blockers,
      evidence: []
    };
  });

  return {
    $schema: './feature-list.schema.json',
    derivedFrom: 'project-model.json',
    activeFeature: null,
    features
  };
}

function sourceKind(file) {
  if (/prd|requirements?|spec/i.test(file)) return 'requirements';
  if (/architecture|design|adr/i.test(file)) return 'design';
  if (/readme/i.test(file)) return 'readme';
  return 'project-document';
}

export async function listFiles(root, { maxFiles = 1000 } = {}) {
  const ignored = new Set(['.git', '.agents', '.claude', '.codex', 'worktrees', 'node_modules', 'dist', 'build', '.next', '.venv', 'venv', '__pycache__', '.mypy_cache', '.pytest_cache', '.ruff_cache', '.rescue-main-local-edits']);
  const results = [];

  async function walk(current, relative) {
    if (results.length >= maxFiles) return;
    let entries = [];
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (results.length >= maxFiles) return;
      if (ignored.has(entry.name)) continue;
      const rel = relative ? `${relative}/${entry.name}` : entry.name;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full, rel);
      } else if (entry.isFile()) {
        results.push(rel);
      }
    }
  }

  await walk(root, '');
  return results.sort();
}

export function verificationCommands(project, explicitPackageManager) {
  const pm = explicitPackageManager || project.packageManager || 'npm';
  const scripts = project.packageJson?.scripts ?? {};
  const run = (script) => {
    if (pm === 'npm') return `npm run ${script}`;
    if (pm === 'yarn') return `yarn ${script}`;
    return `${pm} run ${script}`;
  };

  if (project.stack === 'python') {
    // python3 is the portable name (many systems no longer ship a bare `python`).
    // pytest exits 5 when it collects zero tests — harmless here, so don't let `set -e`
    // treat "no tests yet" as a failure. compileall's -x skips virtualenvs and build
    // artifacts so a syntax check doesn't choke on dependencies it shouldn't compile.
    const py = 'python3';
    return [
      `${py} -m pytest || [ $? -eq 5 ]`,
      `${py} -m compileall -q -x '(^|/)(\\.?venv|env|node_modules|build|dist|__pycache__)(/|$)' .`
    ];
  }

  if (project.stack === 'go') return ['go test ./...'];
  if (project.stack === 'rust') return ['cargo test'];
  if (project.stack === 'java-maven') return ['mvn test'];
  if (project.stack === 'java-gradle') return ['./gradlew test'];
  if (project.stack === 'dotnet') return ['dotnet test'];

  if (!project.packageJson) {
    return [
      'echo "No package manifest detected; replace this line with your project verification command."'
    ];
  }

  const install = pm === 'npm'
    ? 'npm install'
    : pm === 'yarn'
      ? 'yarn install'
      : `${pm} install`;
  const candidates = [
    scripts.check ? run('check') : null,
    scripts.typecheck ? run('typecheck') : null,
    scripts['type-check'] ? run('type-check') : null,
    scripts.lint ? run('lint') : null,
    scripts.test ? (pm === 'npm' ? 'npm test' : `${pm} test`) : null,
    scripts.build ? run('build') : null
  ].filter(Boolean);

  return [install, ...dedupe(candidates)];
}

export function initScriptFromCommands(commands) {
  const body = commands.map((command) => `echo "=== ${escapeForEcho(command)} ==="\n${command}`).join('\n\n');
  return `#!/bin/bash
set -euo pipefail

echo "=== Harness Initialization ==="

echo "=== Project Contract ==="
node scripts/harness/validate-project-contract.mjs

${body}

echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Read feature_list.json to see current feature state"
echo "2. Pick ONE unfinished feature to work on"
echo "3. Implement only that feature"
echo "4. Re-run verification before claiming done"
`;
}

function escapeForEcho(value) {
  return value.replaceAll('"', '\\"');
}

export function dedupe(values) {
  return [...new Set(values)];
}

export function scoreHarness(files) {
  const byPath = new Map(files.map((file) => [file.path, file.content]));
  const allText = files.map((file) => `${file.path}\n${file.content}`).join('\n\n');
  const agents = byPath.get('AGENTS.md') || byPath.get('CLAUDE.md') || '';
  const projectModelText = byPath.get('project-model.json') || '';
  const featureList = byPath.get('feature_list.json') || byPath.get('feature-list.json') || '';
  const progress = byPath.get('progress.md') || '';
  const init = byPath.get('init.sh') || '';
  const handoff = byPath.get('session-handoff.md') || '';
  const projectModel = parseJson(projectModelText);
  const parsedFeatures = parseJson(featureList);
  const contract = auditProjectContract(projectModel, parsedFeatures);
  const sourceIntegrity = parseJson(byPath.get('__source-integrity.json') || '');

  const checks = {
    projectModel: [
      hasFile(byPath, ['project-model.json'], 'Project model exists'),
      boolCheck(projectModel?.reviewStatus === 'reviewed', 'Project model was reviewed before derivation'),
      boolCheck(Array.isArray(projectModel?.sources) && projectModel.sources.length > 0, 'Requirement and design sources are classified'),
      boolCheck(Array.isArray(projectModel?.requirements) && projectModel.requirements.length > 0 && Array.isArray(projectModel?.capabilities) && projectModel.capabilities.length > 0, 'Requirements and capabilities are modelled'),
      boolCheck(contract.byArea.projectModel.length === 0, 'Project model represents uncertainty without malformed or missing fields'),
      boolCheck(Boolean(sourceIntegrity) && sourceIntegrity.failures.length === 0, 'Fingerprint-backed project sources are current')
    ],
    instructions: [
      hasFile(byPath, ['AGENTS.md', 'CLAUDE.md'], 'Agent instruction file exists'),
      structuredHas(agents, ['Startup Workflow', 'Before writing code'], 'Startup workflow documented'),
      structuredHas(agents, ['Definition of Done', 'done only when'], 'Definition of done documented'),
      structuredHas(agents, ['Verification Commands', './init.sh', 'test', 'verify'], 'Verification commands discoverable'),
      structuredHas(agents, ['project-model.json', 'feature_list.json', 'progress.md'], 'Project contract and state artifacts routed from instructions')
    ],
    state: [
      hasFile(byPath, ['feature_list.json', 'feature-list.json'], 'Feature tracker exists'),
      jsonFeatureList(featureList, 'Feature tracker is valid and has feature fields'),
      hasFile(byPath, ['progress.md'], 'Progress log exists'),
      structuredHas(progress, ['Current State', 'What', 'Next'], 'Progress log supports restart'),
      structuredHas(handoff || progress, ['Blockers', 'Files', 'Next Session'], 'Handoff captures blockers/files/next step')
    ],
    verification: [
      hasFile(byPath, ['init.sh'], 'Verification entrypoint exists'),
      textHas(init, ['set -e'], 'Verification fails fast'),
      textHas(init, ['validate-project-contract'], 'Project-contract validation runs before engineering checks'),
      textHas(init + agents, ['test', 'pytest', 'vitest', 'cargo test', 'go test', 'dotnet test'], 'Test command documented'),
      textHas(allText, ['Evidence', 'Verification Evidence', 'evidencePath', 'evidence artifact'], 'Observed verification evidence has a durable location')
    ],
    scope: [
      structuredHas(agents, ['One feature at a time', 'one-feature-at-a-time'], 'One-feature-at-a-time rule exists'),
      textHas(featureList, ['dependencies'], 'Feature dependencies are tracked'),
      textHas(agents + featureList, ['status'], 'Feature status is explicit'),
      structuredHas(agents, ['Stay in scope', 'scope'], 'Scope boundary documented'),
      structuredHas(agents, ['Definition of Done'], 'Completion gate limits scope closure')
    ],
    lifecycle: [
      hasFile(byPath, ['init.sh'], 'Startup script exists'),
      structuredHas(agents, ['End of Session', 'Before ending'], 'End-of-session procedure exists'),
      hasFile(byPath, ['session-handoff.md'], 'Session handoff template exists'),
      structuredHas(progress + '\n' + handoff, ['Last Updated', 'Current Objective', 'Recommended Next Step'], 'Session restart markers exist'),
      textHas(agents + init, ['restartable', 'clean', 'Next steps'], 'Clean restart path documented')
    ],
    traceability: [
      boolCheck(parsedFeatures?.derivedFrom === 'project-model.json', 'Feature state declares its project-model source'),
      boolCheck(Array.isArray(parsedFeatures?.features) && parsedFeatures.features.every((feature) => Array.isArray(feature.capabilityRefs) && Array.isArray(feature.requirementRefs)), 'Features reference capabilities and requirements'),
      boolCheck(Boolean(projectModel) && contract.byArea.traceability.length === 0, 'Requirement, capability, acceptance, feature, and verification references are complete'),
      boolCheck(Array.isArray(projectModel?.verificationPlan) && projectModel.verificationPlan.length > 0, 'Acceptance criteria have planned verification procedures and expected observations'),
      boolCheck(Boolean(projectModel) && contract.byArea.evidence.length === 0, 'Done features carry observed evidence for every linked verification')
    ]
  };

  const subsystems = Object.fromEntries(Object.entries(checks).map(([name, subsystemChecks]) => {
    const passed = subsystemChecks.filter((check) => check.pass).length;
    const score = Math.max(1, Math.round((passed / subsystemChecks.length) * 5));
    return [name, {
      score,
      passed,
      total: subsystemChecks.length,
      checks: subsystemChecks
    }];
  }));

  const total = Object.values(subsystems).reduce((sum, item) => sum + item.score, 0);
  const overall = Math.round((total / (SUBSYSTEMS.length * 5)) * 100);
  const ranked = Object.entries(subsystems).sort((a, b) => a[1].score - b[1].score);
  // A bottleneck only means something when a subsystem is weaker than the rest.
  // When every subsystem already maxes out, reporting one is misleading.
  const bottleneck = ranked[0][1].score === 5 ? null : ranked[0][0];
  return {
    overall,
    bottleneck,
    subsystems,
    contract,
    sourceIntegrity,
    limitation: 'Structural traceability checks cannot prove that the project model or its expected outcomes are semantically correct; domain review and representative task runs remain required.'
  };
}

function boolCheck(pass, message) {
  return { pass: Boolean(pass), message };
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function hasFile(byPath, names, message) {
  return { pass: names.some((name) => byPath.has(name)), message };
}

function textHas(text, needles, message) {
  const lower = text.toLowerCase();
  return { pass: needles.some((needle) => lower.includes(needle.toLowerCase())), message };
}

// A real instruction doc carries its load-bearing phrases in structure — headings,
// list items, tables, fenced code, or bold lead-ins — not in free prose. Scoring only
// the structured lines means a genuine harness still passes, while a file that just
// sprinkles the right keywords across a paragraph to game the score does not.
function structuredText(markdown) {
  const kept = [];
  let inFence = false;
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();
    if (/^(```|~~~)/.test(line)) { inFence = !inFence; continue; }
    if (inFence) { kept.push(line); continue; }
    if (!line) continue;
    const isHeading = /^#{1,6}\s/.test(line);
    const isList = /^([-*+]|\d+\.)\s/.test(line);
    const isTable = line.startsWith('|');
    const isBoldLead = /^\*\*[^*]+\*\*/.test(line);
    if (isHeading || isList || isTable || isBoldLead) kept.push(line);
  }
  return kept.join('\n');
}

function structuredHas(markdown, needles, message) {
  return textHas(structuredText(markdown), needles, message);
}

function jsonFeatureList(text, message) {
  try {
    const parsed = JSON.parse(text);
    const valid = Array.isArray(parsed.features) && parsed.features.every((feature) =>
      typeof feature.id === 'string'
      && typeof feature.name === 'string'
      && typeof feature.description === 'string'
      && typeof feature.status === 'string'
    );
    return { pass: valid, message };
  } catch {
    return { pass: false, message };
  }
}

export async function loadHarnessFiles(root) {
  const candidates = [
    'AGENTS.md',
    'CLAUDE.md',
    'project-model.json',
    'feature_list.json',
    'feature-list.json',
    'progress.md',
    'session-handoff.md',
    'init.sh'
  ];
  const files = [];
  for (const candidate of candidates) {
    const fullPath = path.join(root, candidate);
    if (await exists(fullPath)) {
      files.push({ path: candidate, content: await readText(fullPath) });
    }
  }
  const modelFile = files.find((file) => file.path === 'project-model.json');
  if (modelFile) {
    const model = parseJson(modelFile.content);
    if (model) files.push({ path: '__source-integrity.json', content: JSON.stringify(await sourceIntegrity(root, model)) });
  }
  return files;
}

async function sourceIntegrity(root, model) {
  const report = { checked: 0, uncheckable: 0, failures: [] };
  for (const source of Array.isArray(model.sources) ? model.sources : []) {
    if (typeof source?.revision !== 'string' || !source.revision.startsWith('sha256:')) {
      report.uncheckable += 1;
      continue;
    }
    const resolved = path.resolve(root, source.path || '');
    if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
      report.failures.push(`${source.id}: source path escapes the target repository`);
      continue;
    }
    try {
      const body = await readFile(resolved);
      const observed = createHash('sha256').update(body).digest('hex');
      report.checked += 1;
      if (source.revision !== `sha256:${observed}`) report.failures.push(`${source.id}: source fingerprint is stale`);
    } catch (error) {
      report.failures.push(`${source.id}: source could not be read (${error.message})`);
    }
  }
  return report;
}

export function formatScoreReport(result, root = '.') {
  const lines = [
    `Harness validation for ${root}`,
    `Overall: ${result.overall}/100`,
    `Bottleneck: ${result.bottleneck ?? 'none — all subsystems at full score'}`,
    ''
  ];

  for (const [name, subsystem] of Object.entries(result.subsystems)) {
    lines.push(`${name}: ${subsystem.score}/5 (${subsystem.passed}/${subsystem.total})`);
    for (const check of subsystem.checks) {
      lines.push(`  ${check.pass ? 'PASS' : 'FAIL'} ${check.message}`);
    }
    lines.push('');
  }
  if (result.sourceIntegrity) {
    lines.push(`Project sources: ${result.sourceIntegrity.checked} fingerprint(s) checked, ${result.sourceIntegrity.uncheckable} revision(s) recorded but not checkable offline, ${result.sourceIntegrity.failures.length} failure(s)`);
  }
  lines.push(`Limitation: ${result.limitation}`);
  return lines.join('\n');
}

export function htmlReport(result, title = 'Harness Assessment') {
  const rows = Object.entries(result.subsystems).map(([name, subsystem]) => {
    const checks = subsystem.checks.map((check) =>
      `<li class="${check.pass ? 'pass' : 'fail'}">${check.pass ? 'PASS' : 'FAIL'} ${escapeHtml(check.message)}</li>`
    ).join('');
    return `<section>
      <h2>${escapeHtml(name)} <span>${subsystem.score}/5</span></h2>
      <ul>${checks}</ul>
    </section>`;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 32px; color: #172026; background: #f7f8fa; }
    main { max-width: 960px; margin: 0 auto; }
    header { margin-bottom: 24px; }
    h1 { margin: 0 0 8px; font-size: 32px; }
    .summary { display: flex; gap: 16px; flex-wrap: wrap; margin: 20px 0; }
    .metric { background: white; border: 1px solid #d9dee5; border-radius: 8px; padding: 16px 18px; min-width: 180px; }
    .metric strong { display: block; font-size: 28px; margin-top: 4px; }
    section { background: white; border: 1px solid #d9dee5; border-radius: 8px; margin: 14px 0; padding: 16px 18px; }
    h2 { margin: 0 0 10px; font-size: 20px; display: flex; justify-content: space-between; }
    ul { margin: 0; padding-left: 20px; }
    li { margin: 6px 0; }
    .pass { color: #126c43; }
    .fail { color: #a23020; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>${escapeHtml(title)}</h1>
      <p>Project-contract foundation plus five harness subsystems and end-to-end traceability.</p>
      <div class="summary">
        <div class="metric">Overall<strong>${result.overall}/100</strong></div>
        <div class="metric">Bottleneck<strong>${escapeHtml(result.bottleneck ?? 'none')}</strong></div>
      </div>
    </header>
    ${rows}
    ${result.sourceIntegrity ? `<section><h2>Project source freshness</h2><p>${result.sourceIntegrity.checked} fingerprint(s) checked; ${result.sourceIntegrity.uncheckable} revision(s) recorded but not checkable offline; ${result.sourceIntegrity.failures.length} failure(s).</p></section>` : ''}
    <section><h2>Interpretation</h2><p>${escapeHtml(result.limitation)}</p></section>
  </main>
</body>
</html>
`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function copyFileSafe(source, target, { force = false } = {}) {
  if (!force && await exists(target)) {
    return { path: target, status: 'skipped', reason: 'exists' };
  }
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(source, target);
  return { path: target, status: 'written' };
}
