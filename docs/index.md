---
layout: page
---

<script setup>
if (typeof window !== 'undefined') {
  const base = import.meta.env.BASE_URL || '/'
  const lang = navigator.language || navigator.languages?.[0] || ''
  let locale = 'en/'
  if (lang.startsWith('ko')) locale = 'ko/'
  else if (lang.toLowerCase().startsWith('zh-tw') || lang.toLowerCase().startsWith('zh-hk') || lang.toLowerCase().startsWith('zh-mo')) locale = 'zh-TW/'
  else if (lang.toLowerCase().startsWith('pt-br')) locale = 'pt-BR/'
  else if (lang.startsWith('zh')) locale = 'zh/'
  else if (lang.startsWith('ru')) locale = 'ru/'
  else if (lang.startsWith('vi')) locale = 'vi/'
  else if (lang.startsWith('uz')) locale = 'uz/'
  else if (lang.startsWith('ja')) locale = 'ja/'
  else if (lang.startsWith('es')) locale = 'es/'
  else if (lang.startsWith('fr')) locale = 'fr/'
  else if (lang.startsWith('de')) locale = 'de/'
  else if (lang.startsWith('ar')) locale = 'ar/'
  else if (lang.startsWith('uk')) locale = 'uk/'
  else if (lang.startsWith('tr')) locale = 'tr/'
  else if (lang.startsWith('hi')) locale = 'hi/'
  
  const target = `${base}${locale}`
  if (!window.location.pathname.replace(/\/$/, '').endsWith(target.replace(/\/$/, ''))) {
    window.location.replace(target)
  }
}
</script>

<style>
.redirecting-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-2);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--vp-c-bg-alt);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

<div class="redirecting-wrapper">
  <div style="text-align: center;">
    <div class="spinner"></div>
    <p>Loading...</p>
  </div>
</div>
