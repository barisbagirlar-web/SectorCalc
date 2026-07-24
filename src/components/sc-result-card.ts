/**
 * Result card for calculator output. Empty state until a result arrives.
 * Shows hero cost, cost multiplier, breakdown table, and expandable steps.
 */
import { LitElement, html, css } from 'lit';

export interface ResultData {
  trueMonthlyCost: string;
  currency: string;
  costMultiplier: string;
  hiddenCostPct: string;
  breakdown: Array<{ item: string; amount: string; pct: string }>;
  steps: Array<{ step: number; description: string; formula: string; result: string }>;
}

export class ScResultCard extends LitElement {
  static properties = { result: { type: Object } };

  static styles = css`
    :host { display: block; margin-bottom: 16px; color: var(--text-primary, #2d3436); }
    .empty { color: var(--text-muted, var(--sc-muted, #636e72)); font: 14px var(--sc-sans, system-ui); padding: 12px 0; }
    .hero { font: 700 28px var(--sc-mono, monospace); color: var(--text-primary, var(--sc-steel, #2d3436)); margin-bottom: 4px; }
    .meta { color: var(--text-muted, var(--sc-muted, #636e72)); font: 14px var(--sc-sans, system-ui); margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font: 14px var(--sc-sans, system-ui); margin-bottom: 12px; }
    td { padding: 6px 0; border-bottom: 1px solid var(--border-subtle, #dfe6e9); color: var(--text-primary, #2d3436); }
    td:last-child { text-align: right; font-family: var(--sc-mono, monospace); }
    details { font: 13px var(--sc-sans, system-ui); color: var(--text-muted, var(--sc-muted, #636e72)); }
    summary { cursor: pointer; font-weight: 600; color: var(--text-primary, var(--sc-steel, #2d3436)); }
    .step { margin: 6px 0; font-family: var(--sc-mono, monospace); font-size: 12px; }
  `;

  declare result: ResultData | null;

  constructor() {
    super();
    this.result = null;
  }

  render() {
    if (!this.result) {
      return html`<div class="empty">Run the Numbers to see the true monthly cost.</div>`;
    }
    const r = this.result;
    return html`
      <div class="hero">${r.trueMonthlyCost} ${r.currency}</div>
      <div class="meta">${r.costMultiplier}x net · ${r.hiddenCostPct}% hidden</div>
      <table>
        ${r.breakdown.map(
          (row) => html`<tr><td>${row.item}</td><td>${row.amount} (${row.pct}%)</td></tr>`
        )}
      </table>
      <details>
        <summary>Show steps</summary>
        ${r.steps.map(
          (s) => html`<div class="step">${s.step}. ${s.description}: ${s.formula} = ${s.result}</div>`
        )}
      </details>
    `;
  }
}

if (!customElements.get('sc-result-card')) customElements.define('sc-result-card', ScResultCard);
