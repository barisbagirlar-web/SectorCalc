// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-stack-editor.js';
import { ScStackEditor } from './sc-stack-editor.js';

async function mount(el: ScStackEditor): Promise<ScStackEditor> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-stack-editor', () => {
  it('renders preset select and unit inputs', async () => {
    const el = await mount(new ScStackEditor());
    expect(el.shadowRoot?.querySelector('.preset select')).not.toBeNull();
    expect((el.shadowRoot?.querySelectorAll('sc-unit-input') ?? []).length).toBeGreaterThanOrEqual(5);
  });
  it('applies a preset (automotive -> tol 0.05)', async () => {
    const el = await mount(new ScStackEditor());
    const sel = el.shadowRoot?.querySelector('.preset select') as HTMLSelectElement;
    sel.value = 'automotive';
    sel.dispatchEvent(new Event('change'));
    await el.updateComplete;
    expect(el.components[0]!.tol).toBe('0.05');
    expect(el.components[0]!.cpk).toBe('1.33');
  });
  it('emits sc-stack-change on unit field change', async () => {
    const el = await mount(new ScStackEditor());
    let got: unknown = null;
    el.addEventListener('sc-stack-change', (e) => { got = (e as CustomEvent).detail; });
    const usl = el.shadowRoot?.querySelector('[data-key="spec-usl"]') as HTMLElement;
    usl.dispatchEvent(new CustomEvent('sc-unit-change', { detail: { value: '32', unit: 'mm' }, bubbles: true, composed: true }));
    expect(got).not.toBeNull();
  });
  it('adds a component', async () => {
    const el = await mount(new ScStackEditor());
    (el.shadowRoot?.querySelector('.add') as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.components.length).toBe(3);
  });
  it('keeps at least one component on remove', async () => {
    const el = await mount(new ScStackEditor());
    const rm = el.shadowRoot?.querySelector('.rm') as HTMLButtonElement;
    rm.click(); await el.updateComplete;
    expect(el.components.length).toBe(1);
    (el.shadowRoot?.querySelector('.rm') as HTMLButtonElement).click(); await el.updateComplete;
    expect(el.components.length).toBe(1);
  });
});
