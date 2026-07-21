import { LitElement, html, css } from 'lit';

/** Labeled enum dropdown. Emits 'sc-input' with the selected string value. */
export class ScSelectInput extends LitElement {
  static override properties = {
    label: { type: String },
    value: { type: String },
    options: { type: Array }
  };

  static override styles = css`
    :host { display: block; margin-bottom: 12px; }
    label { display: block; font: 600 14px var(--sc-sans, system-ui); color: var(--sc-steel, #2d3436); margin-bottom: 4px; }
    select { width: 100%; height: 48px; font: 16px var(--sc-sans, system-ui); padding: 0 12px;
             border: 1px solid #dfe6e9; border-radius: 8px; box-sizing: border-box; background: #fff; color: var(--sc-steel, #2d3436); }
  `;

  declare label: string;
  declare value: string;
  declare options: string[];

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.options = [];
  }

  private onChange(e: Event) {
    this.value = (e.target as HTMLSelectElement).value;
    this.dispatchEvent(new CustomEvent('sc-input', { detail: this.value, bubbles: true, composed: true }));
  }

  override render() {
    return html`
      <label>${this.label}</label>
      <select .value=${this.value} @change=${this.onChange}>
        ${this.options.map((o) => html`<option value=${o} ?selected=${o === this.value}>${o}</option>`)}
      </select>
    `;
  }
}

if (!customElements.get('sc-select-input')) customElements.define('sc-select-input', ScSelectInput);
