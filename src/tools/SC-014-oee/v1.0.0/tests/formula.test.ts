import { describe, it, expect } from 'vitest';
import { calculate, calculateSeries } from '../formula.js';
import { D } from '../../../../core/engine.js';

const base = { plannedProductionTime: 480, runTime: 400, idealCycleTime: 0.5, totalCount: 800, goodCount: 760 };

describe('SC-014 formula', () => {
  it('availability = run / planned', () => {
    expect(calculate(base).availabilityPct).toBe('83.3');
  });
  it('performance = ideal * total / run', () => {
    expect(calculate({ ...base, idealCycleTime: 0.5, totalCount: 800, runTime: 400 }).performancePct).toBe('100.0');
  });
  it('quality = good / total', () => {
    expect(calculate({ ...base, totalCount: 100, goodCount: 90 }).qualityPct).toBe('90.0');
  });
  it('oeePct == aPct * pPct * qPct / 10000 (identity)', () => {
    const r = calculate(base);
    const lhs = D(r.oeePct);
    const rhs = D(r.availabilityPct).times(r.performancePct).times(r.qualityPct).div(10000);
    expect(lhs.minus(rhs).abs().lt('0.2')).toBe(true);
  });
  it('degenerate runTime 0 -> oee 0, performance 0, no throw', () => {
    const r = calculate({ ...base, runTime: 0 });
    expect(r.oeePct).toBe('0.0');
    expect(r.performancePct).toBe('0.0');
  });
  it('degenerate totalCount 0 -> quality 0, no throw', () => {
    const r = calculate({ ...base, totalCount: 0, goodCount: 0 });
    expect(r.qualityPct).toBe('0.0');
  });
  it('throws planned 0', () => { expect(() => calculate({ ...base, plannedProductionTime: 0 })).toThrow(); });
  it('throws negative runTime', () => { expect(() => calculate({ ...base, runTime: -1 })).toThrow(); });
  it('series mean of two records', () => {
    const r1 = calculate(base);
    const r2 = calculate({ ...base, goodCount: 400 });
    const s = calculateSeries([base, { ...base, goodCount: 400 }]);
    const expected = D(r1.oeePct).plus(r2.oeePct).div(2);
    expect(D(s.meanOeePct).minus(expected).abs().lt('0.2')).toBe(true);
    expect(s.count).toBe(2);
  });
  it('series empty throws', () => { expect(() => calculateSeries([])).toThrow(); });
  it('series single equals that record oee', () => {
    const s = calculateSeries([base]);
    expect(s.meanOeePct).toBe(calculate(base).oeePct);
  });
});
