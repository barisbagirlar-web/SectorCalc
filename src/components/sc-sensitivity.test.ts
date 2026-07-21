// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-sensitivity.js';
import { ScSensitivity } from './sc-sensitivity.js';

async function mount(el: ScSensitivity): Promise<ScSensitivity> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-sensitivity', () => {
  it('renders three sliders', async () => {
    const el = await mount(new ScSensitivity());
    expect(el.shadowRoot?.querySelectorAll('input[type=range]').length).toBe(3);
  });

  it('emits sc-sensitivity on input', async () => {
    const el = await mount(new ScSensitivity());
    let got: { netSalary: number; employerSSRate: number; overtimeHoursMonthly: number } | null = null;
    el.addEventListener('sc-sensitivity', (e) => { got = (e as CustomEvent).detail; });
    const slider = el.shadowRoot?.querySelector('input[type=range]') as HTMLInputElement;
    slider.value = '5000';
    slider.dispatchEvent(new Event('input'));
    expect(got).not.toBeNull();
    expect(got!.netSalary).toBe(5000);
  });

  it('respects min/max attributes', async () => {
    const el = await mount(new ScSensitivity());
    const ranges = el.shadowRoot?.querySelectorAll('input[type=range]') as NodeListOf<HTMLInputElement>;
    expect(ranges[0]!.min).toBe('0');
    expect(ranges[0]!.max).toBe('20000');
  });

  it('emits on SS rate and overtime sliders', async () => {
    const el = await mount(new ScSensitivity());
    let got: { employerSSRate: number; overtimeHoursMonthly: number } | null = null;
    el.addEventListener('sc-sensitivity', (e) => { got = (e as CustomEvent).detail; });
    const ranges = el.shadowRoot?.querySelectorAll('input[type=range]') as NodeListOf<HTMLInputElement>;
    ranges[1]!.value = '0.1';
    ranges[1]!.dispatchEvent(new Event('input'));
    expect(got!.employerSSRate).toBe(0.1);
    ranges[2]!.value = '10';
    ranges[2]!.dispatchEvent(new Event('input'));
    expect(got!.overtimeHoursMonthly).toBe(10);
  });
});
