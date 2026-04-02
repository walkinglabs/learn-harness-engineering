import DefaultTheme from 'vitepress/theme'
import './style.css'

function syncRootLocaleLabel(siteData, href = '') {
  const locales = siteData.value?.locales
  if (!locales?.root || !locales.en || !locales.zh) return

  const base = siteData.value.base || '/'
  const normalized = href || (typeof window !== 'undefined' ? window.location.pathname : '')
  const relative = normalized.startsWith(base)
    ? normalized.slice(base.length - 1)
    : normalized

  locales.root.label = relative.startsWith('/en/') ? locales.en.label : locales.zh.label
}

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    syncRootLocaleLabel(ctx.siteData)

    const previous = ctx.router.onAfterRouteChange
    ctx.router.onAfterRouteChange = async (to) => {
      syncRootLocaleLabel(ctx.siteData, to)
      if (previous) {
        await previous(to)
      }
    }
  }
}
