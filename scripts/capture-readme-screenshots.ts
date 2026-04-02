import path from 'node:path'
import { chromium, devices } from 'playwright'
import {
  ensureDirectory,
  readmeScreenshotTargets,
  readmeScreenshotsRoot,
  startStaticServer,
  toAbsoluteSiteUrl
} from './export-site-utils'

async function main() {
  await ensureDirectory(readmeScreenshotsRoot)

  const server = await startStaticServer()
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext(devices['Desktop Chrome'])

  try {
    for (const target of readmeScreenshotTargets) {
      const page = await context.newPage()
      await page.goto(toAbsoluteSiteUrl(server.origin, target.routePath), {
        waitUntil: 'networkidle'
      })
      await page.screenshot({
        path: path.join(readmeScreenshotsRoot, target.outputName),
        fullPage: false
      })
      await page.close()
      console.log(`Captured ${target.outputName}`)
    }
  } finally {
    await context.close()
    await browser.close()
    await server.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
