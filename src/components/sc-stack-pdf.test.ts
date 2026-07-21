// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-stack-pdf.js';
import { ScStackPdf } from './sc-stack-pdf.js';

async function mount(el: ScStackPdf): Promise<ScStackPdf> { document.body.appendChild(el); await el.updateComplete; return el; }
const input = {
  toolCode: 'SC-008', nominalSum: '30', worstPlus: '0.5', rssPlus: '0.36', mcMean: '30', mcStd: '0.18',
  mcP0013: '29.46', mcP9987: '30.54', cp: '2.78', cpk: '2.70', ppm: '0', seed: 1, iterations: 5000,
  components: [], warnings: [], steps: [], checksum: 'x'
};

describe('sc-stack-pdf', () => {
  it('disabled without input', async () => { const el = await mount(new ScStackPdf()); expect(el.shadowRoot?.querySelector('button')?.hasAttribute('disabled')).toBe(true); });
  it('enabled with input', async () => { const el = await mount(new ScStackPdf()); el.input = input; await el.updateComplete; expect(el.shadowRoot?.querySelector('button')?.hasAttribute('disabled')).toBe(false); });
});
