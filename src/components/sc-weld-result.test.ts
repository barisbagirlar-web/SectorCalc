// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-weld-result.js';
import { ScWeldResult } from './sc-weld-result.js';

async function mount(el: ScWeldResult): Promise<ScWeldResult> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-weld-result', () => {
  it('shows empty state without result', async () => {
    const el = await mount(new ScWeldResult());
    expect(el.shadowRoot?.querySelector('.empty')).not.toBeNull();
  });
  it('renders hero, utilization bar, metric grid and steps', async () => {
    const el = await mount(new ScWeldResult());
    el.result = {
      finalLegMm: '6.00', finalLegIn: '0.24', requiredThroatMm: '4.24', minLegMm: '5.00',
      legFromLoadMm: '6.00', utilization: '0.612', jointType: 'fillet',
      steps: [{ step: 1, description: 'Allowable shear stress', formula: 's/sf', result: '240.00' }]
    };
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.hero')?.textContent).toContain('6.00');
    expect(el.shadowRoot?.querySelector('.bar > span')).not.toBeNull();
    expect(el.shadowRoot?.querySelectorAll('.cell').length).toBe(4);
    expect(el.shadowRoot?.querySelector('details')).not.toBeNull();
  });
});
