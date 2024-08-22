import adapter from '@sveltejs/adapter-node'
// import webkitConfig from 'san-webkit/svelte.config.js'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { componentStyleSelector } from 'san-webkit-next/plugins/svelte.js'

import preprocess from 'svelte-preprocess'
import cssModules from 'svelte-preprocess-cssmodules'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // ...webkitConfig,
  preprocess: [
    preprocess({
      typescript: false,
      scss: {
        prependData: `@import '~san-webkit/lib/styles/fn.scss';`,
      },
    }),
    vitePreprocess(),

    componentStyleSelector(),
    cssModules(),
  ],

  kit: {
    adapter: adapter({ out: 'build' }),
    serviceWorker: {
      register: false,
    },
    alias: {
      '$routes/*': './src/routes/*',
    },
  },
}

export default config;
