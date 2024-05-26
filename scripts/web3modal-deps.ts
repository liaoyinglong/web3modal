import Bun from 'bun'
import path from 'path'
import fs from 'fs/promises'
import { getExternals } from './getExternals'
const glob = new Bun.Glob('**/package.json')

let scannedFiles = await Array.fromAsync(
  glob.scan({
    cwd: path.resolve(__dirname, '..', 'packages'),
    followSymlinks: true,
    absolute: true
  })
)
const filteredFiles = scannedFiles.filter(file => !file.includes('node_modules'))

const deps: string[] = []

for (const v of filteredFiles) {
  const notreal = Bun.file(v, { type: 'application/json' })

  const json = await notreal.json()

  deps.push(
    ...Object.keys({
      ...json?.dependencies,
      ...json?.devDependencies,
      ...json?.peerDependencies
    })
  )
}

const uniqDeps = getExternals([...new Set(deps)])

await Bun.write(
  path.resolve(__dirname, '..', 'packages/ethers/externals-web3modal.json'),
  JSON.stringify(uniqDeps, null, 2)
)
