// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-quote-sensitivity.js';
import { ScQuoteSensitivity } from './sc-quote-sensitivity.js';

async function mount(el: ScQuoteSensitivity): Promise<ScQuoteSensitivity> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-quote-sensitivity', () => {
  it('renders three sliders', async () => {
    const el = await mount(new ScQuoteSensitivity());
    expect(el.shadowRoot?.querySelectorAll('input[type=range]').length).toBe(3);
  });
  it('emits sc-quote-sensitivity on input', async () => {
    const el = await mount(new ScQuoteSensitivity());
    let got: { materialCost: number; scrapRate: number; targetMargin: number } | null = null;
    el.addEventListener('sc-quote-sensitivity', (e) => { got = (e as CustomEvent).detail; });
    const slider = el.shadowRoot?.querySelector('input[type=range]') as HTMLInputElement;
    slider.value = '2000';
    slider.dispatchEvent(new Event('input'));
    expect(got).not.toBeNull();
    expect(got!.materialCost).toBe(2000);
  });
  it('respects min/max on scrap slider', async () => {
    const el = await mount(new ScQuoteSensitivity());
    const ranges = el.shadowRoot?.querySelectorAll('input[type=range]') as NodeListOf<HTMLInputElement>;
    expect(ranges[1]!.min).toBe('0');
    expect(ranges[1]!.max).toBe('0.5');
  });
  it('emits on scrap and margin sliders', async () => {
    const el = await mount(new ScQuoteSensitivity());
    let got: { scrapRate: number; targetMargin: number } | null = null;
    el.addEventListener('sc-quote-sensitivity', (e) => { got = (e as CustomEvent).detail; });
    const ranges = el.shadowRoot?.querySelectorAll('input[type=range]') as NodeListOf<HTMLInputElement>;
    ranges[1]!.value = '0.2';
    ranges[1]!.dispatchEvent(new Event('input'));
    expect(got!.scrapRate).toBe(0.2);
    ranges[2]!.value = '0.25';
    ranges[2]!.dispatchEvent(new Event('input'));
    expect(got!.targetMargin).toBe(0.25);
  });
});
