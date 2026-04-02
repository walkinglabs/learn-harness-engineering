import DefaultTheme from 'vitepress/theme'
import './style.css'

let rootEnglishLabel = 'English'

function dedupeLocaleMenuLinks() {
  if (typeof document === 'undefined') return

  const containers = document.querySelectorAll(
    '.VPNavBarTranslations .items, .VPNavBarExtra .group.translations, .VPNavScreenTranslations .list'
  )

  for (const container of containers) {
    const seen = new Set()
    const links = container.querySelectorAll('a[href]')

    for (const link of links) {
      const label = link.textContent?.trim() || ''
      const href = link.getAttribute('href') || ''
      const key = `${label}::${href}`

      if (seen.has(key)) {
        const removable = link.closest('.VPMenuLink, .item')
        removable?.remove()
        continue
      }

      seen.add(key)
    }
  }
}

function queueLocaleMenuDedupe() {
  if (typeof window === 'undefined') return
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      dedupeLocaleMenuLinks()
    })
  })
}

function syncRootLocaleLabel(siteData, href = '') {
  const locales = siteData.value?.locales
  if (!locales?.root || !locales?.zh) return

  if (locales.root.label && locales.root.label !== locales.zh.label) {
    rootEnglishLabel = locales.root.label
  }

  if (locales.en?.label) {
    rootEnglishLabel = locales.en.label
  }

  const base = siteData.value.base || '/'
  const normalized = href || (typeof window !== 'undefined' ? window.location.pathname : '')
  const relative = normalized.startsWith(base)
    ? normalized.slice(base.length - 1)
    : normalized

  locales.root.label = relative.startsWith('/zh/') ? locales.zh.label : rootEnglishLabel
}

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    syncRootLocaleLabel(ctx.siteData)
    queueLocaleMenuDedupe()

    const previous = ctx.router.onAfterRouteChange
    ctx.router.onAfterRouteChange = async (to) => {
      syncRootLocaleLabel(ctx.siteData, to)
      queueLocaleMenuDedupe()
      if (previous) {
        await previous(to)
      }
    }
  }
}
