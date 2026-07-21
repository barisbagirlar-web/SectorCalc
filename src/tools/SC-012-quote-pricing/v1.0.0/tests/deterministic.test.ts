import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';

describe('SC-012 determinism', () => {
  it('1000 runs identical', () => {
    const i = { materialCost: 1000, scrapRate: 0.1, laborHours: 5, laborHourlyCost: 40, machineHours: 3, machineHourlyCost: 60, targetMargin: 0.2, quantity: 10, setupMinutes: 30, setupHourlyCost: 40, overheadRate: 0.15, paymentDays: 30, monthlyInterestRate: 0.01 };
    const first = JSON.stringify(calculate(i));
    for (let k = 0; k < 1000; k++) expect(JSON.stringify(calculate(i))).toBe(first);
  });
});
