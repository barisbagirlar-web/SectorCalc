import { describe, it, expect } from 'vitest';
import {
  CalcError,
  requirePositive,
  requireNonNegative,
  requireInRange,
  requireLessThan,
  requireGreaterThan
} from './guards.js';

describe('guards', () => {
  it('requirePositive passes for 1', () => {
    expect(requirePositive(1, 'x').toString()).toBe('1');
  });
  it('requirePositive throws for 0', () => {
    expect(() => requirePositive(0, 'x')).toThrow(CalcError);
  });
  it('requireNonNegative passes for 0', () => {
    expect(requireNonNegative(0, 'x').toString()).toBe('0');
  });
  it('requireNonNegative throws for -1', () => {
    expect(() => requireNonNegative(-1, 'x')).toThrow(CalcError);
  });
  it('requireInRange passes inside', () => {
    expect(requireInRange(0.5, 0, 1, 'r').toString()).toBe('0.5');
  });
  it('requireInRange throws outside', () => {
    expect(() => requireInRange(2, 0, 1, 'r')).toThrow(CalcError);
  });
  it('requireLessThan throws at bound', () => {
    expect(() => requireLessThan(1, 1, 'r')).toThrow(CalcError);
  });
  it('requireGreaterThan passes above', () => {
    expect(requireGreaterThan(2, 1, 'x').toString()).toBe('2');
  });
  it('requireGreaterThan throws at bound', () => {
    expect(() => requireGreaterThan(1, 1, 'x')).toThrow(CalcError);
  });
  it('requireFinite throws on Infinity via requirePositive', () => {
    expect(() => requirePositive('Infinity', 'x')).toThrow(CalcError);
  });
});
