import { describe, it, expect } from 'vitest';
import { calculate } from '../formula.js';
import { evaluateWarnings } from '../warnings.js';

const ok = {
  components: [
    { name: 'A', nominal: 10, tol: 0.1, distribution: 'normal' as const },
    { name: 'B', nominal: 20, tol: 0.1, distribution: 'normal' as const }
  ],
  usl: 31.5, lsl: 28.5, seed: 1, iterations: 500
};

describe('SC-008 warnings', () => {
  it('CRITICAL incapable when Cpk < 1 (tight spec)', () => {
    const i = { ...ok, usl: 30.1, lsl: 29.9 };
    expect(evaluateWarnings(i, calculate(i)).some((w) => w.code === 'INCAPABLE')).toBe(true);
  });
  it('no INCAPABLE when spec wide', () => {
    expect(evaluateWarnings(ok, calculate(ok)).some((w) => w.code === 'INCAPABLE')).toBe(false);
  });
  it('WARNING worst-case out when spec narrower than worst', () => {
    // worstPlus = 0.2; half-spec must be < 0.2 to trip WORST_CASE_OUT
    const i = { ...ok, usl: 30.15, lsl: 29.85 };
    expect(evaluateWarnings(i, calculate(i)).some((w) => w.code === 'WORST_CASE_OUT')).toBe(true);
  });
  it('no worst-case warning when spec wide', () => {
    expect(evaluateWarnings(ok, calculate(ok)).some((w) => w.code === 'WORST_CASE_OUT')).toBe(false);
  });
  it('WARNING dominant contributor when one tol dominates', () => {
    const i = { ...ok, components: [{ name: 'BIG', nominal: 10, tol: 1, distribution: 'normal' as const }, { name: 'small', nominal: 20, tol: 0.05, distribution: 'normal' as const }] };
    expect(evaluateWarnings(i, calculate(i)).some((w) => w.code === 'DOMINANT_CONTRIBUTOR')).toBe(true);
  });
  it('INFO statistical gain present', () => {
    // STATISTICAL_GAIN needs mcRange < worstPlus; with equal tols that holds for n >= 5
    // (2*rss = 2*tol*sqrt(n) < n*tol). Five equal contributors trip it.
    const i = {
      components: [
        { name: 'A', nominal: 10, tol: 0.1, distribution: 'normal' as const },
        { name: 'B', nominal: 10, tol: 0.1, distribution: 'normal' as const },
        { name: 'C', nominal: 10, tol: 0.1, distribution: 'normal' as const },
        { name: 'D', nominal: 10, tol: 0.1, distribution: 'normal' as const },
        { name: 'E', nominal: 10, tol: 0.1, distribution: 'normal' as const }
      ],
      usl: 52, lsl: 48, seed: 1, iterations: 500
    };
    expect(evaluateWarnings(i, calculate(i)).some((w) => w.code === 'STATISTICAL_GAIN')).toBe(true);
  });
  it('always emits a TIP', () => {
    expect(evaluateWarnings(ok, calculate(ok)).some((w) => w.severity === 'TIP')).toBe(true);
  });
});
