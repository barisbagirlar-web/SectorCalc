import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';

describe('SC-014 determinism', () => {
  it('1000 runs identical', () => {
    const i = { plannedProductionTime: 480, runTime: 400, idealCycleTime: 0.5, totalCount: 800, goodCount: 760 };
    const first = JSON.stringify(calculate(i));
    for (let k = 0; k < 1000; k++) expect(JSON.stringify(calculate(i))).toBe(first);
  });
});
