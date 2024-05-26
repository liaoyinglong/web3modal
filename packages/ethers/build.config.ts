/* eslint-disable */

import { defineBuildConfig } from 'unbuild'
import fs from 'fs'

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
  },
  hooks: {
    'mkdist:done'(ctx) {
      function getCurrentCommitHash() {
        try {
          const { execSync } = require('child_process')
          return execSync('git rev-parse HEAD').toString().trim()
        } catch (error) {
          console.error('Error getting current commit hash:', error)
          return 'Unknown'
        }
      }
      const currentCommitHash = `\
hash: ${getCurrentCommitHash()} 
time: ${new Date().toISOString()}`
      fs.writeFileSync('./build/commit-hash.txt', currentCommitHash)
    }
  }
})
