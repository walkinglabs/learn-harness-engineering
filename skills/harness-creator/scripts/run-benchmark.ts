#!/usr/bin/env tsx

import path from 'node:path'
import { promises as fs } from 'node:fs'
import { spawn } from 'node:child_process'

type Options = {
  target: string
  name: string
  verifyCommand: string | null
}

type CommandResult = {
  command: string
  exitCode: number | null
  stdout: string
  stderr: string
  durationMs: number
}

type BenchmarkResult = {
  name: string
  target: string
  createdAt: string
  verify?: CommandResult
  notes: string[]
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    printHelp()
    return
  }

  const options = parseArgs(args)
  const target = path.resolve(process.cwd(), options.target)
  const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
  const outputDir = path.join(target, 'artifacts', 'harness-benchmarks', `${timestamp}-${slug(options.name)}`)

  await fs.mkdir(outputDir, { recursive: true })

  const result: BenchmarkResult = {
    name: options.name,
    target,
    createdAt: new Date().toISOString(),
    notes: [
      'This script records benchmark evidence.',
      'It does not run Claude Code, Codex, Hermes, or any other coding agent by itself.',
      'Run the same task manually in baseline and harness conditions, then attach logs here.'
    ]
  }

  if (options.verifyCommand) {
    result.verify = await runCommand(options.verifyCommand, target)
  }

  await fs.writeFile(
    path.join(outputDir, 'benchmark-result.json'),
    JSON.stringify(result, null, 2),
    'utf-8'
  )

  await fs.writeFile(path.join(outputDir, 'benchmark-report.md'), buildMarkdownReport(result), 'utf-8')
  await fs.writeFile(path.join(outputDir, 'baseline-notes.md'), buildRunNotes('Baseline run'), 'utf-8')
  await fs.writeFile(path.join(outputDir, 'harness-notes.md'), buildRunNotes('Harness run'), 'utf-8')

  console.log('Benchmark scaffold created:')
  console.log(outputDir)

  if (result.verify) {
    console.log('')
    console.log(`Verification command: ${result.verify.command}`)
    console.log(`Exit code: ${result.verify.exitCode}`)
  }
}

function parseArgs(args: string[]): Options {
  return {
    target: readFlag(args, '--target') ?? '.',
    name: readFlag(args, '--name') ?? 'harness-benchmark',
    verifyCommand: readFlag(args, '--verify-cmd')
  }
}

function readFlag(args: string[], name: string) {
  const index = args.indexOf(name)
  if (index === -1) return null
  return args[index + 1] ?? null
}

async function runCommand(command: string, cwd: string): Promise<CommandResult> {
  const startedAt = Date.now()

  return await new Promise((resolve) => {
    const child = spawn(command, {
      cwd,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe']
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    child.on('close', (exitCode) => {
      resolve({
        command,
        exitCode,
        stdout,
        stderr,
        durationMs: Date.now() - startedAt
      })
    })
  })
}

function buildMarkdownReport(result: BenchmarkResult) {
  return `# Harness Benchmark Report

## Benchmark

- Name: ${result.name}
- Target: ${result.target}
- Created at: ${result.createdAt}

## What This Measures

Compare the same task under two conditions:

1. Baseline: weak or no harness
2. Harness: AGENTS.md, feature_list.json, init.sh, progress.md, and verification rules in place

## Metrics

| Metric | Baseline | Harness |
|---|---:|---:|
| Task completed | TBD | TBD |
| Verification passed | TBD | TBD |
| Time spent | TBD | TBD |
| Rework required | TBD | TBD |
| Unrelated files changed | TBD | TBD |
| Human intervention count | TBD | TBD |

## Verification Snapshot

${result.verify ? `Command: \`${result.verify.command}\`

Exit code: \`${result.verify.exitCode}\`

Duration: \`${result.verify.durationMs}ms\`

### stdout

\`\`\`text
${trimForMarkdown(result.verify.stdout)}
\`\`\`

### stderr

\`\`\`text
${trimForMarkdown(result.verify.stderr)}
\`\`\`
` : 'No verification command was run by this script.'}

## Notes

${result.notes.map((note) => `- ${note}`).join('\n')}
`
}

function buildRunNotes(title: string) {
  return `# ${title}

## Task Prompt

TBD

## Setup

- Branch:
- Commit:
- Agent:
- Model:
- Time budget:
- Turn budget:

## Result

- Completed:
- Verification command:
- Verification result:
- Human intervention:
- Unrelated changes:

## Evidence

Paste logs, screenshots, command output, and final diff notes here.

## Observations

TBD
`
}

function trimForMarkdown(value: string) {
  const max = 12000
  if (value.length <= max) return value
  return `${value.slice(0, max)}\n\n[truncated ${value.length - max} characters]`
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function printHelp() {
  console.log(`Usage: run-benchmark.ts [options]

Options:
  --target <path>       Target project directory. Defaults to current directory.
  --name <name>         Benchmark name. Defaults to harness-benchmark.
  --verify-cmd <cmd>    Optional verification command to run and record.
  --help, -h            Show this help.
`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
