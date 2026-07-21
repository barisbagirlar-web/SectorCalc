import { LitElement, html, css } from 'lit';

/**
 * SC-001 sliders: design load, material thickness, safety factor.
 * Three sliders => three emit handlers, each covered by its own test.
 */
export interface WeldSensitivityValue {
  designLoadN: number;
  materialThicknessMm: number;
  safetyFactor: number;
}

export class ScWeldSensitivity extends LitElement {
  static properties = {
    designLoadN: { type: Number },
    materialThicknessMm: { type: Number },
    safetyFactor: { type: Number }
  };
  static styles = css`
    :host { display: block; }
    .row { margin-bottom: 10px; }
    label { display: flex; justify-content: space-between; font: 600 13px var(--sc-sans, system-ui); color: var(--sc-steel, #2d3436); }
    input[type=range] { width: 100%; }
    .val { font-family: var(--sc-mono, monospace); color: var(--sc-rust, #d35400); }
  `;

  declare designLoadN: number;
  declare materialThicknessMm: number;
  declare safetyFactor: number;

  constructor() {
    super();
    this.designLoadN = 50000;
    this.materialThicknessMm = 10;
    this.safetyFactor = 2;
  }

  private emit() {
    const detail: WeldSensitivityValue = {
      designLoadN: this.designLoadN,
      materialThicknessMm: this.materialThicknessMm,
      safetyFactor: this.safetyFactor
    };
    this.dispatchEvent(new CustomEvent('sc-weld-sensitivity', { detail, bubbles: true, composed: true }));
  }

  private onLoad(e: Event) { this.designLoadN = Number((e.target as HTMLInputElement).value); this.emit(); }
  private onThickness(e: Event) { this.materialThicknessMm = Number((e.target as HTMLInputElement).value); this.emit(); }
  private onSafety(e: Event) { this.safetyFactor = Number((e.target as HTMLInputElement).value); this.emit(); }

  render() {
    return html`
      <div class="row">
        <label>Design load (N) <span class="val">${this.designLoadN}</span></label>
        <input type="range" min="0" max="1000000" step="1000" .value=${String(this.designLoadN)} @input=${this.onLoad} />
      </div>
      <div class="row">
        <label>Material thickness (mm) <span class="val">${this.materialThicknessMm}</span></label>
        <input type="range" min="1" max="100" step="1" .value=${String(this.materialThicknessMm)} @input=${this.onThickness} />
      </div>
      <div class="row">
        <label>Safety factor <span class="val">${this.safetyFactor}</span></label>
        <input type="range" min="1" max="5" step="0.1" .value=${String(this.safetyFactor)} @input=${this.onSafety} />
      </div>
    `;
  }
}

if (!customElements.get('sc-weld-sensitivity')) customElements.define('sc-weld-sensitivity', ScWeldSensitivity);
