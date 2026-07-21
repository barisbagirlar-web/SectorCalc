import { describe, it, expect } from 'vitest';
import {
  assertConservation,
  assertClose,
  assertAllNonNegative,
  assertMonotonicIncreasing
} from './conservation.js';
import { CalcError } from './guards.js';

describe('conservation', () => {
  it('passes when sum equals total', () => {
    expect(() => assertConservation(10, [3, 3, 4])).not.toThrow();
  });
  it('throws when sum differs', () => {
    expect(() => assertConservation(10, [3, 3, 3])).toThrow(CalcError);
  });
  it('assertClose passes within epsilon', () => {
    expect(() => assertClose('1.0000000001', 1, '1e-6')).not.toThrow();
  });
  it('assertClose throws beyond epsilon', () => {
    expect(() => assertClose(1, 2, '1e-6')).toThrow(CalcError);
  });
  it('assertAllNonNegative throws on negative', () => {
    expect(() => assertAllNonNegative([1, -1])).toThrow(CalcError);
  });
  it('monotonic passes', () => {
    expect(() => assertMonotonicIncreasing([1, 2, 3])).not.toThrow();
  });
  it('monotonic throws on flat', () => {
    expect(() => assertMonotonicIncreasing([1, 2, 2])).toThrow(CalcError);
  });
});
