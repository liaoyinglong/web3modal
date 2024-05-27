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
  externals: [
    // 这个构建出来有 bug 因为添加 __proto__，多个 __proto__ 在运行时会报错
    'multiformats',

    ...require('./externals.json'),
    ...require('./externals-web3modal.json')
  ],
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
      const { execSync } = require('child_process')
      const pkg = require('./package.json')
      const currentCommitHash = `\
hash    : ${execSync('git rev-parse HEAD').toString().trim()} 
time    : ${new Date().toISOString()}
name    : ${pkg.name}
version : ${pkg.version}`
      fs.writeFileSync('./build/commit-hash.md', currentCommitHash)
    }
  }
})
