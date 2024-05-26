/* eslint-disable */

import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  // If entries is not provided, will be automatically inferred from package.json
  entries: ['./exports/index.ts'],

  // Change outDir, default is 'dist'
  outDir: 'build',

  // Generates .d.ts declaration file
  declaration: false,
  failOnWarn: false,
  externals: [...require('./externals.json'), ...require('./externals-web3modal.json')],
  replace: {
    'typeof window': JSON.stringify('object')
  },
  rollup: {
    resolve: {
      browser: true
    }
  }
})
