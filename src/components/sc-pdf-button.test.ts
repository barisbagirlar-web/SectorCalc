// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-pdf-button.js';
import { ScPdfButton } from './sc-pdf-button.js';

const input = {
  toolCode: 'SC-010', trueMonthlyCost: '5200.00', currency: 'USD',
  costMultiplier: '1.49', hiddenCostPct: '48.6',
  breakdown: [{ item: 'Gross', amount: '4545.45', pct: '87.4' }],
  warnings: [], steps: [{ step: 1, description: 'Normalize', result: '3500.00' }]
};

async function mount(el: ScPdfButton): Promise<ScPdfButton> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-pdf-button', () => {
  it('disabled without input', async () => {
    const el = await mount(new ScPdfButton());
    expect(el.shadowRoot?.querySelector('button')?.hasAttribute('disabled')).toBe(true);
  });

  it('enabled with input', async () => {
    const el = await mount(new ScPdfButton());
    el.input = input;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('button')?.hasAttribute('disabled')).toBe(false);
    expect(el.shadowRoot?.querySelector('button')?.textContent).toContain('PDF');
  });
});
