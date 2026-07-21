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
  it('renders default 2 components and spec', async () => {
    const el = await mount(new ScStackEditor());
    expect(el.shadowRoot?.querySelectorAll('table tr').length).toBe(3); // header + 2
    expect(el.shadowRoot?.querySelectorAll('.spec input').length).toBe(5);
  });
  it('adds a component', async () => {
    const el = await mount(new ScStackEditor());
    (el.shadowRoot?.querySelector('.add') as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.components.length).toBe(3);
  });
  it('removes but keeps at least one', async () => {
    const el = await mount(new ScStackEditor());
    const rms = el.shadowRoot?.querySelectorAll('.rm') as NodeListOf<HTMLButtonElement>;
    rms[0]!.click(); await el.updateComplete;
    expect(el.components.length).toBe(1);
    (el.shadowRoot?.querySelector('.rm') as HTMLButtonElement).click(); await el.updateComplete;
    expect(el.components.length).toBe(1);
  });
  it('emits sc-stack-change on spec edit', async () => {
    const el = await mount(new ScStackEditor());
    let got: unknown = null;
    el.addEventListener('sc-stack-change', (e) => { got = (e as CustomEvent).detail; });
    const usl = el.shadowRoot?.querySelector('.spec input') as HTMLInputElement;
    usl.value = '32';
    usl.dispatchEvent(new Event('input'));
    expect(got).not.toBeNull();
  });
});
