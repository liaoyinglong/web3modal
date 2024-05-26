import Bun from 'bun'
import path from 'path'
import fs from 'fs/promises'
const glob = new Bun.Glob('**/package.json')

const res = await Array.fromAsync(
  glob.scan({
    cwd: path.resolve(__dirname, '..', 'node_modules/@walletconnect'),
    followSymlinks: true,
    absolute: true
  })
)

const hasEsm = new Set<string>()
const notHasEsm = new Set<string>()
// 以下模块已经是 esm 的
const alreadyEsm = new Set([
  '@walletconnect/modal-ui',
  '@walletconnect/modal',
  '@walletconnect/modal-core',
  '@walletconnect/qrcode-modal',
  '@walletconnect/mobile-registry'
])

const deps: string[] = []

for (const v of res) {
  const notreal = Bun.file(v, { type: 'application/json' })

  const json = await notreal.json()

  deps.push(
    ...Object.keys({
      ...json?.dependencies,
      ...json?.devDependencies,
      ...json?.peerDependencies
    })
  )

  if (json.module || json.browser || alreadyEsm.has(json.name)) {
    continue
  }

  const dir = path.dirname(v)
  if (await fs.exists(path.join(dir, 'dist/esm/index.js'))) {
    hasEsm.add(v)
    // 添加 esm 导出配置
    json.module = 'dist/esm/index.js'
    await Bun.write(v, JSON.stringify(json, null, 2))
  } else {
    notHasEsm.add(v)
  }
}

const uniqDeps = [...new Set(deps)]
  .filter(
    v =>
      !v.includes('@types') &&
      !v.includes('@walletconnect') &&
      !v.startsWith('lit') &&
      !v.startsWith('@lit/')
  )
  .sort()

await Bun.write(
  path.resolve(__dirname, '..', 'packages/ethers/externals.json'),
  JSON.stringify(uniqDeps, null, 2)
)

//console.log(hasEsm)
//console.log(notHasEsm)
