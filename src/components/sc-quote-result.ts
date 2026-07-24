import { LitElement, html, css } from 'lit';

/**
 * SC-012 result card. Hero = sell price; meta = unit/margin/profit.
 * Kept separate from sc-result-card so SC-010 stays untouched (164 tests safe).
 * Shares the hero+breakdown+steps pattern; merge into a shared summary is debt.
 */
export interface QuoteResultData {
  sellPrice: string;
  unitPrice: string;
  totalCost: string;
  profit: string;
  currency: string;
  breakdown: Array<{ item: string; amount: string; pct: string }>;
  steps: Array<{ step: number; description: string; formula: string; result: string }>;
}

export class ScQuoteResult extends LitElement {
  static properties = { result: { type: Object } };
  static styles = css`
    :host { display: block; color: var(--text-primary, #2d3436); }
    .hero { font: 800 38px var(--sc-mono, monospace); color: var(--sc-rust, var(--accent-amber, #d35400)); }
    .meta { font: 14px var(--sc-sans, system-ui); color: var(--text-muted, var(--sc-muted, #636e72)); margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; font: 14px var(--sc-sans, system-ui); }
    td { padding: 6px 4px; border-bottom: 1px solid var(--border-subtle, #ecf0f1); color: var(--text-primary, #2d3436); }
    td.num { text-align: right; font-family: var(--sc-mono, monospace); }
    details { margin-top: 12px; }
    summary { cursor: pointer; font-weight: 600; color: var(--text-primary, #2d3436); }
    pre { font: 12px var(--sc-mono, monospace); background: var(--bg-2, #f8f9fa); color: var(--text-primary, #1a1a1a); padding: 8px; border-radius: 6px; overflow-x: auto; }
    .empty { color: var(--text-muted, var(--sc-muted, #636e72)); }
  `;

  declare result: QuoteResultData | null;
  constructor() { super(); this.result = null; }

  render() {
    if (!this.result) return html`<div class="empty">Run the numbers to build the quote.</div>`;
    const r = this.result;
    return html`
      <div class="hero">${r.sellPrice} ${r.currency}</div>
      <div class="meta">Sell price · unit ${r.unitPrice} · cost ${r.totalCost} · profit ${r.profit}</div>
      <table>
        ${r.breakdown.map((b) => html`<tr><td>${b.item}</td><td class="num">${b.amount}</td><td class="num">${b.pct}%</td></tr>`)}
      </table>
      <details>
        <summary>Show me the math</summary>
        <pre>${r.steps.map((s) => `${s.step}. ${s.description}\n   ${s.formula}\n   = ${s.result}`).join('\n\n')}</pre>
      </details>
    `;
  }
}

if (!customElements.get('sc-quote-result')) customElements.define('sc-quote-result', ScQuoteResult);
