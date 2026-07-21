import { describe, it, expect } from 'vitest';
import { PACKAGES, FREE_MONTHLY_CREDITS, CREDIT_VALIDITY } from './pricing-packages.js';

describe('pricing-packages', () => {
  it('has 5 packages', () => { expect(PACKAGES.length).toBe(5); });
  it('prices and per-credit match the plan', () => {
    expect(PACKAGES[0]!.price).toBe('$1.99');
    expect(PACKAGES[2]!.price).toBe('$7.99');
    expect(PACKAGES[4]!.perCredit).toBe('$0.25');
  });
  it('per-credit price decreases as pack grows', () => {
    const per = PACKAGES.map((p) => Number(p.perCredit.replace('$', '')));
    for (let i = 1; i < per.length; i++) expect(per[i]!).toBeLessThan(per[i - 1]!);
  });
  it('exactly one featured package (MOST POPULAR)', () => {
    const featured = PACKAGES.filter((p) => p.featured);
    expect(featured.length).toBe(1);
    expect(featured[0]?.badge).toBe('MOST POPULAR');
  });
  it('free tier and validity defined', () => {
    expect(FREE_MONTHLY_CREDITS).toBe('3-5');
    expect(CREDIT_VALIDITY).toBe('12 months');
  });
});
