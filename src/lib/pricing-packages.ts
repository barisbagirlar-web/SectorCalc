/**
 * Credit package definitions — display SSOT for pricing UI.
 * Server maps packageKey → Paddle price ID. Browser never owns price IDs for checkout.
 */
export type CreditPackageKey = 'STARTER' | 'WORKSHOP' | 'PROFESSIONAL' | 'TEAM_WALLET';

export interface CreditPackage {
  key: CreditPackageKey;
  credits: number;
  price: string;
  perCredit: string;
  /** @deprecated Client must not checkout by price ID. Kept empty intentionally. */
  paddlePriceId: string;
  badge?: string;
  featured?: boolean;
}

export const PACKAGES: CreditPackage[] = [
  {
    key: 'STARTER',
    credits: 20,
    price: '$15',
    perCredit: '$0.75',
    paddlePriceId: ''
  },
  {
    key: 'WORKSHOP',
    credits: 100,
    price: '$59',
    perCredit: '$0.59',
    paddlePriceId: '',
    badge: 'MOST POPULAR',
    featured: true
  },
  {
    key: 'PROFESSIONAL',
    credits: 300,
    price: '$149',
    perCredit: '$0.50',
    paddlePriceId: '',
    badge: 'BEST VALUE'
  },
  {
    key: 'TEAM_WALLET',
    credits: 1000,
    price: '$399',
    perCredit: '$0.40',
    paddlePriceId: ''
  }
];

/** Purchased credits do not expire (mandate). Promotional credits are separate. */
export const FREE_MONTHLY_CREDITS = '0';
export const CREDIT_VALIDITY = 'never expire';

export function getPackageByKey(key: string): CreditPackage | undefined {
  return PACKAGES.find((p) => p.key === key);
}

export function getPackageByCredits(credits: number): CreditPackage | undefined {
  return PACKAGES.find((p) => p.credits === credits);
}

/** @deprecated Prefer getPackageByKey — price IDs are server-only. */
export function getPackageByPriceId(_priceId: string): CreditPackage | undefined {
  return undefined;
}
