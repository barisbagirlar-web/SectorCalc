// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-weld-pdf.js';
import { ScWeldPdf } from './sc-weld-pdf.js';

const input = {
  toolCode: 'SC-001', finalLegMm: '6.00', finalLegIn: '0.24', utilization: '0.612',
  jointType: 'fillet', requiredThroatMm: '4.24', minLegMm: '5.00', warnings: [],
  steps: [{ step: 1, description: 'Allowable shear stress', result: '240.00' }]
};

async function mount(el: ScWeldPdf): Promise<ScWeldPdf> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-weld-pdf', () => {
  it('disabled without input', async () => {
    const el = await mount(new ScWeldPdf());
    expect(el.shadowRoot?.querySelector('button')?.hasAttribute('disabled')).toBe(true);
  });
  it('enabled with input', async () => {
    const el = await mount(new ScWeldPdf());
    el.input = input;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('button')?.hasAttribute('disabled')).toBe(false);
    expect(el.shadowRoot?.querySelector('button')?.textContent).toContain('PDF');
  });
});
