// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-warning-panel.js';
import { ScWarningPanel } from './sc-warning-panel.js';

async function mount(el: ScWarningPanel): Promise<ScWarningPanel> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-warning-panel', () => {
  it('renders nothing when empty', async () => {
    const el = await mount(new ScWarningPanel());
    expect(el.shadowRoot?.querySelectorAll('.w').length).toBe(0);
  });

  it('renders one block per warning with severity tag', async () => {
    const el = await mount(new ScWarningPanel());
    el.warnings = [
      { code: 'A', severity: 'CRITICAL', message: 'm1', action: 'a1' },
      { code: 'B', severity: 'TIP', message: 'm2', action: 'a2' }
    ];
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll('.w').length).toBe(2);
    expect(el.shadowRoot?.textContent).toContain('Critical');
    expect(el.shadowRoot?.textContent).toContain('Pro tip');
  });
});
