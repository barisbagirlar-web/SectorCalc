import { LitElement, html, css } from 'lit';
import type { StackResult } from '../tools/SC-008-tolerance-stack/v1.0.0/formula.js';
import { buildReportData } from '../lib/report-data.js';

export class ScStackResult extends LitElement {
  static properties = { result: { type: Object } };
  static styles = css`
    :host { display: block; }
    .verdict { font: 800 22px var(--sc-sans, system-ui); padding: 8px 12px; border-radius: 8px; display: inline-block; }
    .ok { background: #eafaf1; color: #27ae60; } .bad { background: #fdedec; color: #e74c3c; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 12px 0; }
    .cell { background: #f8f9fa; border-radius: 8px; padding: 8px 10px; }
    .k { font: 11px var(--sc-sans, system-ui); color: var(--sc-muted, #636e72); }
    .v { font: 700 16px var(--sc-mono, monospace); color: var(--sc-steel, #2d3436); }
    table { width: 100%; border-collapse: collapse; font: 13px var(--sc-sans, system-ui); }
    td { padding: 5px 4px; border-bottom: 1px solid #ecf0f1; } td.num { text-align: right; font-family: var(--sc-mono, monospace); }
    details { margin-top: 8px; } summary { cursor: pointer; font-weight: 600; }
    pre { font: 12px var(--sc-mono, monospace); background: #f8f9fa; padding: 8px; border-radius: 6px; overflow-x: auto; }
    .empty { color: var(--sc-muted, #636e72); }
    .risk { margin: 12px 0; }
    .ri { padding: 8px 10px; border-radius: 8px; font: 13px var(--sc-sans, system-ui); margin-bottom: 6px; }
    .ri em { color: var(--sc-muted, #636e72); font-style: normal; }
    .ri.critical { background: #fdedec; border-left: 4px solid #e74c3c; }
    .ri.warning { background: #fef9e7; border-left: 4px solid #f39c12; }
    .ri.pass { background: #eafaf1; border-left: 4px solid #27ae60; }
    .block h4 { font: 700 14px var(--sc-sans, system-ui); margin: 12px 0 6px; }
    .block ul { margin: 0; padding-left: 18px; font: 13px var(--sc-sans, system-ui); line-height: 1.7; }
  `;
  declare result: StackResult | null;
  constructor() { super(); this.result = null; }
  render() {
    if (!this.result) return html`<div class="empty">Edit the stack to see the analysis.</div>`;
    const r = this.result;
    const capable = Number(r.cpk) >= 1;
    const report = buildReportData(r);
    return html`
      <div class="verdict ${capable ? 'ok' : 'bad'}">${capable ? 'CAPABLE' : 'NOT CAPABLE'} · Cpk ${r.cpk}</div>
      <div class="grid">
        <div class="cell"><div class="k">Worst-case</div><div class="v">+/- ${r.worstPlus}</div></div>
        <div class="cell"><div class="k">RSS</div><div class="v">+/- ${r.rssPlus}</div></div>
        <div class="cell"><div class="k">Monte Carlo std</div><div class="v">${r.mcStd}</div></div>
        <div class="cell"><div class="k">Cp</div><div class="v">${r.cp}</div></div>
        <div class="cell"><div class="k">Defect</div><div class="v">${r.ppm} ppm</div></div>
        <div class="cell"><div class="k">Nominal sum</div><div class="v">${r.nominalSum}</div></div>
      </div>
      <table>${r.pareto.map((p) => html`<tr><td>${p.name}</td><td class="num">${p.pct}%</td></tr>`)}</table>
      <div class="risk">
        ${report.riskAnalysis.map((x) => html`<div class="ri ${x.level.toLowerCase()}"><strong>${x.level}</strong> ${x.message} <em>→ ${x.recommendation}</em></div>`)}
      </div>
      <div class="block"><h4>Actionable insights</h4><ul>${report.insights.map((i) => html`<li>${i}</li>`)}</ul></div>
      <div class="block"><h4>Standards</h4><ul>${report.standards.map((s) => html`<li>${s}</li>`)}</ul></div>
      <details><summary>Show me the math</summary>
        <pre>${r.steps.map((s) => `${s.step}. ${s.description}\n   ${s.formula}\n   = ${s.result}`).join('\n\n')}</pre>
      </details>
    `;
  }
}
if (!customElements.get('sc-stack-result')) customElements.define('sc-stack-result', ScStackResult);
