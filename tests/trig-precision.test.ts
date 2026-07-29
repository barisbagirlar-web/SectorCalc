import { describe, it, expect } from 'vitest';
import { sinDeg, cosDeg, tanDeg, expD, lnD } from '../src/industrial-suite/engine.js';
import { D } from '../src/core/engine.js';

describe('Decimal-native trig precision (P0 regression guard)', () => {
  it('sin(30°) = 0.5 to 30 digits', () => {
    expect(sinDeg(D(30)).minus('0.5').abs().lt('1e-30')).toBe(true);
  });
  it('sin(90°) = 1 to 30 digits', () => {
    expect(sinDeg(D(90)).minus(1).abs().lt('1e-30')).toBe(true);
  });
  it('cos(60°) = 0.5 to 30 digits', () => {
    expect(cosDeg(D(60)).minus('0.5').abs().lt('1e-30')).toBe(true);
  });
  it('tan(45°) = 1 to 30 digits', () => {
    expect(tanDeg(D(45)).minus(1).abs().lt('1e-30')).toBe(true);
  });
  it('e^1 = 2.71828... to 20 digits', () => {
    expect(expD(D(1)).minus('2.71828182845904523536').abs().lt('1e-18')).toBe(true);
  });
  it('ln(e) = 1 to 20 digits', () => {
    expect(
      lnD(expD(D(1)))
        .minus(1)
        .abs()
        .lt('1e-18')
    ).toBe(true);
  });
  it('sin²(15°) + cos²(15°) = 1 to 25 digits', () => {
    const s = sinDeg(D(15));
    const c = cosDeg(D(15));
    expect(s.pow(2).plus(c.pow(2)).minus(1).abs().lt('1e-25')).toBe(true);
  });
});
