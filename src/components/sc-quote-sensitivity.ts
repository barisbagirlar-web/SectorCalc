import { LitElement, html, css } from 'lit';

/**
 * SC-012 sliders: material cost, scrap rate, target margin.
 * Emits 'sc-quote-sensitivity' so the page re-prices deterministically.
 */
export interface QuoteSensitivityValue {
  materialCost: number;
  scrapRate: number;
  targetMargin: number;
}

export class ScQuoteSensitivity extends LitElement {
  static properties = {
    materialCost: { type: Number },
    scrapRate: { type: Number },
    targetMargin: { type: Number }
  };
  static styles = css`
    :host { display: block; }
    .row { margin-bottom: 10px; }
    label { display: flex; justify-content: space-between; font: 600 13px var(--sc-sans, system-ui); color: var(--sc-steel, #2d3436); }
    input[type=range] { width: 100%; }
    .val { font-family: var(--sc-mono, monospace); color: var(--sc-rust, #d35400); }
  `;

  declare materialCost: number;
  declare scrapRate: number;
  declare targetMargin: number;

  constructor() {
    super();
    this.materialCost = 1000;
    this.scrapRate = 0.1;
    this.targetMargin = 0.2;
  }

  private emit() {
    const detail: QuoteSensitivityValue = {
      materialCost: this.materialCost,
      scrapRate: this.scrapRate,
      targetMargin: this.targetMargin
    };
    this.dispatchEvent(new CustomEvent('sc-quote-sensitivity', { detail, bubbles: true, composed: true }));
  }

  private onMaterial(e: Event) { this.materialCost = Number((e.target as HTMLInputElement).value); this.emit(); }
  private onScrap(e: Event) { this.scrapRate = Number((e.target as HTMLInputElement).value); this.emit(); }
  private onMargin(e: Event) { this.targetMargin = Number((e.target as HTMLInputElement).value); this.emit(); }

  render() {
    return html`
      <div class="row">
        <label>Material cost <span class="val">${this.materialCost}</span></label>
        <input type="range" min="0" max="50000" step="50" .value=${String(this.materialCost)} @input=${this.onMaterial} />
      </div>
      <div class="row">
        <label>Scrap rate <span class="val">${(this.scrapRate * 100).toFixed(1)}%</span></label>
        <input type="range" min="0" max="0.5" step="0.01" .value=${String(this.scrapRate)} @input=${this.onScrap} />
      </div>
      <div class="row">
        <label>Target margin <span class="val">${(this.targetMargin * 100).toFixed(1)}%</span></label>
        <input type="range" min="0" max="0.5" step="0.01" .value=${String(this.targetMargin)} @input=${this.onMargin} />
      </div>
    `;
  }
}

if (!customElements.get('sc-quote-sensitivity')) customElements.define('sc-quote-sensitivity', ScQuoteSensitivity);
