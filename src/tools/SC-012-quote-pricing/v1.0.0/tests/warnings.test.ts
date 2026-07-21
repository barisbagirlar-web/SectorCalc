import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';
import { evaluateWarnings } from '../warnings.js';

const base = { materialCost: 1000, scrapRate: 0.1, laborHours: 5, laborHourlyCost: 40, machineHours: 3, machineHourlyCost: 60, targetMargin: 0.2, quantity: 10 };

describe('SC-012 warnings', () => {
  it('CRITICAL when margin <= 0', () => {
    const i = { ...base, targetMargin: 0 };
    expect(evaluateWarnings(i, calculate(i)).some((w) => w.code === 'NO_MARGIN')).toBe(true);
  });
  it('WARNING on high scrap', () => {
    const i = { ...base, scrapRate: 0.2 };
    expect(evaluateWarnings(i, calculate(i)).some((w) => w.code === 'HIGH_SCRAP')).toBe(true);
  });
  it('WARNING on long payment terms', () => {
    const i = { ...base, paymentDays: 90, monthlyInterestRate: 0.01 };
    expect(evaluateWarnings(i, calculate(i)).some((w) => w.code === 'LONG_PAYMENT_TERMS')).toBe(true);
  });
  it('always emits a TIP', () => {
    expect(evaluateWarnings(base, calculate(base)).some((w) => w.severity === 'TIP')).toBe(true);
  });
});
