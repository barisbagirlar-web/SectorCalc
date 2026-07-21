import { LitElement, html, css } from 'lit';

/**
 * SC-001 result. Hero = required leg (mm + in). Metric grid + a utilization bar
 * drawn in pure CSS (no chart lib — SC-001 has no breakdown to doughnut).
 */
export interface WeldResultData {
  finalLegMm: string;
  finalLegIn: string;
  requiredThroatMm: string;
  minLegMm: string;
  legFromLoadMm: string;
  utilization: string;
  jointType: string;
  steps: Array<{ step: number; description: string; formula: string; result: string }>;
}

export class ScWeldResult extends LitElement {
  static properties = { result: { type: Object } };
  static styles = css`
    :host { display: block; }
    .hero { font: 800 38px var(--sc-mono, monospace); color: var(--sc-rust, #d35400); }
    .meta { font: 14px var(--sc-sans, system-ui); color: var(--sc-muted, #636e72); margin-bottom: 12px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
    .cell { background: #f8f9fa; border-radius: 8px; padding: 8px 10px; }
    .cell .k { font: 12px var(--sc-sans, system-ui); color: var(--sc-muted, #636e72); }
    .cell .v { font: 600 16px var(--sc-mono, monospace); color: var(--sc-steel, #2d3436); }
    .bar { height: 10px; background: #ecf0f1; border-radius: 5px; overflow: hidden; margin: 4px 0 12px; }
    .bar > span { display: block; height: 100%; background: var(--sc-chip, #27ae60); }
    details { margin-top: 8px; } summary { cursor: pointer; font-weight: 600; }
    pre { font: 12px var(--sc-mono, monospace); background: #f8f9fa; padding: 8px; border-radius: 6px; overflow-x: auto; }
    .empty { color: var(--sc-muted, #636e72); }
  `;

  declare result: WeldResultData | null;
  constructor() { super(); this.result = null; }

  render() {
    if (!this.result) return html`<div class="empty">Run the numbers to size the weld.</div>`;
    const r = this.result;
    const pct = Math.max(0, Math.min(100, Number(r.utilization) * 100));
    return html`
      <div class="hero">${r.finalLegMm} mm <span style="font-size:20px">(${r.finalLegIn} in)</span></div>
      <div class="meta">${r.jointType} weld · required leg</div>
      <div class="bar"><span style="width:${pct}%"></span></div>
      <div class="grid">
        <div class="cell"><div class="k">Utilization</div><div class="v">${r.utilization}</div></div>
        <div class="cell"><div class="k">Required throat</div><div class="v">${r.requiredThroatMm} mm</div></div>
        <div class="cell"><div class="k">Min leg (code)</div><div class="v">${r.minLegMm} mm</div></div>
        <div class="cell"><div class="k">Leg from load</div><div class="v">${r.legFromLoadMm} mm</div></div>
      </div>
      <details>
        <summary>Show me the math</summary>
        <pre>${r.steps.map((s) => `${s.step}. ${s.description}\n   ${s.formula}\n   = ${s.result}`).join('\n\n')}</pre>
      </details>
    `;
  }
}

if (!customElements.get('sc-weld-result')) customElements.define('sc-weld-result', ScWeldResult);
