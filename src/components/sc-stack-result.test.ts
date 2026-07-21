// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-stack-result.js';
import { ScStackResult } from './sc-stack-result.js';

async function mount(el: ScStackResult): Promise<ScStackResult> { document.body.appendChild(el); await el.updateComplete; return el; }
const result = {
  nominalSum: '30', worstPlus: '0.5', rssPlus: '0.36', mcMean: '30', mcStd: '0.18',
  mcMin: '29.4', mcMax: '30.6', mcP0013: '29.46', mcP9987: '30.54', cp: '2.78', cpk: '2.70',
  ppm: '0', pareto: [{ name: 'A', pct: '60' }], iterations: 5000, seed: 1, steps: [{ step: 1, description: 'd', formula: 'f', result: 'r' }]
};

describe('sc-stack-result', () => {
  it('empty state', async () => { const el = await mount(new ScStackResult()); expect(el.shadowRoot?.querySelector('.empty')).not.toBeNull(); });
  it('renders verdict, grid, pareto, steps', async () => {
    const el = await mount(new ScStackResult());
    el.result = result as never; await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.verdict')?.textContent).toContain('CAPABLE');
    expect(el.shadowRoot?.querySelectorAll('.cell').length).toBe(6);
    expect(el.shadowRoot?.querySelector('table')?.textContent).toContain('A');
    expect(el.shadowRoot?.querySelector('details')).not.toBeNull();
  });
});
