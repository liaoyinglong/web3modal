import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { getSpacingStyles } from '../../utils/HelperUtils'
import { resetStyles } from '../../utils/ThemeUtil'
import type { GridContentType, GridItemsType, SpacingType } from '../../utils/TypesUtil'
import styles from './styles'

@customElement('wui-grid')
export class WuiGrid extends LitElement {
  public static styles = [resetStyles, styles]

  // -- State & Properties -------------------------------- //
  @property() public gridTemplateRows?: string

  @property() public gridTemplateColumns?: string

  @property() public justifyItems?: GridItemsType

  @property() public alignItems?: GridItemsType

  @property() public justifyContent?: GridContentType

  @property() public alignContent?: GridContentType

  @property() public columnGap?: SpacingType

  @property() public rowGap?: SpacingType

  @property() public gap?: SpacingType

  @property() public padding?: SpacingType | SpacingType[]

  @property() public margin?: SpacingType | SpacingType[]

  // -- Render -------------------------------------------- //
  public render() {
    this.style.cssText = `
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap && `var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap && `var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap && `var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding && getSpacingStyles(this.padding, 0)};
      padding-right: ${this.padding && getSpacingStyles(this.padding, 1)};
      padding-bottom: ${this.padding && getSpacingStyles(this.padding, 2)};
      padding-left: ${this.padding && getSpacingStyles(this.padding, 3)};
      margin-top: ${this.margin && getSpacingStyles(this.margin, 0)};
      margin-right: ${this.margin && getSpacingStyles(this.margin, 1)};
      margin-bottom: ${this.margin && getSpacingStyles(this.margin, 2)};
      margin-left: ${this.margin && getSpacingStyles(this.margin, 3)};
    `

    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wui-grid': WuiGrid
  }
}