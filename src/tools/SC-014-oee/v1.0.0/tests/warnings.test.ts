import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';
import { evaluateWarnings } from '../warnings.js';

const low = { plannedProductionTime: 480, runTime: 200, idealCycleTime: 0.5, totalCount: 100, goodCount: 90 };
const world = { plannedProductionTime: 480, runTime: 442, idealCycleTime: 0.5, totalCount: 848, goodCount: 831 };
const rateAvail = { plannedProductionTime: 400, runTime: 500, idealCycleTime: 0.5, totalCount: 100, goodCount: 90 };
const ratePerf = { plannedProductionTime: 400, runTime: 400, idealCycleTime: 1, totalCount: 500, goodCount: 90 };
const qualOver = { plannedProductionTime: 480, runTime: 400, idealCycleTime: 0.5, totalCount: 100, goodCount: 110 };

describe('SC-014 warnings', () => {
  it('LOW_OEE true, others false on poor run', () => {
    const w = evaluateWarnings(calculate(low));
    expect(w.some((x) => x.code === 'LOW_OEE')).toBe(true);
    expect(w.some((x) => x.code === 'WORLD_CLASS')).toBe(false);
    expect(w.some((x) => x.code === 'QUALITY_OVER_100')).toBe(false);
    expect(w.some((x) => x.code === 'RATE_OVER_100')).toBe(false);
  });
  it('WORLD_CLASS true, LOW false on strong run', () => {
    const w = evaluateWarnings(calculate(world));
    expect(w.some((x) => x.code === 'WORLD_CLASS')).toBe(true);
    expect(w.some((x) => x.code === 'LOW_OEE')).toBe(false);
  });
  it('RATE_OVER_100 via availability > 100', () => {
    expect(evaluateWarnings(calculate(rateAvail)).some((x) => x.code === 'RATE_OVER_100')).toBe(true);
  });
  it('RATE_OVER_100 via performance > 100 (availability <= 100)', () => {
    const w = evaluateWarnings(calculate(ratePerf));
    expect(w.some((x) => x.code === 'RATE_OVER_100')).toBe(true);
    expect(w.some((x) => x.code === 'QUALITY_OVER_100')).toBe(false);
  });
  it('QUALITY_OVER_100 critical when good > total', () => {
    expect(evaluateWarnings(calculate(qualOver)).some((x) => x.code === 'QUALITY_OVER_100')).toBe(true);
  });
  it('always emits a TIP', () => {
    expect(evaluateWarnings(calculate(base())).some((x) => x.severity === 'TIP')).toBe(true);
  });
});

function base() {
  return { plannedProductionTime: 480, runTime: 400, idealCycleTime: 0.5, totalCount: 800, goodCount: 760 };
}
