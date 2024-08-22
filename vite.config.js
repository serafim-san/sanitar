import { createRequire } from 'node:module'
import { sveltekit } from '@sveltejs/kit/vite'
import mkcert from 'vite-plugin-mkcert'
import { WebkitSvg } from 'san-webkit-next/plugins/vite.js'

global.require = createRequire(import.meta.url)

const mode = process.env.NODE_ENV
const dev = mode !== 'production'

process.env.MEDIA_PATH = '/webkit'
process.env.ICONS_PATH = process.env.MEDIA_PATH + '/icons'

const BACKEND_URL = process.env.BACKEND_URL || 'https://api.santiment.net'
process.env.BACKEND_URL = BACKEND_URL

const GQL_SERVER_FALLBACK = process.env.BACKEND_URL + '/graphql'

const IS_STAGE_BACKEND = process.env.BACKEND_URL.includes('-stage')
const IS_PROD_BACKEND = !IS_STAGE_BACKEND


console.log('BACKEND_URL -> ', JSON.stringify(process.env.BACKEND_URL))
console.log('IS_PROD_MODE -> ', !dev)
console.log('IS_PROD_BACKEND -> ', IS_PROD_BACKEND)

// NOTE: Forcing ethers/lib.esm variant during build to remove errors about top-level `this` usage  [@vanguard | 10 Jan, 2023]
const aliases = dev
  ? [{ find: 'san-studio', replacement: __dirname + '/node_modules/san-studio/' }]
  : [
    { find: 'ethers', replacement: '/node_modules/ethers/lib.esm/' },
    { find: 'san-webkit', replacement: '/node_modules/san-webkit/' },
    { find: 'san-studio', replacement: '/node_modules/san-studio/' },
  ]

//FIXME:
/** @type {import('vite').UserConfig & {test: any, clientDefines: any, serverDefines: any}} */
const config = {
  plugins: [
    process.argv.includes('--https') && mkcert({ savePath: './mkcert' }),
    sveltekit(),
    WebkitSvg(),
  ],

  server: {
    port: 3000,
  },

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },

  resolve: {
    alias: [
      { find: 'webkit', replacement: '/node_modules/san-webkit/lib/' },
      { find: 'studio', replacement: '/node_modules/san-studio/lib/' },
      { find: '@apollo/react-hooks', replacement: __dirname + '/node_modules/@apollo/react-hooks' },
      { find: 'react', replacement: __dirname + '/node_modules/react' },
      { find: 'react-dom', replacement: __dirname + '/node_modules/react-dom' },
      { find: 'react-redux', replacement: __dirname + '/node_modules/react-redux' },
    ].concat(aliases),
  },

  define: {
    'process.browser': false,
    'process.env.NODE_ENV':
      process.env.NODE_ENV === 'production' ? '"production"' : '"development"',

    'process.env.IS_DEV_MODE': dev,
    'process.env.IS_PROD_MODE': !dev,

    'process.env.MEDIA_PATH': JSON.stringify(process.env.MEDIA_PATH),
    'process.env.ICONS_PATH': JSON.stringify(process.env.ICONS_PATH),

    'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
    'process.env.GQL_SERVER_URL': JSON.stringify(GQL_SERVER_FALLBACK),

    'process.env.IS_STAGE_BACKEND': IS_STAGE_BACKEND,
    'process.env.IS_PROD_BACKEND': IS_PROD_BACKEND,

    'process.env.API_FETCH_ORIGIN': JSON.stringify('https://app.santiment.net'),
    'process.env.SANBASE_ORIGIN': JSON.stringify(''),

    'process.env.PRODUCTION_SENTRY_DSN': JSON.stringify(
      IS_STAGE_BACKEND ? '' : process.env.PRODUCTION_SENTRY_DSN,
    ),
    'process.env.STAGE_SENTRY_DSN': JSON.stringify(
      IS_STAGE_BACKEND ? process.env.STAGE_SENTRY_DSN : '',
    ),
  },

  clientDefines: {
    'process.browser': true,
  },

  serverDefines: {
    'process.env.GQL_SERVER_URL': JSON.stringify(process.env.GQL_SERVER_URL || GQL_SERVER_FALLBACK),
  },

  optimizeDeps: {
    exclude: ['canvas'],
  },

  ssr: {
    noExternal: [
      '@santiment-network/chart',
      'chart.js',
      'Sanbase',
      'san-queries',
      // 'san-studio'
    ],
  },
}

export default config
