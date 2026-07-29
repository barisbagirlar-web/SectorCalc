import { describe, it, expect } from 'vitest';
import { lcg, sampleTruncatedNormal } from '../src/core/monte-carlo.js';

describe('truncated-normal contract (P0 regression guard)', () => {
  it('never breaches [lo, hi] across 10_000 seeds', () => {
    for (let seed = 1; seed <= 10000; seed++) {
      const rng = lcg(seed);
      const x = sampleTruncatedNormal(rng, 10, 1, 9, 11);
      expect(x.gte(9)).toBe(true);
      expect(x.lte(11)).toBe(true);
    }
  });

  it('deterministic clamp fallback preserves reproducibility', () => {
    const rng1 = lcg(999999);
    const rng2 = lcg(999999);
    const a = sampleTruncatedNormal(rng1, 1000, 1, 9, 11);
    const b = sampleTruncatedNormal(rng2, 1000, 1, 9, 11);
    expect(a.toString()).toBe(b.toString());
    expect(a.eq(11) || a.eq(9)).toBe(true);
  });
});
