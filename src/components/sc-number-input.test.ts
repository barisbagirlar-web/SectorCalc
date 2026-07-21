// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-number-input.js';
import { ScNumberInput } from './sc-number-input.js';

async function mount<T extends HTMLElement & { updateComplete: Promise<unknown> }>(el: T): Promise<T> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-number-input', () => {
  it('renders label and number input', async () => {
    const el = await mount(Object.assign(new ScNumberInput(), { label: 'Net salary' }));
    expect(el.shadowRoot?.querySelector('label')?.textContent).toBe('Net salary');
    expect(el.shadowRoot?.querySelector('input')?.type).toBe('number');
  });

  it('shows error message', async () => {
    const el = await mount(Object.assign(new ScNumberInput(), { label: 'X', errorMessage: 'required' }));
    expect(el.shadowRoot?.querySelector('.err')?.textContent).toBe('required');
  });

  it('emits sc-input on input event', async () => {
    const el = await mount(new ScNumberInput());
    let got = '';
    el.addEventListener('sc-input', (e) => { got = (e as CustomEvent).detail; });
    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '42';
    input.dispatchEvent(new Event('input'));
    expect(got).toBe('42');
  });
});
