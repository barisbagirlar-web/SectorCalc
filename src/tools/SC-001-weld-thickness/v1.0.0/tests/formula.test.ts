import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';
import { D } from '../../../../core/engine.js';

const base = { designLoadN: 50000, weldLengthMm: 200, weldStrengthMpa: 480, safetyFactor: 2, materialThicknessMm: 10 };

describe('SC-001 formula', () => {
  it('monotonic: higher load -> larger required throat', () => {
    expect(D(calculate({ ...base, designLoadN: 100000 }).requiredThroatMm).gt(calculate(base).requiredThroatMm)).toBe(true);
  });
  it('fillet leg = throat / 0.707 (default joint)', () => {
    const r = calculate(base);
    expect(D(r.legFromLoadMm).minus(D(r.requiredThroatMm).div('0.707')).abs().lt('0.1')).toBe(true);
  });
  it('butt leg = throat / 1.0', () => {
    const r = calculate({ ...base, jointType: 'butt' });
    expect(D(r.legFromLoadMm).minus(D(r.requiredThroatMm)).abs().lt('0.1')).toBe(true);
  });
  it('min leg governs for thick plate, low load', () => {
    const r = calculate({ ...base, designLoadN: 1000, materialThicknessMm: 25 });
    expect(r.finalLegMm).toBe(r.minLegMm);
  });
  it('load leg governs for high load', () => {
    const r = calculate({ ...base, designLoadN: 500000 });
    expect(r.finalLegMm).toBe(r.legFromLoadMm);
  });
  it('leg in inches = leg mm / 25.4 (Quantity convert)', () => {
    const r = calculate(base);
    expect(D(r.finalLegIn).minus(D(r.finalLegMm).div('25.4')).abs().lt('0.1')).toBe(true);
  });
  it('throws weldLength 0', () => { expect(() => calculate({ ...base, weldLengthMm: 0 })).toThrow(); });
  it('throws weldStrength 0', () => { expect(() => calculate({ ...base, weldStrengthMpa: 0 })).toThrow(); });
  it('throws safetyFactor 0', () => { expect(() => calculate({ ...base, safetyFactor: 0 })).toThrow(); });
  it('degenerate load 0 -> throat 0, final = min leg', () => {
    const r = calculate({ ...base, designLoadN: 0 });
    expect(r.requiredThroatMm).toBe('0.00');
    expect(r.finalLegMm).toBe(r.minLegMm);
  });
  it('all overrides with butt runs', () => {
    const r = calculate({ ...base, jointType: 'butt', safetyFactor: 3, materialThicknessMm: 15 });
    expect(D(r.finalLegMm).gt(0)).toBe(true);
    expect(r.jointType).toBe('butt');
  });
});
