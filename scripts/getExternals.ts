/**
 * 返回的都是需要处理成 external 的 lib
 */
export function getExternals(arr: string[]) {
  return arr
    .filter(
      v =>
        !v.startsWith('@types') &&
        // 本体
        !v.startsWith('@walletconnect') &&
        !v.startsWith('@web3modal') &&
        // node 依赖
        !v.startsWith('webpack') &&
        !v.endsWith('loader') &&
        !v.endsWith('cli') &&
        !v.startsWith('eslint') &&
        !v.startsWith('prettier') &&
        // 确认过了只有 web3modal 用的依赖
        !v.startsWith('@lit/') &&
        !v.startsWith('lit') &&
        // 好像是
        !v.startsWith('@stablelib') &&
        !['qrcode', 'uint8arrays'].includes(v)
    )
    .sort()
}
