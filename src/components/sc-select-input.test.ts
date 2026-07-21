// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-select-input.js';
import { ScSelectInput } from './sc-select-input.js';

async function mount<T extends HTMLElement & { updateComplete: Promise<unknown> }>(el: T): Promise<T> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-select-input', () => {
  it('renders all options', async () => {
    const el = await mount(Object.assign(new ScSelectInput(), { label: 'Country', options: ['US', 'TR'] }));
    expect(el.shadowRoot?.querySelectorAll('option').length).toBe(2);
  });

  it('emits sc-input on change', async () => {
    const el = await mount(Object.assign(new ScSelectInput(), { options: ['US', 'TR'] }));
    let got = '';
    el.addEventListener('sc-input', (e) => { got = (e as CustomEvent).detail; });
    const sel = el.shadowRoot?.querySelector('select') as HTMLSelectElement;
    sel.value = 'TR';
    sel.dispatchEvent(new Event('change'));
    expect(got).toBe('TR');
  });
});
