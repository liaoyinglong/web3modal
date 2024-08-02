import { i, s, M as ModalController, A as AccountController, O as OptionsController, aF as ApiController, E as EventsController, x, C as ConnectionController, U as UiHelperUtil, e as initializeTheming, a as SnackController, aG as CoreHelperUtil, R as RouterController, r, aH as ThemeController, c as customElement } from '../shared/ethers.BeQUjUAB.mjs';
import 'bignumber.js';
import 'valtio/vanilla/utils';
import 'valtio/vanilla';
import 'dayjs';
import 'dayjs/locale/en.js';
import 'dayjs/plugin/relativeTime.js';
import 'dayjs/plugin/updateLocale.js';
import 'valtio/utils';
import 'buffer';
import 'zod';
import 'pino';
import 'valtio';
import 'qrcode';
import 'events';
import 'detect-browser';
import 'tslib';
import 'query-string';
import '@stablelib/chacha20poly1305';
import '@stablelib/hkdf';
import '@stablelib/random';
import '@stablelib/sha256';
import '@stablelib/x25519';
import 'uint8arrays';
import 'unstorage';
import 'idb-keyval';
import '@stablelib/ed25519';
import 'uint8arrays/concat';
import 'uint8arrays/to-string';
import 'uint8arrays/from-string';
import 'lodash.isequal';
import 'isomorphic-unfetch';
import 'cross-fetch';
import 'ethers';

const styles = i`
  :host {
    z-index: var(--w3m-z-index);
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: var(--wui-cover);
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
  }

  @keyframes zoom-in {
    0% {
      transform: scale(0.95) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    0% {
      transform: scale(1) translateY(50px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  wui-card {
    max-width: var(--w3m-modal-width);
    width: 100%;
    position: relative;
    animation-duration: 0.2s;
    animation-name: zoom-in;
    animation-fill-mode: backwards;
    animation-timing-function: var(--wui-ease-out-power-2);
    outline: none;
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--wui-spacing-xxl) 0px;
    }
  }

  @media (max-width: 430px) {
    wui-flex {
      align-items: flex-end;
    }

    wui-card {
      max-width: 100%;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
      animation-name: slide-in;
    }
  }
`;

var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const SCROLL_LOCK = "scroll-lock";
let W3mModal = class W3mModal2 extends s {
  constructor() {
    super();
    this.unsubscribe = [];
    this.abortController = void 0;
    this.open = ModalController.state.open;
    this.caipAddress = AccountController.state.caipAddress;
    this.isSiweEnabled = OptionsController.state.isSiweEnabled;
    this.connected = AccountController.state.isConnected;
    this.loading = ModalController.state.loading;
    this.initializeTheming();
    ApiController.prefetch();
    this.unsubscribe.push(ModalController.subscribeKey("open", (val) => val ? this.onOpen() : this.onClose()), ModalController.subscribeKey("loading", (val) => {
      this.loading = val;
      this.onNewAddress(AccountController.state.caipAddress);
    }), AccountController.subscribeKey("isConnected", (val) => this.connected = val), AccountController.subscribeKey("caipAddress", (val) => this.onNewAddress(val)), OptionsController.subscribeKey("isSiweEnabled", (val) => this.isSiweEnabled = val));
    EventsController.sendEvent({ type: "track", event: "MODAL_LOADED" });
  }
  disconnectedCallback() {
    this.unsubscribe.forEach((unsubscribe) => unsubscribe());
    this.onRemoveKeyboardListener();
  }
  render() {
    return this.open ? x`
          <wui-flex @click=${this.onOverlayClick.bind(this)}>
            <wui-card role="alertdialog" aria-modal="true" tabindex="0">
              <w3m-header></w3m-header>
              <w3m-router></w3m-router>
              <w3m-snackbar></w3m-snackbar>
            </wui-card>
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        ` : null;
  }
  async onOverlayClick(event) {
    if (event.target === event.currentTarget) {
      await this.handleClose();
    }
  }
  async handleClose() {
    if (this.isSiweEnabled) {
      const { SIWEController } = await import('./index.mjs');
      if (SIWEController.state.status !== "success" && this.connected) {
        await ConnectionController.disconnect();
      }
    }
    ModalController.close();
  }
  initializeTheming() {
    const { themeVariables, themeMode } = ThemeController.state;
    const defaultThemeMode = UiHelperUtil.getColorTheme(themeMode);
    initializeTheming(themeVariables, defaultThemeMode);
  }
  onClose() {
    this.open = false;
    this.classList.remove("open");
    this.onScrollUnlock();
    SnackController.hide();
    this.onRemoveKeyboardListener();
  }
  onOpen() {
    this.open = true;
    this.classList.add("open");
    this.onScrollLock();
    this.onAddKeyboardListener();
  }
  onScrollLock() {
    const styleTag = document.createElement("style");
    styleTag.dataset["w3m"] = SCROLL_LOCK;
    styleTag.textContent = `
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `;
    document.head.appendChild(styleTag);
  }
  onScrollUnlock() {
    const styleTag = document.head.querySelector(`style[data-w3m="${SCROLL_LOCK}"]`);
    if (styleTag) {
      styleTag.remove();
    }
  }
  onAddKeyboardListener() {
    this.abortController = new AbortController();
    const card = this.shadowRoot?.querySelector("wui-card");
    card?.focus();
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.handleClose();
      } else if (event.key === "Tab") {
        const { tagName } = event.target;
        if (tagName && !tagName.includes("W3M-") && !tagName.includes("WUI-")) {
          card?.focus();
        }
      }
    }, this.abortController);
  }
  onRemoveKeyboardListener() {
    this.abortController?.abort();
    this.abortController = void 0;
  }
  async onNewAddress(caipAddress) {
    if (!this.connected || this.loading) {
      return;
    }
    const previousAddress = CoreHelperUtil.getPlainAddress(this.caipAddress);
    const newAddress = CoreHelperUtil.getPlainAddress(caipAddress);
    const previousNetworkId = CoreHelperUtil.getNetworkId(this.caipAddress);
    const newNetworkId = CoreHelperUtil.getNetworkId(caipAddress);
    this.caipAddress = caipAddress;
    if (this.isSiweEnabled) {
      const { SIWEController } = await import('./index.mjs');
      const session = await SIWEController.getSession();
      if (session && previousAddress && newAddress && previousAddress !== newAddress) {
        if (SIWEController.state._client?.options.signOutOnAccountChange) {
          await SIWEController.signOut();
          this.onSiweNavigation();
        }
        return;
      }
      if (session && previousNetworkId && newNetworkId && previousNetworkId !== newNetworkId) {
        if (SIWEController.state._client?.options.signOutOnNetworkChange) {
          await SIWEController.signOut();
          this.onSiweNavigation();
        }
        return;
      }
      this.onSiweNavigation();
    }
  }
  onSiweNavigation() {
    if (this.open) {
      RouterController.push("ConnectingSiwe");
    } else {
      ModalController.open({
        view: "ConnectingSiwe"
      });
    }
  }
};
W3mModal.styles = styles;
__decorate([
  r()
], W3mModal.prototype, "open", void 0);
__decorate([
  r()
], W3mModal.prototype, "caipAddress", void 0);
__decorate([
  r()
], W3mModal.prototype, "isSiweEnabled", void 0);
__decorate([
  r()
], W3mModal.prototype, "connected", void 0);
__decorate([
  r()
], W3mModal.prototype, "loading", void 0);
W3mModal = __decorate([
  customElement("w3m-modal")
], W3mModal);

export { W3mModal };
