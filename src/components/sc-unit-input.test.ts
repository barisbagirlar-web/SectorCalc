// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-unit-input.js';
import { ScUnitInput } from './sc-unit-input.js';

async function mount(el: ScUnitInput): Promise<ScUnitInput> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-unit-input', () => {
  it('renders label, input and unit select', async () => {
    const el = await mount(Object.assign(new ScUnitInput(), { label: 'Length', dimension: 'length', unit: 'mm' }));
    expect(el.shadowRoot?.querySelector('label')?.textContent).toContain('Length');
    expect(el.shadowRoot?.querySelector('input')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('select')).not.toBeNull();
  });

  it('lists units from the dimension', async () => {
    const el = await mount(Object.assign(new ScUnitInput(), { dimension: 'length', unit: 'mm' }));
    expect((el.shadowRoot?.querySelectorAll('option') ?? []).length).toBeGreaterThan(1);
  });

  it('auto-converts value on unit change (25.4 mm -> 1.0000 in)', async () => {
    const el = await mount(Object.assign(new ScUnitInput(), { dimension: 'length', unit: 'mm', value: '25.4' }));
    const sel = el.shadowRoot?.querySelector('select') as HTMLSelectElement;
    sel.value = 'in';
    sel.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(el.value).toBe('1.0000');
    expect(el.unit).toBe('in');
  });

  it('shows a validation error message', async () => {
    const el = await mount(Object.assign(new ScUnitInput(), { dimension: 'length', unit: 'mm', errorMessage: 'must be > 0' }));
    expect(el.shadowRoot?.querySelector('.err')?.textContent).toBe('must be > 0');
  });

  it('shows the placeholder default', async () => {
    const el = await mount(Object.assign(new ScUnitInput(), { dimension: 'length', unit: 'mm', placeholder: '10' }));
    expect((el.shadowRoot?.querySelector('input') as HTMLInputElement).placeholder).toBe('10');
  });

  it('shows a tooltip badge when tooltip is set', async () => {
    const el = await mount(Object.assign(new ScUnitInput(), { dimension: 'length', unit: 'mm', tooltip: 'Measured per ISO 286' }));
    expect(el.shadowRoot?.querySelector('.tip')).not.toBeNull();
  });

  it('emits sc-unit-change on value input', async () => {
    const el = await mount(Object.assign(new ScUnitInput(), { dimension: 'length', unit: 'mm' }));
    let got: { value: string; unit: string } | undefined;
    el.addEventListener('sc-unit-change', ((e: CustomEvent<{ value: string; unit: string }>) => {
      got = e.detail;
    }) as EventListener);
    const inp = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    inp.value = '42';
    inp.dispatchEvent(new Event('input'));
    expect(got!.value).toBe('42');
  });
});
