#!/usr/bin/env node
import path from 'node:path';
import { detectProject, listFiles, parseArgs, writeText } from './lib/harness-utils.mjs';

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log(`Usage: node scripts/discover-project.mjs [--target DIR] [--output FILE]

Inventories likely requirement sources, entrypoints, tests, configuration, and integrations.
It does not infer project semantics and writes nothing unless --output is supplied.`);
  process.exit(0);
}

const target = path.resolve(args.target || args._[0] || process.cwd());
const project = await detectProject(target);
const files = await listFiles(target, { maxFiles: 10000 });
const classify = (patterns) => files.filter((file) => patterns.some((pattern) => pattern.test(file)));
const report = {
  target,
  detectedStack: project.stack,
  note: 'Inventory only. Read the candidate sources and build a reviewed project-model.json before creating an authoritative harness.',
  harnessArtifacts: files.filter((file) => /^(AGENTS\.md|CLAUDE\.md|project-model\.json|feature_list\.json|feature-list\.json|progress\.md|session-handoff\.md|init\.sh)$/.test(file)),
  candidateSources: classify([/(^|\/)(readme|prd|requirements?|product|spec|brief|architecture|design|adr|context)(\.|\/|$)/i]),
  entrypoints: classify([/(^|\/)(main|app|server|cli|index)\.[^.]+$/i, /(^|\/)cmd\//i]),
  tests: classify([/(^|\/)(test|tests|spec|specs)(\/|\.|$)/i, /(_test|\.test|\.spec)\.[^.]+$/i]),
  configuration: classify([/(^|\/)(config|configs|settings|countries)(\/|\.|$)/i, /\.(ya?ml|toml|ini|env\.example)$/i]),
  integrations: classify([/(^|\/)(adapters?|integrations?|connectors?|ports?)(\/|\.|$)/i])
};

const body = `${JSON.stringify(report, null, 2)}\n`;
if (args.output) {
  const output = path.resolve(args.output);
  await writeText(output, body);
  console.log(`Discovery inventory written to ${output}`);
} else {
  process.stdout.write(body);
}
