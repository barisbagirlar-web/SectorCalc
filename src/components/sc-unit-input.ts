import { LitElement, html, css } from 'lit';
import { listUnits, convert } from '../core/unit-converter.js';

/**
 * Universal unit-aware input (vision items A-E).
 *  - A placeholder defaults (prop)
 *  - B unit picker per dimension (engine: listUnits/convert)
 *  - C live unit label (visible select)
 *  - D validation + inline error message (min/max)
 *  - E tooltip info badge
 * Changing the unit auto-converts the current value (no manual math, no unit
 * confusion — the #1 Excel mistake). Emits 'sc-unit-change' {value, unit}.
 */
export class ScUnitInput extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    unit: { type: String },
    dimension: { type: String },
    placeholder: { type: String },
    tooltip: { type: String },
    min: { type: String },
    max: { type: String },
    errorMessage: { type: String }
  };

  declare label: string;
  declare value: string;
  declare unit: string;
  declare dimension: string;
  declare placeholder: string;
  declare tooltip: string;
  declare min: string;
  declare max: string;
  declare errorMessage: string;

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.unit = '';
    this.dimension = 'length';
    this.placeholder = '';
    this.tooltip = '';
    this.min = '';
    this.max = '';
    this.errorMessage = '';
  }

  private get units(): string[] {
    return this.dimension ? listUnits(this.dimension) : [];
  }

  private onValue(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.emit();
  }

  private onUnit(e: Event) {
    const next = (e.target as HTMLSelectElement).value;
    if (this.unit && next !== this.unit && this.value !== '') {
      try {
        this.value = convert(this.value, this.unit, next, this.dimension).toFixed(4);
      } catch {
        // unknown unit pair — keep the raw value, do not corrupt it
      }
    }
    this.unit = next;
    this.emit();
  }

  private emit() {
    this.dispatchEvent(new CustomEvent('sc-unit-change', { detail: { value: this.value, unit: this.unit }, bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="field">
        <label>
          ${this.label}
          ${this.tooltip ? html`<span class="tip" title=${this.tooltip}>i</span>` : html``}
        </label>
        <div class="row">
          <input type="number" .value=${this.value} placeholder=${this.placeholder} min=${this.min} max=${this.max} @input=${this.onValue} />
          <select .value=${this.unit} @change=${this.onUnit} aria-label="unit">
            ${this.units.map((u) => html`<option value=${u} ?selected=${u === this.unit}>${u}</option>`)}
          </select>
        </div>
        ${this.errorMessage ? html`<div class="err">${this.errorMessage}</div>` : html``}
      </div>
    `;
  }

  static styles = css`
    :host { display: block; margin-bottom: 12px; }
    label { display: flex; align-items: center; gap: 6px; font: 600 13px var(--sc-sans, system-ui); color: var(--sc-steel, #2d3436); margin-bottom: 4px; }
    .tip { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; background: #dfe6e9; color: #2d3436; font: 700 10px var(--sc-sans, system-ui); cursor: help; }
    .row { display: flex; gap: 6px; }
    .row input { flex: 1; height: 40px; font: 15px var(--sc-mono, monospace); padding: 0 10px; border: 1px solid #dfe6e9; border-radius: 8px; box-sizing: border-box; }
    .row select { width: 84px; height: 40px; font: 13px var(--sc-sans, system-ui); border: 1px solid #dfe6e9; border-radius: 8px; background: #fff; }
    .err { color: #e74c3c; font: 12px var(--sc-sans, system-ui); margin-top: 4px; }
  `;
}
if (!customElements.get('sc-unit-input')) customElements.define('sc-unit-input', ScUnitInput);
