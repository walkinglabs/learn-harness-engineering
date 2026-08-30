#!/usr/bin/env node
import { chmod, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import {
  SKILL_ROOT,
  copyTemplate,
  detectPackageManager,
  detectProject,
  deriveFeatureList,
  draftProjectModel,
  exists,
  initScriptFromCommands,
  parseArgs,
  readJson,
  verificationCommands,
  writeText
} from './lib/harness-utils.mjs';
import { auditProjectContract } from './runtime/project-contract.mjs';

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(`Usage: node scripts/create-harness.mjs [--target DIR] [--agent-file AGENTS.md|CLAUDE.md] [--package-manager npm|pnpm|yarn|bun] [--scaffold-only] [--force]

Default mode derives an authoritative harness from a reviewed project-model.json:
  project-model.json + schema
  AGENTS.md or CLAUDE.md
  requirement-linked feature_list.json + schema
  progress.md
  session-handoff.md
  init.sh
  scripts/harness/ project-contract validator

When no model exists, nothing is generated. Use --scaffold-only to create a draft model,
then inspect requirement sources, complete it, and set reviewStatus to "reviewed".
Existing files are skipped unless --force is set.`);
  process.exit(0);
}

const target = path.resolve(args.target || args._[0] || process.cwd());
const agentFile = args.agentFile || 'AGENTS.md';
const force = Boolean(args.force);
const project = await detectProject(target);
project.packageManager = detectPackageManager(target, args.packageManager);
const modelPath = path.join(target, 'project-model.json');

if (args.scaffoldOnly) {
  await mkdir(target, { recursive: true });
  const results = [];
  if (force || !await exists(modelPath)) {
    await writeText(modelPath, `${JSON.stringify(draftProjectModel(project), null, 2)}\n`);
    results.push({ path: modelPath, status: 'written' });
  } else {
    results.push({ path: modelPath, status: 'skipped', reason: 'exists' });
  }
  results.push(await copyTemplate('project-model.schema.json', path.join(target, 'project-model.schema.json'), {}, { force }));
  console.log(`Draft project model scaffolded for ${target}`);
  console.log('No agent instructions, feature state, or verification harness were generated.');
  console.log('Read the discovered sources, complete project-model.json, mark it reviewed, then run create-harness.mjs again.');
  for (const result of results) console.log(`${result.status.toUpperCase()} ${path.relative(target, result.path)}${result.reason ? ` (${result.reason})` : ''}`);
  process.exit(0);
}

if (!await exists(modelPath)) {
  console.error('Refusing premature harness generation: project-model.json does not exist.');
  console.error('Run discover-project.mjs, inspect the relevant sources, then use create-harness.mjs --scaffold-only to start a draft model.');
  process.exit(2);
}

let model;
try {
  model = await readJson(modelPath);
} catch (error) {
  console.error(`Refusing harness generation: project-model.json could not be read: ${error.message}`);
  process.exit(2);
}

const modelAudit = auditProjectContract(model);
if (!modelAudit.valid) {
  console.error(`Refusing harness generation: project model is not ready (${modelAudit.issues.length} problem(s)).`);
  for (const issue of modelAudit.issues) console.error(`  [${issue.area}] ${issue.message}`);
  process.exit(2);
}

const featureState = deriveFeatureList(model);
const featurePath = path.join(target, 'feature_list.json');
let stateToValidate = featureState;
if (!force && await exists(featurePath)) {
  try {
    stateToValidate = await readJson(featurePath);
  } catch (error) {
    console.error(`Refusing harness generation: existing feature_list.json could not be read: ${error.message}`);
    process.exit(2);
  }
}
const derivedAudit = auditProjectContract(model, stateToValidate);
if (!derivedAudit.valid) {
  console.error(`Refusing harness generation: ${stateToValidate === featureState ? 'derived' : 'existing'} traceability is incomplete (${derivedAudit.issues.length} problem(s)).`);
  for (const issue of derivedAudit.issues) console.error(`  [${issue.area}] ${issue.message}`);
  if (stateToValidate !== featureState) console.error('Migrate existing feature IDs, status, and evidence onto the reviewed project model; use --force only when replacement is explicitly intended.');
  process.exit(2);
}

const commands = args.commands
  ? String(args.commands).split(',').map((command) => command.trim()).filter(Boolean)
  : verificationCommands(project, args.packageManager);

const replacements = {
  AGENT_FILE_NAME: agentFile,
  PROJECT_PURPOSE: model.purpose,
  VERIFICATION_COMMANDS: commands.map((command) => `- \`${command}\``).join('\n'),
  PRIMARY_VERIFICATION_COMMAND: './init.sh'
};

const results = [];
results.push({ path: modelPath, status: 'used', reason: 'reviewed project contract' });
results.push(await copyTemplate('project-model.schema.json', path.join(target, 'project-model.schema.json'), {}, { force }));
results.push(await copyTemplate('agents.md', path.join(target, agentFile), replacements, { force }));
if (force || !await exists(featurePath)) {
  await writeText(featurePath, `${JSON.stringify(featureState, null, 2)}\n`);
  results.push({ path: featurePath, status: 'written' });
} else {
  results.push({ path: featurePath, status: 'skipped', reason: 'exists' });
}
results.push(await copyTemplate('feature-list.schema.json', path.join(target, 'feature-list.schema.json'), {}, { force }));
results.push(await copyTemplate('progress.md', path.join(target, 'progress.md'), {}, { force }));
results.push(await copyTemplate('session-handoff.md', path.join(target, 'session-handoff.md'), {}, { force }));

const runtimeDir = path.join(target, 'scripts', 'harness');
await mkdir(runtimeDir, { recursive: true });
for (const name of ['project-contract.mjs', 'validate-project-contract.mjs']) {
  const destination = path.join(runtimeDir, name);
  if (force || !await exists(destination)) {
    await copyFile(path.join(SKILL_ROOT, 'scripts', 'runtime', name), destination);
    if (name.startsWith('validate-')) await chmod(destination, 0o755);
    results.push({ path: destination, status: 'written' });
  } else {
    results.push({ path: destination, status: 'skipped', reason: 'exists' });
  }
}

const initPath = path.join(target, 'init.sh');
if (force || !await exists(initPath)) {
  await writeText(initPath, initScriptFromCommands(commands));
  await chmod(initPath, 0o755);
  results.push({ path: initPath, status: 'written' });
} else {
  results.push({ path: initPath, status: 'skipped', reason: 'exists' });
}

console.log(`Created requirement-derived harness for ${target}`);
console.log(`Detected stack: ${project.stack}`);
console.log(`Project contract: ${model.requirements.length} requirements, ${model.capabilities.length} capabilities, ${model.verificationPlan.length} verifications`);
console.log(`Verification commands:`);
for (const command of commands) {
  console.log(`  - ${command}`);
}
console.log('');
for (const result of results) {
  console.log(`${result.status.toUpperCase()} ${path.relative(target, result.path)}${result.reason ? ` (${result.reason})` : ''}`);
}
