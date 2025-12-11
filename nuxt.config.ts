// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  // Renforce explicitement les alias @ et ~ (utile quand Vite “perd” l’alias sous Windows)
  alias: {
    '@': fileURLToPath(new URL('./', import.meta.url)),
    '~': fileURLToPath(new URL('./', import.meta.url))
  },

  // Utilise un chemin ABSOLU depuis la racine du projet : plus robuste que '@/'
  css: ['/assets/css/deck.css'],

  app: {
    head: {
      title: 'Lyvero — Interactive Deck',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0B0F14' }
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
