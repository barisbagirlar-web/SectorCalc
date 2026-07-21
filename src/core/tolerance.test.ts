import { describe, it, expect } from 'vitest';
import { tol, worstCaseSum, rssSum, tolContains } from './tolerance.js';
import { CalcError } from './guards.js';

describe('tolerance', () => {
  it('creates tolerance with non-negative bounds', () => {
    const t = tol(10, 0.1, 0.2);
    expect(t.nominal.toString()).toBe('10');
    expect(t.plus.toString()).toBe('0.1');
  });
  it('throws on negative plus bound', () => { expect(() => tol(10, -1, 0)).toThrow(CalcError); });
  it('worstCaseSum sums nominals and bounds', () => {
    const r = worstCaseSum([tol(10, 0.1, 0.2), tol(20, 0.3, 0.4)]);
    expect(r.nominal.toString()).toBe('30');
    expect(r.plus.toString()).toBe('0.4');
    expect(r.minus.toString()).toBe('0.6');
    expect(() => worstCaseSum([])).toThrow(CalcError);
  });
  it('rssSum root-sum-square bounds', () => {
    const r = rssSum([tol(10, 3, 4), tol(20, 4, 3)]);
    expect(r.nominal.toString()).toBe('30');
    expect(r.plus.toString()).toBe('5');
    expect(r.minus.toString()).toBe('5');
  });
  it('rss bounds never exceed worst bounds (invariant)', () => {
    const parts = [tol(10, 3, 1), tol(20, 4, 2), tol(5, 1, 5)];
    const w = worstCaseSum(parts);
    const r = rssSum(parts);
    expect(r.plus.lte(w.plus)).toBe(true);
    expect(r.minus.lte(w.minus)).toBe(true);
  });
  it('single part: worst and rss equal the part', () => {
    const p = tol(7, 0.5, 0.25);
    expect(worstCaseSum([p]).plus.toString()).toBe('0.5');
    expect(rssSum([p]).minus.toString()).toBe('0.25');
  });
  it('tolContains true inside / false outside', () => {
    const t = tol(10, 2, 1);
    expect(tolContains(t, 11)).toBe(true);
    expect(tolContains(t, 9)).toBe(true);
    expect(tolContains(t, 13)).toBe(false);
  });
  it('zero tolerance contains only exact nominal', () => {
    const t = tol(5, 0, 0);
    expect(tolContains(t, 5)).toBe(true);
    expect(tolContains(t, 6)).toBe(false);
  });
});
