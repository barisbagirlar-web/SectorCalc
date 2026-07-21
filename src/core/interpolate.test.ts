import { describe, it, expect } from 'vitest';
import { linearInterpolate, stepInterpolate } from './interpolate.js';
import { CalcError } from './guards.js';

describe('interpolate', () => {
  it('linear exact at first node', () => { expect(linearInterpolate([0, 10], [0, 100], 0).toString()).toBe('0'); });
  it('linear midpoint', () => { expect(linearInterpolate([0, 10], [0, 100], 5).toString()).toBe('50'); });
  it('linear exact at last node', () => { expect(linearInterpolate([0, 10], [0, 100], 10).toString()).toBe('100'); });
  it('linear below range throws (no extrapolation)', () => { expect(() => linearInterpolate([0, 10], [0, 100], -1)).toThrow(CalcError); });
  it('linear above range throws (no extrapolation)', () => { expect(() => linearInterpolate([0, 10], [0, 100], 11)).toThrow(CalcError); });
  it('linear non-monotonic xs throws', () => { expect(() => linearInterpolate([0, 10, 5], [0, 1, 2], 3)).toThrow(CalcError); });
  it('linear length mismatch throws', () => { expect(() => linearInterpolate([0, 10], [0], 5)).toThrow(CalcError); });
  it('linear single point throws', () => { expect(() => linearInterpolate([0], [0], 0)).toThrow(CalcError); });
  it('step holds value inside interval', () => { expect(stepInterpolate([0, 10, 20], [1, 2, 3], 5).toString()).toBe('1'); });
  it('step upper-clamps above last node', () => { expect(stepInterpolate([0, 10, 20], [1, 2, 3], 25).toString()).toBe('3'); });
  it('step below first node throws', () => { expect(() => stepInterpolate([0, 10], [1, 2], -1)).toThrow(CalcError); });
  it('step non-monotonic xs throws', () => { expect(() => stepInterpolate([0, 10, 5], [1, 2, 3], 7)).toThrow(CalcError); });
});
