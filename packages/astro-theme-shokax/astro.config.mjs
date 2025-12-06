import vue from '@astrojs/vue'
// @ts-check
import { defineConfig } from 'astro/config'

import UnoCSS from 'unocss/astro'

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), UnoCSS({
    injectReset: true,
  })],
})
