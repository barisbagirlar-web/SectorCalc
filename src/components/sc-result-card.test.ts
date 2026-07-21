// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-result-card.js';
import { ScResultCard } from './sc-result-card.js';

async function mount(el: ScResultCard): Promise<ScResultCard> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-result-card', () => {
  it('shows empty state without result', async () => {
    const el = await mount(new ScResultCard());
    expect(el.shadowRoot?.querySelector('.empty')).not.toBeNull();
  });

  it('renders hero, breakdown rows and steps', async () => {
    const el = await mount(new ScResultCard());
    el.result = {
      trueMonthlyCost: '5200.00', currency: 'USD', costMultiplier: '1.49', hiddenCostPct: '48.6',
      breakdown: [{ item: 'Gross salary (estimated)', amount: '4545.45', pct: '87.4' }],
      steps: [{ step: 1, description: 'Normalize', formula: 'net', result: '3500.00' }]
    };
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.hero')?.textContent).toContain('5200.00');
    expect(el.shadowRoot?.querySelectorAll('table tr').length).toBe(1);
    expect(el.shadowRoot?.querySelector('details')).not.toBeNull();
  });
});
