import { describe, it, expect } from 'vitest';
import { roundHalfUp, roundHalfEven, roundToSigFigs, truncate } from './rounding.js';

describe('rounding', () => {
  it('halfUp rounds 2.5 to 3', () => {
    expect(roundHalfUp('2.5', 0).toString()).toBe('3');
  });
  it('halfUp rounds 2.4 to 2', () => {
    expect(roundHalfUp('2.4', 0).toString()).toBe('2');
  });
  it("halfEven banker 0.5->0, 1.5->2, 2.5->2", () => {
    expect(roundHalfEven('0.5', 0).toString()).toBe('0');
    expect(roundHalfEven('1.5', 0).toString()).toBe('2');
    expect(roundHalfEven('2.5', 0).toString()).toBe('2');
  });
  it('sig figs 9876 to 2 = 9900', () => {
    expect(roundToSigFigs('9876', 2).toString()).toBe('9900');
  });
  it('sig figs 0.004567 to 2 = 0.0046', () => {
    expect(roundToSigFigs('0.004567', 2).toString()).toBe('0.0046');
  });
  it('truncate cuts decimals', () => {
    expect(truncate('2.99', 0).toString()).toBe('2');
  });
});
