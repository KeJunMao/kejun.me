// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    shim: false,
  },
  app: {
    head: {
      title: 'KeJun',
      htmlAttrs: {
        lang: 'en',
      },
      viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
    },
  },
  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    'v-lazy-show/nuxt',
  ],
  css: [
    '@unocss/reset/tailwind.css',
    '@/assets/css/main.css',
  ],
  postcss: {
    plugins: {
      'postcss-nesting': {},
    },
  },
  colorMode: {
    classSuffix: '',
  },
  content: {
    documentDriven: true,
    highlight: {
      theme: {
        dark: 'github-dark',
        default: 'github-light',
      },
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini'],
    },
  },
})
