// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  alias: {
    '@': fileURLToPath(new URL('./', import.meta.url)),
    '~': fileURLToPath(new URL('./', import.meta.url))
  },

  css: ['/assets/css/deck.css'],

  app: {
    head: {
      title: 'Lyvero — Bêta privée',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0B0F14' },

        // ---------- OPEN GRAPH ----------
        { property: 'og:title', content: 'Lyvero — Bêta privée' },
        { property: 'og:description', content: 'Construisons ensemble un réseau social utile.' },
        { property: 'og:image', content: '/creator-illustration.png' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Lyvero' },

        // ---------- TWITTER CARD ----------
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Lyvero — Bêta privée' },
        { name: 'twitter:description', content: 'Participez à la construction du réseau social le plus utile.' },
        { name: 'twitter:image', content: '/creator-illustration.png' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      EMAILJS_PUBLIC: process.env.EMAILJS_PUBLIC,
      EMAILJS_SERVICE: process.env.EMAILJS_SERVICE,
      EMAILJS_TEMPLATE: process.env.EMAILJS_TEMPLATE
    }
  },

  devtools: { enabled: false },
  compatibilityDate: '2024-08-01'
})
