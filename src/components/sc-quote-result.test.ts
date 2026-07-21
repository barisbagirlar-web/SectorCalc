// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-quote-result.js';
import { ScQuoteResult } from './sc-quote-result.js';

async function mount(el: ScQuoteResult): Promise<ScQuoteResult> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-quote-result', () => {
  it('shows empty state without result', async () => {
    const el = await mount(new ScQuoteResult());
    expect(el.shadowRoot?.querySelector('.empty')).not.toBeNull();
  });
  it('renders hero, breakdown rows and steps', async () => {
    const el = await mount(new ScQuoteResult());
    el.result = {
      sellPrice: '6250.00', unitPrice: '625.00', totalCost: '5000.00', profit: '1250.00', currency: 'USD',
      breakdown: [{ item: 'Labor', amount: '200.00', pct: '4.0' }],
      steps: [{ step: 1, description: 'Material cost with scrap', formula: 'm/(1-s)', result: '1111.11' }]
    };
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.hero')?.textContent).toContain('6250.00');
    expect(el.shadowRoot?.querySelectorAll('table tr').length).toBe(1);
    expect(el.shadowRoot?.querySelector('details')).not.toBeNull();
  });
});
