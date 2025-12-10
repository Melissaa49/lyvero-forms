import { defineNuxtPlugin } from 'nuxt/app'
export default defineNuxtPlugin(() => {
  if (!process.client) return
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) document.documentElement.style.setProperty('--glow','0 0 12px rgba(0,255,136,.2)')
})
