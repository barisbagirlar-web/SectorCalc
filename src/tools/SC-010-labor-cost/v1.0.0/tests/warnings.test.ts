import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';
import { evaluateWarnings } from '../warnings.js';

describe('SC-010 warnings', () => {
  it('flags missing severance for TR', () => {
    const i = { country: 'TR', netSalary: 25000, payFrequency: 'monthly' as const };
    expect(evaluateWarnings(i, calculate(i)).some((w) => w.code === 'NO_SEVERANCE_ACCRUAL')).toBe(true);
  });
  it('no severance warning for US', () => {
    const i = { country: 'US', netSalary: 3500, payFrequency: 'monthly' as const };
    expect(evaluateWarnings(i, calculate(i)).some((w) => w.code === 'NO_SEVERANCE_ACCRUAL')).toBe(false);
  });
  it('flags excessive overtime', () => {
    const i = { country: 'US', netSalary: 3500, payFrequency: 'monthly' as const, overtimeHoursMonthly: 60 };
    expect(evaluateWarnings(i, calculate(i)).some((w) => w.code === 'EXCESSIVE_OVERTIME')).toBe(true);
  });
  it('always emits a TIP', () => {
    const i = { country: 'US', netSalary: 3500, payFrequency: 'monthly' as const };
    expect(evaluateWarnings(i, calculate(i)).some((w) => w.severity === 'TIP')).toBe(true);
  });
});
