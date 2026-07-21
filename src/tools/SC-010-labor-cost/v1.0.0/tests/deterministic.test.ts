import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';

describe('SC-010 determinism', () => {
  it('1000 runs identical', () => {
    const i = { country: 'TR', netSalary: 25000, payFrequency: 'monthly' as const, healthMonthly: 500, mealMonthly: 100, overtimeHoursMonthly: 20, recruitmentCost: 5000, tenureYears: 3 };
    const first = JSON.stringify(calculate(i));
    for (let k = 0; k < 1000; k++) expect(JSON.stringify(calculate(i))).toBe(first);
  });
});
