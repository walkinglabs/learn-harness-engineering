#!/usr/bin/env node
// scripts/build-llms-txt.mjs
//
// Sync the canonical /llms.txt and /llms-full.txt (at repo root) into
// docs/public/ so VitePress serves them at the site root.
//
// Why a copy and not symlinks: VitePress's static asset pipeline only
// picks up real files under docs/public/, and symlinks break on Windows
// contributors. The repo-root copy is the spec-required location
// (https://llmstxt.org), the docs/public/ copy is the served artifact.
//
// Usage:
//   node scripts/build-llms-txt.mjs            # copy + verify
//   node scripts/build-llms-txt.mjs --check    # verify only (CI guard)
//
// No third-party deps; Node 18+ built-ins only.

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const FILES = ['llms.txt', 'llms-full.txt'];
const PUBLIC_DIR = resolve(repoRoot, 'docs', 'public');

const checkOnly = process.argv.includes('--check');

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function readIfExists(path) {
  try {
    await stat(path);
    return await readFile(path, 'utf8');
  } catch {
    return null;
  }
}

let mismatch = false;

for (const name of FILES) {
  const src = resolve(repoRoot, name);
  const dst = resolve(PUBLIC_DIR, name);

  const srcContent = await readIfExists(src);
  if (srcContent === null) {
    console.error(`[llms-txt] ERROR: missing source file ${src}`);
    process.exit(1);
  }

  if (checkOnly) {
    const dstContent = await readIfExists(dst);
    if (dstContent !== srcContent) {
      console.error(
        `[llms-txt] DRIFT: docs/public/${name} is out of sync with /${name}. ` +
          `Run \`npm run llms:build\` and commit the result.`
      );
      mismatch = true;
    }
    continue;
  }

  await ensureDir(PUBLIC_DIR);
  await writeFile(dst, srcContent);
  console.log(`[llms-txt] wrote docs/public/${name} (${srcContent.length} bytes)`);
}

if (checkOnly && mismatch) {
  process.exit(1);
}
