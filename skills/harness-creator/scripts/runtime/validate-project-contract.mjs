#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { auditProjectContract } from './project-contract.mjs';

const target = path.resolve(process.argv[2] || process.cwd());

try {
  const model = JSON.parse(await readFile(path.join(target, 'project-model.json'), 'utf8'));
  const features = JSON.parse(await readFile(path.join(target, 'feature_list.json'), 'utf8'));
  const result = auditProjectContract(model, features);
  for (const source of model.sources || []) {
    if (typeof source.revision !== 'string' || !source.revision.startsWith('sha256:')) continue;
    try {
      const resolved = path.resolve(target, source.path);
      if (resolved !== target && !resolved.startsWith(`${target}${path.sep}`)) throw new Error('source path escapes the target repository');
      const body = await readFile(resolved);
      const observed = createHash('sha256').update(body).digest('hex');
      if (source.revision !== `sha256:${observed}`) {
        result.issues.push({ area: 'projectModel', code: 'source.stale', message: `${source.id}: source content no longer matches ${source.revision}` });
        result.valid = false;
      }
    } catch (error) {
      result.issues.push({ area: 'projectModel', code: 'source.unreadable', message: `${source.id}: fingerprinted source could not be read: ${error.message}` });
      result.valid = false;
    }
  }
  if (!result.valid) {
    console.error(`Project contract INVALID — ${result.issues.length} problem(s):`);
    for (const issue of result.issues) console.error(`  [${issue.area}] ${issue.message}`);
    process.exitCode = 1;
  } else {
    console.log(`Project contract valid: ${result.counts.requirements} requirements, ${result.counts.capabilities} capabilities, ${result.counts.verifications} verifications.`);
  }
} catch (error) {
  console.error(`Project contract could not be read: ${error.message}`);
  process.exitCode = 1;
}
