// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import './sc-report-panel.js';
import { ScReportPanel } from './sc-report-panel.js';
import { buildToolReport } from '../lib/tool-report.js';

async function mount(el: ScReportPanel): Promise<ScReportPanel> { document.body.appendChild(el); await el.updateComplete; return el; }

describe('sc-report-panel', () => {
  it('empty state without report', async () => { const el = await mount(new ScReportPanel()); expect(el.shadowRoot?.querySelector('.empty')).not.toBeNull(); });
  it('renders verdict, risk, gauge and insights', async () => {
    const el = await mount(new ScReportPanel());
    el.report = buildToolReport({ metricName: 'Cpk', metricValue: '0.8', gaugeMax: 2, direction: 'high', warn: '1.33', crit: '1.0', insights: ['tighten'], standards: ['ASME'] });
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.verdict')?.textContent).toContain('NOT CAPABLE');
    expect(el.shadowRoot?.querySelector('canvas')).not.toBeNull();
    expect(el.shadowRoot?.textContent).toContain('tighten');
  });
});
