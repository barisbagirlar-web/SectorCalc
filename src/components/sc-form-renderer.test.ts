// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-form-renderer.js';
import { ScFormRenderer } from './sc-form-renderer.js';

const schema = {
  type: 'object',
  required: ['netSalary'],
  'x-presets': [
    { label: 'Small workshop', values: { netSalary: 2500, hoursPerWeek: 40 } },
    { label: 'Mid factory', values: { netSalary: 4000, hoursPerWeek: 45 } }
  ],
  properties: {
    netSalary: {
      type: 'number',
      minimum: 0,
      default: 3500,
      'x-unit': 'currency',
      description: 'Monthly take-home pay.'
    },
    hoursPerWeek: {
      type: 'number',
      exclusiveMinimum: 0,
      default: 40,
      'x-unit': 'h/wk',
      description: 'Average worked hours/week.'
    }
  }
};

async function mount(el: ScFormRenderer): Promise<ScFormRenderer> {
  document.body.appendChild(el);
  el.schema = schema as never;
  await el.updateComplete;
  return el;
}

describe('sc-form-renderer', () => {
  it('emits sc-submit in real time on each keystroke', async () => {
    const el = await mount(new ScFormRenderer());
    let count = 0;
    let last: Record<string, unknown> | null = null;
    el.addEventListener('sc-submit', (e) => {
      count += 1;
      last = (e as CustomEvent).detail;
    });
    const inp = el.shadowRoot?.querySelector('.fld input') as HTMLInputElement;
    inp.value = '3500';
    inp.dispatchEvent(new Event('input'));
    expect(count).toBe(1);
    expect(last).toEqual({ netSalary: 3500 });
  });

  it('renders a tooltip badge from description', async () => {
    const el = await mount(new ScFormRenderer());
    const tip = el.shadowRoot?.querySelector('.tip') as HTMLElement;
    expect(tip).not.toBeNull();
    expect(tip.getAttribute('title')).toContain('take-home');
  });

  it('renders the x-unit label', async () => {
    const el = await mount(new ScFormRenderer());
    expect(el.shadowRoot?.textContent).toContain('currency');
    expect(el.shadowRoot?.textContent).toContain('h/wk');
  });

  it('applies a preset and emits updated values', async () => {
    const el = await mount(new ScFormRenderer());
    let got: Record<string, unknown> | null = null;
    el.addEventListener('sc-submit', (e) => { got = (e as CustomEvent).detail; });
    const sel = el.shadowRoot?.querySelector('.presets select') as HTMLSelectElement;
    sel.value = 'Small workshop';
    sel.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(got).toEqual({ netSalary: 2500, hoursPerWeek: 40 });
  });

  it('shows a validation error for out-of-range input', async () => {
    const el = await mount(new ScFormRenderer());
    const inp = el.shadowRoot?.querySelector('.fld input') as HTMLInputElement;
    inp.value = '-1';
    inp.dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.err')?.textContent).toContain('Must be >= 0');
  });
});
