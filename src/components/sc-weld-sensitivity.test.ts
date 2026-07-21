// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-weld-sensitivity.js';
import { ScWeldSensitivity } from './sc-weld-sensitivity.js';

async function mount(el: ScWeldSensitivity): Promise<ScWeldSensitivity> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function fire(el: ScWeldSensitivity, index: number, value: string) {
  const s = el.shadowRoot?.querySelectorAll('input[type=range]')[index] as HTMLInputElement;
  s.value = value;
  s.dispatchEvent(new Event('input'));
}

describe('sc-weld-sensitivity', () => {
  it('renders three sliders', async () => {
    const el = await mount(new ScWeldSensitivity());
    expect(el.shadowRoot?.querySelectorAll('input[type=range]').length).toBe(3);
  });
  it('emits designLoadN on first slider', async () => {
    const el = await mount(new ScWeldSensitivity());
    let got: { designLoadN: number } | null = null;
    el.addEventListener('sc-weld-sensitivity', (e) => { got = (e as CustomEvent).detail; });
    fire(el, 0, '120000');
    expect(got).not.toBeNull();
    expect(got!.designLoadN).toBe(120000);
  });
  it('emits thickness and safety on second/third sliders', async () => {
    const el = await mount(new ScWeldSensitivity());
    let seen: { materialThicknessMm?: number; safetyFactor?: number } = {};
    el.addEventListener('sc-weld-sensitivity', (e) => { Object.assign(seen, (e as CustomEvent).detail); });
    fire(el, 1, '20');
    fire(el, 2, '3');
    expect(seen.materialThicknessMm).toBe(20);
    expect(seen.safetyFactor).toBe(3);
  });
});
