import path from 'node:path'
import { promises as fs } from 'node:fs'
import { chromium, devices, type BrowserContext, type Page } from 'playwright'
import { PDFDocument } from 'pdf-lib'
import {
  artifactsRoot,
  discoverCoursePages,
  ensureDirectory,
  pdfOutputRoot,
  startStaticServer,
  toAbsoluteSiteUrl,
  type Language
} from './export-site-utils'

const PDF_EXPORT_CSS = `
  .VPNav,
  .VPLocalNav,
  .VPSidebar,
  .aside,
  .VPDocFooter,
  .back-to-top-btn,
  .VPNavBarExtra,
  .VPNavBarSocialLinks,
  .VPNavBarAppearance,
  .VPNavBarTranslations,
  .VPSocialLinks,
  .VPDocOutlineDropdown,
  .VPDocAside,
  .VPLocalNavOutlineDropdown {
    display: none !important;
  }

  .Layout,
  .VPContent,
  .VPDoc,
  .VPDoc .container,
  .VPDoc .content,
  .VPDoc .content-container,
  .vp-doc,
  .vp-doc .container {
    max-width: none !important;
    width: auto !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .VPContent {
    padding-top: 0 !important;
  }

  .vp-doc h1 {
    font-size: 28px !important;
    margin-top: 0 !important;
  }

  .vp-doc h2 {
    page-break-after: avoid;
  }

  pre,
  blockquote,
  table,
  .mermaid,
  .custom-block {
    break-inside: avoid;
  }

  body {
    background: #ffffff !important;
  }
`

async function main() {
  const languages = parseRequestedLanguages(process.argv.slice(2))
  const tempRoot = path.join(artifactsRoot, 'pdfs/.tmp')

  await fs.rm(tempRoot, { recursive: true, force: true })
  await ensureDirectory(tempRoot)
  await ensureDirectory(pdfOutputRoot)

  const server = await startStaticServer()
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext(devices['Desktop Chrome'])

  try {
    for (const language of languages) {
      await buildLanguagePdf(context, server.origin, language, tempRoot)
    }
  } finally {
    await context.close()
    await browser.close()
    await server.close()
  }
}

async function buildLanguagePdf(
  context: BrowserContext,
  origin: string,
  language: Language,
  tempRoot: string
) {
  const pages = await discoverCoursePages(language)
  const tempLanguageDir = path.join(tempRoot, language)
  const outputPdf = path.join(pdfOutputRoot, `learn-harness-engineering-${language}.pdf`)
  const manifestPath = path.join(pdfOutputRoot, `learn-harness-engineering-${language}.json`)

  await fs.rm(tempLanguageDir, { recursive: true, force: true })
  await ensureDirectory(tempLanguageDir)

  const manifest: Array<{ title: string; routePath: string }> = []
  const tempPdfPaths: string[] = []

  let pageIndex = 1
  for (const entry of pages) {
    const page = await context.newPage()
    const url = toAbsoluteSiteUrl(origin, entry.routePath)

    await page.goto(url, { waitUntil: 'networkidle' })
    await page.addStyleTag({ content: PDF_EXPORT_CSS })
    await page.emulateMedia({ media: 'screen' })

    const title = await extractPageTitle(page, entry.titleHint)
    const safeSlug = entry.routePath
      .replace(/^\/+/, '')
      .replace(/\/+$/, '')
      .replace(/[/.]+/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()

    const tempPdfPath = path.join(
      tempLanguageDir,
      `${String(pageIndex).padStart(2, '0')}-${safeSlug || language}.pdf`
    )

    await page.pdf({
      path: tempPdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '14mm',
        bottom: '14mm',
        left: '12mm',
        right: '12mm'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate:
        '<div style="width:100%;font-size:9px;padding:0 12mm;color:#777;display:flex;justify-content:center;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>'
    })

    await page.close()

    manifest.push({ title, routePath: entry.routePath })
    tempPdfPaths.push(tempPdfPath)
    console.log(`Rendered ${language.toUpperCase()} PDF section: ${title}`)
    pageIndex += 1
  }

  const coverPdfPath = path.join(tempLanguageDir, `00-cover-${language}.pdf`)
  await renderCoverPage(context, coverPdfPath, language, manifest)
  await mergePdfs([coverPdfPath, ...tempPdfPaths], outputPdf)
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))

  console.log(`Built ${outputPdf}`)
}

async function extractPageTitle(page: Page, fallback: string) {
  const heading = await page.locator('h1').first().textContent().catch(() => null)
  const title = heading?.trim()
  if (title) return title
  const documentTitle = await page.title()
  return documentTitle.split('|')[0].trim() || fallback
}

async function renderCoverPage(
  context: BrowserContext,
  outputPath: string,
  language: Language,
  manifest: Array<{ title: string; routePath: string }>
) {
  const page = await context.newPage()
  const generatedAt = new Date().toISOString().slice(0, 10)
  const languageLabel = language === 'en' ? 'English' : '简体中文'
  const contents = manifest
    .map(
      (entry) =>
        `<li><span>${escapeHtml(entry.title)}</span><code>${escapeHtml(entry.routePath)}</code></li>`
    )
    .join('')

  await page.setContent(
    `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              margin: 48px;
              font-family: Georgia, "Times New Roman", serif;
              color: #1a1a1a;
            }
            h1 {
              margin: 0 0 8px;
              font-size: 32px;
            }
            p.meta {
              margin: 0 0 24px;
              color: #555;
              font-size: 14px;
            }
            h2 {
              margin: 32px 0 12px;
              font-size: 20px;
            }
            ol {
              margin: 0;
              padding-left: 24px;
            }
            li {
              margin: 0 0 8px;
              line-height: 1.5;
            }
            code {
              display: inline-block;
              margin-left: 8px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <h1>Learn Harness Engineering</h1>
          <p class="meta">${languageLabel} coursebook PDF · generated ${generatedAt}</p>
          <h2>Included sections</h2>
          <ol>${contents}</ol>
        </body>
      </html>`,
    { waitUntil: 'load' }
  )

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '14mm',
      bottom: '14mm',
      left: '12mm',
      right: '12mm'
    }
  })
  await page.close()
}

async function mergePdfs(inputPaths: string[], outputPath: string) {
  const merged = await PDFDocument.create()

  for (const inputPath of inputPaths) {
    const sourceBytes = await fs.readFile(inputPath)
    const source = await PDFDocument.load(sourceBytes)
    const copiedPages = await merged.copyPages(source, source.getPageIndices())
    for (const copiedPage of copiedPages) {
      merged.addPage(copiedPage)
    }
  }

  await fs.writeFile(outputPath, await merged.save())
}

function parseRequestedLanguages(args: string[]): Language[] {
  const languageIndex = args.findIndex((arg) => arg === '--lang')
  if (languageIndex === -1) {
    return ['en', 'zh']
  }

  const value = args[languageIndex + 1]
  if (value === 'en' || value === 'zh') {
    return [value]
  }

  throw new Error(`Unsupported language: ${value}`)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
