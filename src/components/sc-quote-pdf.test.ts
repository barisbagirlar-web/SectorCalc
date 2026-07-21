// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-quote-pdf.js';
import { ScQuotePdf } from './sc-quote-pdf.js';

const input = {
  toolCode: 'SC-012', sellPrice: '6250.00', unitPrice: '625.00', totalCost: '5000.00',
  profit: '1250.00', currency: 'USD',
  breakdown: [{ item: 'Labor', amount: '200.00', pct: '4.0' }],
  warnings: [], steps: [{ step: 1, description: 'Material cost with scrap', result: '1111.11' }]
};

async function mount(el: ScQuotePdf): Promise<ScQuotePdf> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-quote-pdf', () => {
  it('disabled without input', async () => {
    const el = await mount(new ScQuotePdf());
    expect(el.shadowRoot?.querySelector('button')?.hasAttribute('disabled')).toBe(true);
  });
  it('enabled with input', async () => {
    const el = await mount(new ScQuotePdf());
    el.input = input;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('button')?.hasAttribute('disabled')).toBe(false);
    expect(el.shadowRoot?.querySelector('button')?.textContent).toContain('PDF');
  });
});
