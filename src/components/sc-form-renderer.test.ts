// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-form-renderer.js';
import { ScFormRenderer } from './sc-form-renderer.js';

const schema = {
  type: 'object',
  required: ['net'],
  properties: {
    net: { type: 'number', minimum: 0 },
    country: { type: 'string', enum: ['US', 'TR'] }
  }
};

async function mount(el: ScFormRenderer): Promise<ScFormRenderer> {
  document.body.appendChild(el);
  el.schema = schema as never;
  await el.updateComplete;
  return el;
}

function setField(el: ScFormRenderer, index: number, value: string) {
  const ctrl = el.shadowRoot?.querySelectorAll('sc-number-input, sc-select-input')[index] as HTMLElement;
  ctrl.dispatchEvent(new CustomEvent('sc-input', { detail: value, bubbles: true, composed: true }));
}

describe('sc-form-renderer', () => {
  it('renders one control per property plus a submit button', async () => {
    const el = await mount(new ScFormRenderer());
    expect(el.shadowRoot?.querySelectorAll('sc-number-input, sc-select-input').length).toBe(2);
    expect(el.shadowRoot?.querySelector('button')?.textContent).toBe('Run the Numbers');
  });

  it('submit is disabled until required fields are valid', async () => {
    const el = await mount(new ScFormRenderer());
    expect(el.shadowRoot?.querySelector('button')?.hasAttribute('disabled')).toBe(true);
    setField(el, 0, '3500');
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('button')?.hasAttribute('disabled')).toBe(false);
  });

  it('emits sc-submit with parsed numeric values when valid', async () => {
    const el = await mount(new ScFormRenderer());
    let detail: Record<string, unknown> | null = null;
    el.addEventListener('sc-submit', (e) => { detail = (e as CustomEvent).detail; });
    setField(el, 0, '3500');
    setField(el, 1, 'TR');
    await el.updateComplete;
    el.shadowRoot?.querySelector('button')?.click();
    expect(detail).toEqual({ net: 3500, country: 'TR' });
  });

  it('does not emit sc-submit when invalid', async () => {
    const el = await mount(new ScFormRenderer());
    let fired = false;
    el.addEventListener('sc-submit', () => { fired = true; });
    el.shadowRoot?.querySelector('button')?.click();
    expect(fired).toBe(false);
  });
});
