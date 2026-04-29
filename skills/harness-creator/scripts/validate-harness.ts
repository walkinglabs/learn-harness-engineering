#!/usr/bin/env tsx

import path from 'node:path'
import { promises as fs } from 'node:fs'
import { existsSync, statSync } from 'node:fs'

type CheckResult = {
  name: string
  ok: boolean
  message: string
}

type Feature = {
  id?: string
  name?: string
  title?: string
  status?: string
  evidence?: string
  verification?: unknown
}

type FeatureList = {
  features?: Feature[]
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    printHelp()
    return
  }

  const target = path.resolve(process.cwd(), readFlag(args, '--target') ?? '.')
  const results: CheckResult[] = []

  results.push(checkExists(target, 'AGENTS.md'))
  results.push(checkExists(target, 'feature_list.json'))
  results.push(checkExists(target, 'init.sh'))
  results.push(checkExists(target, 'progress.md'))
  results.push(checkExists(target, 'session-handoff.md'))
  results.push(checkExists(target, 'clean-state-checklist.md'))
  results.push(checkExecutable(target, 'init.sh'))

  const featureListPath = path.join(target, 'feature_list.json')
  if (existsSync(featureListPath)) {
    results.push(...await checkFeatureList(featureListPath))
  }

  const agentsPath = path.join(target, 'AGENTS.md')
  if (existsSync(agentsPath)) {
    results.push(...await checkAgentsFile(agentsPath))
  }

  printResults(target, results)

  if (results.some((result) => !result.ok)) {
    process.exitCode = 1
  }
}

function readFlag(args: string[], name: string) {
  const index = args.indexOf(name)
  if (index === -1) return null
  return args[index + 1] ?? null
}

function checkExists(target: string, file: string): CheckResult {
  const fullPath = path.join(target, file)
  const exists = existsSync(fullPath)

  return {
    name: `exists:${file}`,
    ok: exists,
    message: exists ? `${file} exists` : `${file} is missing`
  }
}

function checkExecutable(target: string, file: string): CheckResult {
  const fullPath = path.join(target, file)

  if (!existsSync(fullPath)) {
    return {
      name: `executable:${file}`,
      ok: false,
      message: `${file} is missing`
    }
  }

  const mode = statSync(fullPath).mode
  const executable = (mode & 0o111) !== 0

  return {
    name: `executable:${file}`,
    ok: executable,
    message: executable ? `${file} is executable` : `${file} is not executable. Run chmod +x ${file}`
  }
}

async function checkFeatureList(filePath: string): Promise<CheckResult[]> {
  const results: CheckResult[] = []

  try {
    const parsed = JSON.parse(await fs.readFile(filePath, 'utf-8')) as FeatureList
    const features = parsed.features ?? []

    results.push({
      name: 'feature_list:valid_json',
      ok: true,
      message: 'feature_list.json is valid JSON'
    })

    results.push({
      name: 'feature_list:has_features',
      ok: Array.isArray(features) && features.length > 0,
      message: features.length > 0 ? `feature_list.json has ${features.length} features` : 'feature_list.json has no features'
    })

    const active = features.filter((feature) => feature.status === 'in_progress' || feature.status === 'in-progress')
    results.push({
      name: 'feature_list:wip_limit',
      ok: active.length <= 1,
      message: active.length <= 1 ? 'WIP limit ok: at most one active feature' : `WIP limit violated: ${active.length} active features`
    })

    const missingId = features.filter((feature) => !feature.id)
    results.push({
      name: 'feature_list:ids',
      ok: missingId.length === 0,
      message: missingId.length === 0 ? 'All features have ids' : `${missingId.length} feature(s) missing id`
    })

    const completedWithoutEvidence = features.filter((feature) => {
      const status = feature.status
      return (status === 'passing' || status === 'done') && !feature.evidence
    })

    results.push({
      name: 'feature_list:evidence',
      ok: completedWithoutEvidence.length === 0,
      message: completedWithoutEvidence.length === 0
        ? 'No completed feature is missing evidence'
        : `${completedWithoutEvidence.length} completed feature(s) missing evidence`
    })
  } catch (error) {
    results.push({
      name: 'feature_list:valid_json',
      ok: false,
      message: `feature_list.json is invalid: ${error instanceof Error ? error.message : String(error)}`
    })
  }

  return results
}

async function checkAgentsFile(filePath: string): Promise<CheckResult[]> {
  const content = await fs.readFile(filePath, 'utf-8')
  const requiredPhrases = ['Startup Workflow', 'Working Rules', 'Definition of Done', 'End of Session']

  return requiredPhrases.map((phrase) => ({
    name: `AGENTS.md:${phrase}`,
    ok: content.includes(phrase),
    message: content.includes(phrase) ? `AGENTS.md contains ${phrase}` : `AGENTS.md missing ${phrase}`
  }))
}

function printHelp() {
  console.log(`Usage: validate-harness.ts [options]

Options:
  --target <path>  Target project directory. Defaults to current directory.
  --help, -h       Show this help.
`)
}

function printResults(target: string, results: CheckResult[]) {
  console.log('Harness validation results:')
  console.log(`Target: ${target}`)
  console.log('')

  for (const result of results) {
    const marker = result.ok ? 'PASS' : 'FAIL'
    console.log(`[${marker}] ${result.name}: ${result.message}`)
  }

  console.log('')
  const passed = results.filter((result) => result.ok).length
  const total = results.length
  console.log(`Score: ${passed}/${total}`)

  if (passed !== total) {
    console.log('')
    console.log('Fix failed checks before relying on this harness.')
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
