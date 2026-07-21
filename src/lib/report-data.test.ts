import { describe, it, expect } from 'vitest';
import { buildReportData } from './report-data.js';
import type { StackResult } from '../tools/SC-008-tolerance-stack/v1.0.0/formula.js';

function res(cpk: string, ppm: string, worstPlus = '0.5', rssPlus = '0.36'): StackResult {
  return { nominalSum: '30', worstPlus, rssPlus, mcMean: '30', mcStd: '0.18', mcMin: '29.4', mcMax: '30.6', mcP0013: '29.46', mcP9987: '30.54', cp: '2.78', cpk, ppm, pareto: [{ name: 'A', pct: '60' }], iterations: 5000, seed: 1, steps: [] } as StackResult;
}

describe('report-data', () => {
  it('CRITICAL when Cpk < 1', () => {
    const r = buildReportData(res('0.87', '4200'));
    expect(r.verdict).toBe('NOT CAPABLE');
    expect(r.riskAnalysis.some((x) => x.level === 'CRITICAL')).toBe(true);
  });
  it('WARNING when 1 <= Cpk < 1.33', () => {
    expect(buildReportData(res('1.1', '500')).riskAnalysis.some((x) => x.code === 'CPK_MARGINAL')).toBe(true);
  });
  it('PASS when Cpk >= 1.33', () => {
    const r = buildReportData(res('1.5', '10'));
    expect(r.verdict).toBe('CAPABLE');
    expect(r.riskAnalysis.some((x) => x.level === 'PASS')).toBe(true);
  });
  it('includes PPM in the critical message', () => {
    expect(buildReportData(res('0.87', '4200')).riskAnalysis[0]?.message).toContain('4200');
  });
  it('top contributor insight', () => {
    expect(buildReportData(res('1.5', '10')).insights.some((i) => i.includes('A'))).toBe(true);
  });
  it('lists standards', () => {
    expect(buildReportData(res('1.5', '10')).standards.length).toBeGreaterThanOrEqual(3);
  });
});
