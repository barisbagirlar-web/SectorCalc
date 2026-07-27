/**
 * Credit pack catalog SSOT + Paddle sandbox price IDs (test catalog).
 * Purchased credits never expire. UI shows USD here; tools show credits only.
 */
import type { CreditPackageId } from './types.js';

export interface CreditPackage {
  id: CreditPackageId;
  credits: number;
  /** Display USD label for pricing/checkout UI only. */
  price: string;
  priceUsd: number;
  perCredit: string;
  paddlePriceId: string;
  badge?: string;
  featured?: boolean;
}

/** Sandbox / test Paddle price IDs provided for credit packs (one-time packs). */
export const PADDLE_SANDBOX_PRICE_IDS = {
  starter: 'pri_01kyhfb5q0jxrck07py0xxaqw7',
  workshop: 'pri_01kyhfczs0aaj62smrthvc3my8',
  professional: 'pri_01kyhff4xx34m229w6ytpjpefs',
  teamWallet: 'pri_01kyhfgk3ax50gz1m7zh877w9c'
} as const;

export const PACKAGES: CreditPackage[] = [
  {
    id: 'STARTER',
    credits: 20,
    price: '$15',
    priceUsd: 15,
    perCredit: '$0.75',
    paddlePriceId: PADDLE_SANDBOX_PRICE_IDS.starter
  },
  {
    id: 'WORKSHOP',
    credits: 100,
    price: '$59',
    priceUsd: 59,
    perCredit: '$0.59',
    paddlePriceId: PADDLE_SANDBOX_PRICE_IDS.workshop,
    badge: 'MOST POPULAR',
    featured: true
  },
  {
    id: 'PROFESSIONAL',
    credits: 300,
    price: '$149',
    priceUsd: 149,
    perCredit: '$0.50',
    paddlePriceId: PADDLE_SANDBOX_PRICE_IDS.professional,
    badge: 'BEST VALUE'
  },
  {
    id: 'TEAM_WALLET',
    credits: 1000,
    price: '$399',
    priceUsd: 399,
    perCredit: '$0.40',
    paddlePriceId: PADDLE_SANDBOX_PRICE_IDS.teamWallet
  }
];

/** Purchased credits never expire. */
export const PURCHASED_CREDITS_EXPIRE = false;

/** Trial promotional grant. */
export const TRIAL_PROMOTIONAL_CREDITS = 15;
export const TRIAL_EXPIRY_DAYS = 14;

export function getPackageByPriceId(priceId: string): CreditPackage | undefined {
  return PACKAGES.find((p) => p.paddlePriceId === priceId);
}

export function getPackageById(id: CreditPackageId): CreditPackage | undefined {
  return PACKAGES.find((p) => p.id === id);
}

export function getPackageByCredits(credits: number): CreditPackage | undefined {
  return PACKAGES.find((p) => p.credits === credits);
}
