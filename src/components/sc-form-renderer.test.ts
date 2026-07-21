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

const richSchema = {
  type: 'object',
  required: ['netSalary'],
  properties: {
    netSalary: {
      type: 'number',
      minimum: 0,
      default: 3500,
      'x-unit': 'currency',
      description: 'Monthly net (take-home) salary.'
    },
    hoursPerWeek: {
      type: 'number',
      exclusiveMinimum: 0,
      default: 40,
      'x-unit': 'h/week',
      description: 'Average worked hours per week.'
    }
  }
};

async function mount(el: ScFormRenderer, s: object = schema): Promise<ScFormRenderer> {
  document.body.appendChild(el);
  el.schema = s as never;
  await el.updateComplete;
  return el;
}

function setNumber(el: ScFormRenderer, index: number, value: string) {
  const inp = el.shadowRoot?.querySelectorAll('.fld input')[index] as HTMLInputElement;
  inp.value = value;
  inp.dispatchEvent(new Event('input'));
}

function setSelect(el: ScFormRenderer, value: string) {
  const ctrl = el.shadowRoot?.querySelector('sc-select-input') as HTMLElement;
  ctrl.dispatchEvent(new CustomEvent('sc-input', { detail: value, bubbles: true, composed: true }));
}

describe('sc-form-renderer', () => {
  it('renders one control per property plus a submit button', async () => {
    const el = await mount(new ScFormRenderer());
    expect(el.shadowRoot?.querySelectorAll('.fld input, sc-select-input').length).toBe(2);
    expect(el.shadowRoot?.querySelector('button')?.textContent).toBe('Run the Numbers');
  });

  it('submit is disabled until required fields are valid', async () => {
    const el = await mount(new ScFormRenderer());
    expect(el.shadowRoot?.querySelector('button')?.hasAttribute('disabled')).toBe(true);
    setNumber(el, 0, '3500');
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('button')?.hasAttribute('disabled')).toBe(false);
  });

  it('emits sc-submit with parsed numeric values when valid', async () => {
    const el = await mount(new ScFormRenderer());
    let detail: Record<string, unknown> | null = null;
    el.addEventListener('sc-submit', (e) => { detail = (e as CustomEvent).detail; });
    setNumber(el, 0, '3500');
    setSelect(el, 'TR');
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

  it('shows a tooltip badge when description is set', async () => {
    const el = await mount(new ScFormRenderer(), richSchema);
    const tip = el.shadowRoot?.querySelector('.tip') as HTMLElement;
    expect(tip).not.toBeNull();
    expect(tip.getAttribute('title')).toContain('take-home');
  });

  it('shows the unit label when x-unit is set', async () => {
    const el = await mount(new ScFormRenderer(), richSchema);
    expect(el.shadowRoot?.textContent).toContain('currency');
    expect(el.shadowRoot?.textContent).toContain('h/week');
  });

  it('shows placeholder from schema default', async () => {
    const el = await mount(new ScFormRenderer(), richSchema);
    const inp = el.shadowRoot?.querySelectorAll('.fld input')[0] as HTMLInputElement;
    expect(inp.placeholder).toBe('3500');
  });

  it('shows a validation error message under the field', async () => {
    const el = await mount(new ScFormRenderer(), richSchema);
    setNumber(el, 0, '-1');
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.err')?.textContent).toBeTruthy();
  });

  it('omits tip and unit when schema has neither', async () => {
    const el = await mount(new ScFormRenderer());
    expect(el.shadowRoot?.querySelector('.tip')).toBeNull();
    expect(el.shadowRoot?.querySelector('.unit')).toBeNull();
  });

  it('keeps plain number behavior without x-unit', async () => {
    const el = await mount(new ScFormRenderer());
    setNumber(el, 0, '100');
    await el.updateComplete;
    expect((el.shadowRoot?.querySelector('.fld input') as HTMLInputElement).value).toBe('100');
  });

  it('renders two number fields from rich schema', async () => {
    const el = await mount(new ScFormRenderer(), richSchema);
    expect(el.shadowRoot?.querySelectorAll('.fld input').length).toBe(2);
  });
});
