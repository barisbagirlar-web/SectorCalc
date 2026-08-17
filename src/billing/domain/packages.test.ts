import { describe, expect, it } from 'vitest';
import { CREDIT_PACKAGES, smallestPackCovering } from './packages.js';

describe('smallestPackCovering', () => {
  it('recommends STARTER when deficit is within 20 credits', () => {
    expect(smallestPackCovering(4).key).toBe('STARTER');
    expect(smallestPackCovering(20).key).toBe('STARTER');
  });

  it('recommends the smallest pack that covers a larger deficit', () => {
    expect(smallestPackCovering(21).key).toBe('WORKSHOP');
    expect(smallestPackCovering(101).key).toBe('PROFESSIONAL');
    expect(smallestPackCovering(301).key).toBe('TEAM_WALLET');
  });

  it('never invents a pack outside CREDIT_PACKAGES', () => {
    const pack = smallestPackCovering(0);
    expect(Object.keys(CREDIT_PACKAGES)).toContain(pack.key);
  });
});
