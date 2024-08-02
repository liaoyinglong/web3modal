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
  //externals: [
  //  // 这个构建出来有 bug 因为添加 __proto__，多个 __proto__ 在运行时会报错
  //  'multiformats',
  //  // 不是 web3modal 和 walletconnect 的包
  //  /^(?!@web3modal)(?!@walletconnect).*/
  //],
  replace: {
    'typeof window': JSON.stringify('object')
  },
  rollup: {
    resolve: {
      browser: true
    }
  },
  hooks: {
    'rollup:options'(ctx, options) {
      const originalExternal = options.external as Function
      options.external = (id, importer, isResolved) => {
        if (
          // 内部包 外部不会有人用
          id.startsWith('@web3modal') ||
          id.startsWith('@walletconnect') ||
          id[0] === '/' ||
          id[0] === '.' ||
          // lit 也是业务方不会用的
          id === 'lit' ||
          id.startsWith('lit/') ||
          id.startsWith('lit-') ||
          id.startsWith('@lit/')
        ) {
          return false
        }

        //console.log('not bundle: ', isResolved)
        //console.log(`id      = ${id}`)
        //console.log(`importer= ${importer}`)

        return true
      }
    },
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
