import { describe, it, expect } from 'vitest';
import { lcg, invNormCdf, sampleNormal, sampleUniform } from './monte-carlo.js';
import { D, Decimal } from './engine.js';

describe('monte-carlo (Decimal-only)', () => {
  it('lcg is deterministic for the same seed', () => {
    const a = lcg(42);
    const b = lcg(42);
    for (let i = 0; i < 20; i++) expect(a().toString()).toBe(b().toString());
  });

  it('different seeds produce different streams', () => {
    expect(lcg(1)().toString()).not.toBe(lcg(2)().toString());
  });

  it('invNormCdf hits known quantiles', () => {
    expect(invNormCdf(0.5).abs().lt('1e-6')).toBe(true);
    expect(invNormCdf('0.975').minus('1.959964').abs().lt('1e-4')).toBe(true);
    expect(invNormCdf('0.025').plus('1.959964').abs().lt('1e-4')).toBe(true);
    expect(invNormCdf('0.8413447').minus('1').abs().lt('1e-4')).toBe(true);
  });

  it('invNormCdf throws outside (0,1)', () => {
    expect(() => invNormCdf(0)).toThrow();
    expect(() => invNormCdf(1)).toThrow();
  });

  it('sampleNormal approximates mean and std', () => {
    const rng = lcg(7);
    const n = 1000;
    let sum = D(0);
    const vals: Decimal[] = [];
    for (let i = 0; i < n; i++) {
      const v = sampleNormal(rng, 50, 5);
      sum = sum.plus(v);
      vals.push(v);
    }
    const mean = sum.div(n);
    const variance = vals.reduce((acc, v) => acc.plus(v.minus(mean).pow(2)), D(0)).div(n);
    const std = variance.sqrt();
    expect(mean.minus(50).abs().lt('1')).toBe(true);
    expect(std.minus(5).abs().lt('1')).toBe(true);
  });

  it('sampleUniform stays within [min, max]', () => {
    const rng = lcg(3);
    for (let i = 0; i < 500; i++) {
      const v = sampleUniform(rng, 10, 20);
      expect(v.gte(10)).toBe(true);
      expect(v.lte(20)).toBe(true);
    }
  });
});
