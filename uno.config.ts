import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno, presetWebFonts, transformerDirectives } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

export default defineConfig({
  content: {
    filesystem: [
      'content/**/*.md',
    ],
  },
  shortcuts: [
    {
      'bg-color-base': 'bg-white dark:bg-black',
      'text-color-base': 'text-gray-700 dark:text-gray-200',
    },
  ],
  presets: [
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'height': '1.2em',
        'width': '1.2em',
        'vertical-align': 'text-bottom',
      },
      collections: {
        app: FileSystemIconLoader('./assets/icons', (svg: string) =>
          svg.replaceAll(/#fff/g, 'currentColor'),
        ),
      },
    }),
    presetAttributify(),
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,600,800',
        mono: 'DM Mono:400,600',
      },
    }),
    presetTypography({
      cssExtend: {
        'a': {
          'text-decoration': 'none',
          'border-bottom': '1px solid rgba(125,125,125,.3)',
          'transition': 'border .3s ease-in-out',
        },
        'a:hover': {
          'border-bottom-color': 'var(--kejun-primary-color)',
        },
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    colors: {
      primary: 'var(--kejun-primary-color)',
    },
  },
})
