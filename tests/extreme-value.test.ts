import { describe, it, expect } from 'vitest';
import { D, CalcError } from '../src/core/engine.js';
import { calculate, simulateStack } from '../src/tools/SC-008-tolerance-stack/v1.0.0/formula.js';

describe('extreme-value fuzz suite (P2)', () => {
  it('handles single-component stack with tolerance 1e-12', () => {
    const r = calculate({
      components: [{ name: 'X', nominal: 10, tol: '1e-12', distribution: 'normal' }],
      usl: '10.000000000002', lsl: '9.999999999998', seed: 1, iterations: 100
    });
    expect(Number(r.cpk)).toBeGreaterThan(0);
  });

  it('handles large nominal offset (1e12) without precision loss', () => {
    const r = calculate({
      components: [
        { name: 'A', nominal: '1e12', tol: 0.1, distribution: 'normal' },
        { name: 'B', nominal: '-1e12', tol: 0.1, distribution: 'normal' }
      ],
      usl: 0.3, lsl: -0.3, seed: 42, iterations: 500
    });
    expect(r.worstPlus).toBe('0.2000');
    expect(Number(r.cpk)).toBeGreaterThan(0);
  });

  it('blocks USL <= LSL', () => {
    expect(() => calculate({
      components: [{ name: 'A', nominal: 10, tol: 0.1, distribution: 'normal' }],
      usl: 5, lsl: 10
    })).toThrow(CalcError);
  });

  it('blocks negative tolerance', () => {
    expect(() => simulateStack(
      [{ name: 'A', nominal: 10, tol: -0.1, distribution: 'normal' }],
      { components: [], usl: 11, lsl: 9 }
    )).toThrow(CalcError);
  });
});
