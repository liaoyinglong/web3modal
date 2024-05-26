import '@web3modal/polyfills'
import type { Metadata, Provider, ProviderType } from '@web3modal/scaffold-utils/ethers'
// 暂不需要
//import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import type { SocialProvider } from '@web3modal/scaffold-utils'

export interface ConfigOptions {
  enableEIP6963?: boolean
  enableCoinbase?: boolean
  enableEmail?: boolean
  auth?: {
    socials?: SocialProvider[]
    showWallets?: boolean
  }
  enableInjected?: boolean
  rpcUrl?: string
  defaultChainId?: number
  metadata: Metadata
}

export function defaultConfig(options: ConfigOptions) {
  const {
    enableEIP6963 = true,
    enableCoinbase = true,
    enableInjected = true,
    enableEmail = false,
    auth,
    metadata,
    rpcUrl,
    defaultChainId
  } = options

  let injectedProvider: Provider | undefined = undefined

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  //let coinbaseProvider: Provider | undefined = undefined

  const providers: ProviderType = { metadata }

  function getInjectedProvider() {
    if (injectedProvider) {
      return injectedProvider
    }

    if (typeof window === 'undefined') {
      return undefined
    }

    if (!window.ethereum) {
      return undefined
    }

    //  @ts-expect-error window.ethereum satisfies Provider
    injectedProvider = window.ethereum

    return injectedProvider
  }

  //function getCoinbaseProvider() {
  //  if (coinbaseProvider) {
  //    return coinbaseProvider
  //  }

  //  if (typeof window === 'undefined') {
  //    return undefined
  //  }

  //  const coinbaseWallet = new CoinbaseWalletSDK({
  //    appName: metadata.name,
  //    appLogoUrl: metadata.icons[0],
  //    darkMode: false,
  //    enableMobileWalletLink: true
  //  })

  //  coinbaseProvider = coinbaseWallet.makeWeb3Provider(rpcUrl, defaultChainId)

  //  return coinbaseProvider
  //}

  if (enableInjected) {
    providers.injected = getInjectedProvider()
  }

  if (enableCoinbase && rpcUrl && defaultChainId) {
    throw new Error('Coinbase is not supported yet')
    //providers.coinbase = getCoinbaseProvider()
  }

  if (enableEIP6963) {
    providers.EIP6963 = true
  }

  if (enableEmail) {
    providers.email = true
  }

  if (auth) {
    providers.auth = auth
  }

  return providers
}
