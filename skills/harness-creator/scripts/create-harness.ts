#!/usr/bin/env tsx

import path from 'node:path'
import { promises as fs } from 'node:fs'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

type Options = {
  target: string
  force: boolean
  projectName: string
}

type TemplateMapping = {
  template: string
  output: string
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const skillRoot = path.resolve(scriptDir, '..')
const templateRoot = path.join(skillRoot, 'templates')

const requiredOutputs: TemplateMapping[] = [
  { template: 'agents.md', output: 'AGENTS.md' },
  { template: 'feature-list.json', output: 'feature_list.json' },
  { template: 'init.sh', output: 'init.sh' },
  { template: 'progress.md', output: 'progress.md' }
]

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const targetRoot = path.resolve(process.cwd(), options.target)

  await fs.mkdir(targetRoot, { recursive: true })

  const created: string[] = []
  const skipped: string[] = []

  for (const item of requiredOutputs) {
    const source = path.join(templateRoot, item.template)
    const destination = path.join(targetRoot, item.output)

    if (!existsSync(source)) {
      throw new Error(`Missing template: ${source}`)
    }

    if (existsSync(destination) && !options.force) {
      skipped.push(item.output)
      continue
    }

    const template = await fs.readFile(source, 'utf-8')
    const content = customizeContent(template, options)

    await fs.writeFile(destination, content, 'utf-8')
    created.push(item.output)

    if (item.output === 'init.sh') {
      await fs.chmod(destination, 0o755)
    }
  }

  await writeFallbackIfMissing(
    path.join(targetRoot, 'session-handoff.md'),
    buildSessionHandoff(options),
    options.force,
    created,
    skipped
  )

  await writeFallbackIfMissing(
    path.join(targetRoot, 'clean-state-checklist.md'),
    buildCleanStateChecklist(),
    options.force,
    created,
    skipped
  )

  printSummary(targetRoot, created, skipped)
}

function parseArgs(args: string[]): Options {
  if (args.includes('--help') || args.includes('-h')) {
    printHelp()
    process.exit(0)
  }

  const target = readFlag(args, '--target') ?? '.'
  const projectName = readFlag(args, '--project-name') ?? path.basename(path.resolve(target))

  return {
    target,
    projectName,
    force: args.includes('--force')
  }
}

function readFlag(args: string[], name: string) {
  const index = args.indexOf(name)
  if (index === -1) return null
  return args[index + 1] ?? null
}

function customizeContent(content: string, options: Options) {
  return content
    .replaceAll('[One-sentence project purpose]', `${options.projectName} project harness.`)
    .replaceAll('YYYY-MM-DD HH:MM', new Date().toISOString())
}

async function writeFallbackIfMissing(
  destination: string,
  content: string,
  force: boolean,
  created: string[],
  skipped: string[]
) {
  const outputName = path.basename(destination)

  if (existsSync(destination) && !force) {
    skipped.push(outputName)
    return
  }

  await fs.writeFile(destination, content, 'utf-8')
  created.push(outputName)
}

function buildSessionHandoff(options: Options) {
  return `# Session Handoff

## Project

${options.projectName}

## Current Verified State

- Standard startup path: \`./init.sh\`
- Standard verification path: \`./init.sh\`
- Active feature: TBD
- Current blocker: None recorded

## This Session Changed

- TBD

## Still Broken or Unverified

- TBD

## Next Best Action

1. Read AGENTS.md.
2. Read feature_list.json.
3. Run ./init.sh.
4. Continue the single active feature only.

## Commands

\`\`\`bash
./init.sh
\`\`\`
`
}

function buildCleanStateChecklist() {
  return `# Clean State Checklist

Before ending a session:

- [ ] Standard startup path still works.
- [ ] Standard verification path has been run.
- [ ] feature_list.json reflects the real current state.
- [ ] progress.md has been updated.
- [ ] session-handoff.md has been updated.
- [ ] No unrelated files were modified.
- [ ] No feature is marked passing without evidence.
- [ ] Next session can resume without asking what happened.
`
}

function printHelp() {
  console.log(`Usage: create-harness.ts [options]

Options:
  --target <path>        Target project directory. Defaults to current directory.
  --project-name <name>  Project name used in generated fallback files.
  --force                Overwrite existing harness files.
  --help, -h             Show this help.
`)
}

function printSummary(targetRoot: string, created: string[], skipped: string[]) {
  console.log('Harness creation complete.')
  console.log(`Target: ${targetRoot}`)
  console.log('')

  if (created.length > 0) {
    console.log('Created:')
    for (const file of created) console.log(`- ${file}`)
  }

  if (skipped.length > 0) {
    console.log('')
    console.log('Skipped existing files:')
    for (const file of skipped) console.log(`- ${file}`)
    console.log('')
    console.log('Use --force to overwrite existing files.')
  }

  console.log('')
  console.log('Next steps:')
  console.log('1. Review AGENTS.md and replace placeholders.')
  console.log('2. Edit feature_list.json for the real project features.')
  console.log('3. Run ./init.sh from the target project.')
  console.log('4. Run validate-harness.ts to check completeness.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
