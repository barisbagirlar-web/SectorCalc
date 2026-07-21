// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-stack-chart.js';
import { ScStackChart } from './sc-stack-chart.js';

async function mount(el: ScStackChart): Promise<ScStackChart> { document.body.appendChild(el); await el.updateComplete; return el; }

describe('sc-stack-chart', () => {
  it('renders a canvas per kind', async () => {
    for (const kind of ['histogram', 'pareto', 'compare'] as const) {
      const el = await mount(Object.assign(new ScStackChart(), { kind, title: kind, data: { labels: ['a'], values: [1] } }));
      expect(el.shadowRoot?.querySelector('canvas')).not.toBeNull();
    }
  });
  it('updates without throwing', async () => {
    const el = await mount(Object.assign(new ScStackChart(), { kind: 'pareto', title: 'p', data: { labels: ['a'], values: [1] } }));
    el.data = { labels: ['a', 'b'], values: [1, 2] };
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('canvas')).not.toBeNull();
  });
  it('renders gauge kind', async () => {
    const el = await mount(Object.assign(new ScStackChart(), { kind: 'gauge', title: 'Cpk', data: { labels: ['Cpk'], values: [1.5] } }));
    expect(el.shadowRoot?.querySelector('canvas')).not.toBeNull();
  });
  it('renders trend kind', async () => {
    const el = await mount(Object.assign(new ScStackChart(), { kind: 'trend', title: 'Cpk trend', data: { labels: ['0.5x', '1x', '1.5x'], values: [1.8, 1.2, 0.8] } }));
    expect(el.shadowRoot?.querySelector('canvas')).not.toBeNull();
  });
});
