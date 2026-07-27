import { describe, it, expect } from 'vitest';
import { PACKAGES, CREDIT_VALIDITY } from './pricing-packages.js';

describe('pricing-packages mandate catalog', () => {
  it('has 4 one-time packages', () => {
    expect(PACKAGES.length).toBe(4);
  });

  it('matches mandate credits and display prices', () => {
    expect(PACKAGES.map((p) => p.credits)).toEqual([20, 100, 300, 1000]);
    expect(PACKAGES.map((p) => p.price)).toEqual(['$15', '$59', '$149', '$399']);
  });

  it('does not embed Paddle price IDs in the browser catalog', () => {
    for (const p of PACKAGES) {
      expect(p.paddlePriceId).toBe('');
      expect(p.key).toBeTruthy();
    }
  });

  it('states purchased credits never expire', () => {
    expect(CREDIT_VALIDITY).toMatch(/never expire/i);
  });

  it('marks workshop as featured / most popular', () => {
    const featured = PACKAGES.filter((p) => p.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0]!.key).toBe('WORKSHOP');
  });
});
