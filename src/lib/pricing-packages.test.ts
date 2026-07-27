import { describe, it, expect } from 'vitest';
import {
  PACKAGES,
  FREE_MONTHLY_CREDITS,
  CREDIT_VALIDITY,
  PADDLE_SANDBOX_PRICE_IDS
} from './pricing-packages.js';

describe('pricing-packages', () => {
  it('has 4 packages', () => {
    expect(PACKAGES.length).toBe(4);
  });

  it('matches mandated USD packs and Paddle test price ids', () => {
    expect(PACKAGES[0]).toMatchObject({
      id: 'STARTER',
      credits: 20,
      price: '$15',
      paddlePriceId: PADDLE_SANDBOX_PRICE_IDS.starter
    });
    expect(PACKAGES[1]).toMatchObject({
      id: 'WORKSHOP',
      credits: 100,
      price: '$59',
      badge: 'MOST POPULAR',
      featured: true,
      paddlePriceId: PADDLE_SANDBOX_PRICE_IDS.workshop
    });
    expect(PACKAGES[2]).toMatchObject({
      id: 'PROFESSIONAL',
      credits: 300,
      price: '$149',
      badge: 'BEST VALUE',
      paddlePriceId: PADDLE_SANDBOX_PRICE_IDS.professional
    });
    expect(PACKAGES[3]).toMatchObject({
      id: 'TEAM_WALLET',
      credits: 1000,
      price: '$399',
      paddlePriceId: PADDLE_SANDBOX_PRICE_IDS.teamWallet
    });
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

  it('purchased credits never expire; no free monthly ambiguous grant', () => {
    expect(CREDIT_VALIDITY).toBe('never expire');
    expect(FREE_MONTHLY_CREDITS).toBe('0');
  });
});
