import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';
import { D } from '../../../../core/engine.js';

const US = { country: 'US', netSalary: 3500, payFrequency: 'monthly' as const };

describe('SC-010 formula', () => {
  it('true cost > net', () => { expect(D(calculate(US).trueMonthlyCost).gt(3500)).toBe(true); });
  it('conservation: breakdown sums to total', () => {
    const r = calculate({ ...US, healthMonthly: 200, mealMonthly: 50, annualBonus: 6000, overtimeHoursMonthly: 10, recruitmentCost: 1200, tenureYears: 2 });
    const sum = r.breakdown.reduce((a, row) => a.plus(D(row.amount)), D(0));
    expect(sum.minus(D(r.trueMonthlyCost)).abs().lt('0.1')).toBe(true);
  });
  it('monotonic: higher net -> higher cost', () => {
    expect(D(calculate({ ...US, netSalary: 2000 }).trueMonthlyCost).gt(calculate({ ...US, netSalary: 1000 }).trueMonthlyCost)).toBe(true);
  });
  it('weekly normalization', () => { expect(D(calculate({ country: 'US', netSalary: 800, payFrequency: 'weekly' }).grossMonthly).gt(800)).toBe(true); });
  it('biweekly normalization', () => { expect(D(calculate({ country: 'US', netSalary: 1600, payFrequency: 'biweekly' }).grossMonthly).gt(1600)).toBe(true); });
  it('hourly normalization', () => { expect(D(calculate({ country: 'US', netSalary: 20, payFrequency: 'hourly', hoursPerWeek: 40 }).grossMonthly).gt(0)).toBe(true); });
  it('employerSSRate override raises cost', () => {
    expect(D(calculate({ ...US, employerSSRate: 0.3 }).trueMonthlyCost).gt(calculate({ ...US, employerSSRate: 0.1 }).trueMonthlyCost)).toBe(true);
  });
  it('employeeRate override raises gross', () => {
    expect(D(calculate({ ...US, employeeRate: 0.4 }).grossMonthly).gt(calculate({ ...US, employeeRate: 0.1 }).grossMonthly)).toBe(true);
  });
  it('throws hoursPerWeek <= 0', () => { expect(() => calculate({ ...US, hoursPerWeek: 0 })).toThrow(); });
  it('throws tenureYears <= 0', () => { expect(() => calculate({ ...US, tenureYears: 0, recruitmentCost: 1000 })).toThrow(); });
  it('throws employeeRate >= 1', () => { expect(() => calculate({ ...US, employeeRate: 1 })).toThrow(); });
  it('throws otMultiplier < 1', () => { expect(() => calculate({ ...US, overtimeMultiplier: 0.5 })).toThrow(); });
  it('throws unknown country', () => { expect(() => calculate({ country: 'XX', netSalary: 1000, payFrequency: 'monthly' })).toThrow(); });
  it('degenerate net=0 -> cost 0, multiplier 0', () => {
    const r = calculate({ ...US, netSalary: 0 });
    expect(r.trueMonthlyCost).toBe('0.00');
    expect(r.costMultiplier).toBe('0.00');
  });
  it('benefits included', () => {
    const r = calculate({ ...US, healthMonthly: 300 });
    expect(r.breakdown.some((b) => b.item === 'Health insurance')).toBe(true);
  });
  it('all overrides provided runs', () => {
    const r = calculate({ ...US, hoursPerWeek: 45, employeeRate: 0.2, employerSSRate: 0.1, employerUnempRate: 0.02, healthMonthly: 100, mealMonthly: 50, transportMonthly: 30, annualBonus: 3000, severanceRate: 0.05, overtimeHoursMonthly: 8, overtimeMultiplier: 1.5, recruitmentCost: 2000, tenureYears: 2, currency: 'EUR' });
    expect(D(r.trueMonthlyCost).gt(0)).toBe(true);
    expect(r.currency).toBe('EUR');
  });
  it('all defaults (minimal) runs', () => {
    const r = calculate({ country: 'TR', netSalary: 25000, payFrequency: 'monthly' });
    expect(D(r.trueMonthlyCost).gt(25000)).toBe(true);
  });
});
