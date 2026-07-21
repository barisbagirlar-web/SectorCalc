import { describe, it, expect } from 'vitest';
import { D, fix, Decimal } from './engine.js';

describe('engine', () => {
  it('0.1 + 0.2 equals exactly 0.3 (impossible with Number)', () => {
    expect(D('0.1').plus(D('0.2')).equals(D('0.3'))).toBe(true);
  });

  it('throws on empty value', () => {
    expect(() => D('')).toThrow();
    expect(() => D(null)).toThrow();
  });

  it('throws on non-finite value', () => {
    expect(() => D('Infinity')).toThrow();
  });

  it('fix returns a string, not a Number', () => {
    expect(typeof fix(D('1.23456'), 2)).toBe('string');
    expect(fix(D('1.23456'), 2)).toBe('1.23');
  });

  it('precision is at least 34', () => {
    expect(Decimal.precision).toBeGreaterThanOrEqual(34);
  });
});
