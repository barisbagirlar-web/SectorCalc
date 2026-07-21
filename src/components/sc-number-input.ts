import { LitElement, html, css } from 'lit';

/**
 * Labeled number input with inline validation message.
 * Emits 'sc-input' with the raw string value on every keystroke.
 * No decorators: static properties + manual define (zero config, robust).
 */
export class ScNumberInput extends LitElement {
  static override properties = {
    label: { type: String },
    value: { type: String },
    min: { type: String },
    max: { type: String },
    step: { type: String },
    errorMessage: { type: String }
  };

  static override styles = css`
    :host { display: block; margin-bottom: 12px; }
    label { display: block; font: 600 14px var(--sc-sans, system-ui); color: var(--sc-steel, #2d3436); margin-bottom: 4px; }
    input { width: 100%; height: 48px; font: 18px var(--sc-mono, monospace); padding: 0 12px;
            border: 1px solid #dfe6e9; border-radius: 8px; box-sizing: border-box; color: var(--sc-steel, #2d3436); }
    input:focus { outline: 2px solid var(--sc-rust, #d35400); border-color: var(--sc-rust, #d35400); }
    .err { color: #e74c3c; font: 13px var(--sc-sans, system-ui); margin-top: 4px; min-height: 16px; }
  `;

  declare label: string;
  declare value: string;
  declare min: string;
  declare max: string;
  declare step: string;
  declare errorMessage: string;

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.min = '';
    this.max = '';
    this.step = '';
    this.errorMessage = '';
  }

  private onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('sc-input', { detail: this.value, bubbles: true, composed: true }));
  }

  override render() {
    return html`
      <label>${this.label}</label>
      <input type="number" .value=${this.value} min=${this.min} max=${this.max} step=${this.step} @input=${this.onInput} />
      <div class="err">${this.errorMessage}</div>
    `;
  }
}

if (!customElements.get('sc-number-input')) customElements.define('sc-number-input', ScNumberInput);
