---
layout: page
---

<script setup>
if (typeof window !== 'undefined') {
  const base = import.meta.env.BASE_URL || '/'
  const lang = navigator.language || navigator.languages?.[0] || ''
  let locale = 'en/'
  if (lang.startsWith('ko')) locale = 'ko/'
  else if (lang.startsWith('zh')) locale = 'zh/'
  else if (lang.startsWith('ru')) locale = 'ru/'
  else if (lang.startsWith('vi')) locale = 'vi/'
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
