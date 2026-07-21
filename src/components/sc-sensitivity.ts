import { LitElement, html, css } from 'lit';

/**
 * Three sliders that re-price the job live. Emits 'sc-sensitivity' with the
 * three overrides so the page can re-run the engine deterministically.
 */
export interface SensitivityValue {
  netSalary: number;
  employerSSRate: number;
  overtimeHoursMonthly: number;
}

export class ScSensitivity extends LitElement {
  static properties = {
    netSalary: { type: Number },
    employerSSRate: { type: Number },
    overtimeHoursMonthly: { type: Number }
  };
  static styles = css`
    :host { display: block; }
    .row { margin-bottom: 10px; }
    label { display: flex; justify-content: space-between; font: 600 13px var(--sc-sans, system-ui); color: var(--sc-steel, #2d3436); }
    input[type=range] { width: 100%; }
    .val { font-family: var(--sc-mono, monospace); color: var(--sc-rust, #d35400); }
  `;

  declare netSalary: number;
  declare employerSSRate: number;
  declare overtimeHoursMonthly: number;

  constructor() {
    super();
    this.netSalary = 3500;
    this.employerSSRate = 0.0765;
    this.overtimeHoursMonthly = 0;
  }

  private emit() {
    const detail: SensitivityValue = {
      netSalary: this.netSalary,
      employerSSRate: this.employerSSRate,
      overtimeHoursMonthly: this.overtimeHoursMonthly
    };
    this.dispatchEvent(new CustomEvent('sc-sensitivity', { detail, bubbles: true, composed: true }));
  }

  private onNet(e: Event) { this.netSalary = Number((e.target as HTMLInputElement).value); this.emit(); }
  private onSS(e: Event) { this.employerSSRate = Number((e.target as HTMLInputElement).value); this.emit(); }
  private onOT(e: Event) { this.overtimeHoursMonthly = Number((e.target as HTMLInputElement).value); this.emit(); }

  render() {
    return html`
      <div class="row">
        <label>Net salary <span class="val">${this.netSalary}</span></label>
        <input type="range" min="0" max="20000" step="100" .value=${String(this.netSalary)} @input=${this.onNet} />
      </div>
      <div class="row">
        <label>Employer SS rate <span class="val">${(this.employerSSRate * 100).toFixed(1)}%</span></label>
        <input type="range" min="0" max="0.5" step="0.005" .value=${String(this.employerSSRate)} @input=${this.onSS} />
      </div>
      <div class="row">
        <label>Overtime h/month <span class="val">${this.overtimeHoursMonthly}</span></label>
        <input type="range" min="0" max="80" step="1" .value=${String(this.overtimeHoursMonthly)} @input=${this.onOT} />
      </div>
    `;
  }
}

if (!customElements.get('sc-sensitivity')) customElements.define('sc-sensitivity', ScSensitivity);
