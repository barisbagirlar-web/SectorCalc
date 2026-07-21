import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';
import { D } from '../../../../core/engine.js';

const base = {
  materialCost: 1000, scrapRate: 0.1, laborHours: 5, laborHourlyCost: 40,
  machineHours: 3, machineHourlyCost: 60, targetMargin: 0.2, quantity: 10
};

describe('SC-012 formula', () => {
  it('sellPrice > totalCost when margin positive', () => {
    const r = calculate(base);
    expect(D(r.sellPrice).gt(r.totalCost)).toBe(true);
  });
  it('conservation: breakdown sums to totalCost', () => {
    const r = calculate({ ...base, setupMinutes: 30, setupHourlyCost: 40, overheadRate: 0.15, energyCost: 20, consumablesCost: 10, shippingCost: 50, paymentDays: 30, monthlyInterestRate: 0.01 });
    const sum = r.breakdown.reduce((a, b) => a.plus(D(b.amount)), D(0));
    expect(sum.minus(D(r.totalCost)).abs().lt('0.1')).toBe(true);
  });
  it('monotonic: higher margin -> higher sellPrice', () => {
    expect(D(calculate({ ...base, targetMargin: 0.4 }).sellPrice).gt(calculate({ ...base, targetMargin: 0.1 }).sellPrice)).toBe(true);
  });
  it('monotonic: higher scrap -> higher sellPrice', () => {
    expect(D(calculate({ ...base, scrapRate: 0.3 }).sellPrice).gt(calculate({ ...base, scrapRate: 0.05 }).sellPrice)).toBe(true);
  });
  it('scrap raises effective material above raw', () => {
    expect(D(calculate({ ...base, scrapRate: 0.2 }).effectiveMaterial).gt(1000)).toBe(true);
  });
  it('payment terms create finance charge', () => {
    const r = calculate({ ...base, paymentDays: 60, monthlyInterestRate: 0.02 });
    expect(D(r.financeCharge).gt(0)).toBe(true);
  });
  it('zero payment days -> zero finance charge', () => {
    expect(calculate({ ...base, paymentDays: 0, monthlyInterestRate: 0.02 }).financeCharge).toBe('0.00');
  });
  it('degenerate all-zero costs -> sellPrice 0', () => {
    const r = calculate({ materialCost: 0, scrapRate: 0, laborHours: 0, laborHourlyCost: 0, machineHours: 0, machineHourlyCost: 0, targetMargin: 0.2, quantity: 1 });
    expect(r.sellPrice).toBe('0.00');
  });
  it('throws scrapRate >= 1', () => { expect(() => calculate({ ...base, scrapRate: 1 })).toThrow(); });
  it('throws targetMargin >= 1', () => { expect(() => calculate({ ...base, targetMargin: 1 })).toThrow(); });
  it('throws quantity <= 0', () => { expect(() => calculate({ ...base, quantity: 0 })).toThrow(); });
  it('unitPrice = sellPrice / quantity', () => {
    const r = calculate(base);
    expect(D(r.unitPrice).minus(D(r.sellPrice).div(10)).abs().lt('0.1')).toBe(true);
  });
  it('all overrides runs', () => {
    const r = calculate({ ...base, setupMinutes: 20, setupHourlyCost: 50, overheadRate: 0.2, energyCost: 15, consumablesCost: 8, shippingCost: 100, paymentDays: 45, monthlyInterestRate: 0.015, currency: 'EUR' });
    expect(D(r.sellPrice).gt(0)).toBe(true);
    expect(r.currency).toBe('EUR');
  });
});
