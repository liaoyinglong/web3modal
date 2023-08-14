import { subscribeKey as subKey } from 'valtio/utils'
import { proxy, ref } from 'valtio/vanilla'
import { CoreHelperUtil } from '../utils/CoreHelperUtil.js'
import { StorageUtil } from '../utils/StorageUtil.js'

// -- Types --------------------------------------------- //
export interface ConnectionControllerClient {
  connectWalletConnect: (onUri: (uri: string) => void) => Promise<void>
  disconnect: () => Promise<void>
  connectExternal?: (id: string) => Promise<void>
  connectInjected?: () => Promise<void>
  checkInjectedInstalled?: (ids?: string[]) => boolean
}

export interface ConnectionControllerState {
  _client?: ConnectionControllerClient
  wcUri?: string
  wcPromise?: Promise<void>
  wcPairingExpiry?: number
  wcLinking?: {
    href: string
    name: string
  }
}

type StateKey = keyof ConnectionControllerState

// -- State --------------------------------------------- //
const state = proxy<ConnectionControllerState>({})

// -- Controller ---------------------------------------- //
export const ConnectionController = {
  state,

  subscribeKey<K extends StateKey>(
    key: K,
    callback: (value: ConnectionControllerState[K]) => void
  ) {
    return subKey(state, key, callback)
  },

  _getClient() {
    if (!state._client) {
      throw new Error('ConnectionController client not set')
    }

    return state._client
  },

  setClient(client: ConnectionControllerClient) {
    state._client = ref(client)
  },

  connectWalletConnect() {
    state.wcPromise = this._getClient().connectWalletConnect(uri => {
      state.wcUri = uri
      state.wcPairingExpiry = CoreHelperUtil.getPairingExpiry()
    })
  },

  async connectExternal(id: string) {
    await this._getClient().connectExternal?.(id)
  },

  async connectInjected() {
    await this._getClient().connectInjected?.()
  },

  checkInjectedInstalled(ids?: string[]) {
    return this._getClient().checkInjectedInstalled?.(ids)
  },

  resetWcConnection() {
    state.wcUri = undefined
    state.wcPairingExpiry = undefined
    state.wcPromise = undefined
    state.wcLinking = undefined
  },

  setWcLinking(wcLinking: ConnectionControllerState['wcLinking']) {
    state.wcLinking = wcLinking
  },

  async disconnect() {
    await this._getClient().disconnect()
    StorageUtil.deleteWalletConnectDeepLink()
    this.resetWcConnection()
  }
}