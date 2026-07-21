import { describe, it, expect } from 'vitest';
import { mean, stddev, percentile, cp, cpk } from './stats.js';
import { D } from './engine.js';
import { CalcError } from './guards.js';

describe('stats', () => {
  it('mean of [1,2,3] = 2', () => { expect(mean([1, 2, 3]).toString()).toBe('2'); });
  it('mean empty throws', () => { expect(() => mean([])).toThrow(CalcError); });
  it('sample stddev of [1,2,3] = 1', () => { expect(stddev([1, 2, 3]).toString()).toBe('1'); });
  it('stddev n<2 throws', () => { expect(() => stddev([5])).toThrow(CalcError); });
  it('stddev empty throws', () => { expect(() => stddev([])).toThrow(CalcError); });
  it('percentile p=0 = min', () => { expect(percentile([1, 2, 3], 0).toString()).toBe('1'); });
  it('percentile p=1 = max', () => { expect(percentile([1, 2, 3], 1).toString()).toBe('3'); });
  it('percentile p=0.5 = median', () => { expect(percentile([1, 2, 3], 0.5).toString()).toBe('2'); });
  it('percentile out of range throws', () => { expect(() => percentile([1, 2, 3], 1.5)).toThrow(CalcError); });
  it('cp value (10-0)/(6*1) = 5/3', () => { expect(cp(10, 0, 1).minus(D('10').div(6)).abs().lt('1e-9')).toBe(true); });
  it('cpk centered equals cp (invariant)', () => { expect(cpk(10, 0, 5, 1).minus(cp(10, 0, 1)).abs().lt('1e-9')).toBe(true); });
  it('cp sigma<=0 throws', () => { expect(() => cp(10, 0, 0)).toThrow(CalcError); });
  it('cp USL<=LSL throws', () => { expect(() => cp(0, 10, 1)).toThrow(CalcError); });
  it('cp monotonic decreasing with sigma', () => { expect(D(cp(10, 0, 2)).lt(cp(10, 0, 1))).toBe(true); });
});
