import { describe, it, expect } from 'vitest';
import { buildToolReport } from './tool-report.js';

const base = { metricName: 'Cpk', metricValue: '1.5', gaugeMax: 2, direction: 'high' as const, warn: '1.33', crit: '1.0', insights: ['i'], standards: ['s'] };

describe('tool-report', () => {
  it('PASS when within spec', () => { expect(buildToolReport(base).verdict).toBe('PASS'); });
  it('WARNING when marginal (high direction, below warn)', () => { expect(buildToolReport({ ...base, metricValue: '1.2' }).verdict).toBe('MARGINAL'); });
  it('CRITICAL when below crit (high direction)', () => { expect(buildToolReport({ ...base, metricValue: '0.8' }).verdict).toBe('NOT CAPABLE'); });
  it('low direction: above warn is marginal', () => {
    const r = buildToolReport({ ...base, metricName: 'Cost mult', metricValue: '1.7', direction: 'low', warn: '1.5', crit: '2.0' });
    expect(r.verdict).toBe('MARGINAL');
  });
  it('carries insights and standards', () => {
    const r = buildToolReport(base);
    expect(r.insights.length).toBe(1);
    expect(r.standards.length).toBe(1);
  });
});
