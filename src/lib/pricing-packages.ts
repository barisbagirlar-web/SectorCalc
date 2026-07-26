/**
 * Credit package definitions — single source of truth for the pricing page.
 * Sandbox Paddle price IDs (Sectorcalc10 test catalog).
 */
export interface CreditPackage {
  credits: number;
  price: string;
  perCredit: string;
  paddlePriceId: string;
  badge?: string;
  featured?: boolean;
}

export const PACKAGES: CreditPackage[] = [
  {
    credits: 1,
    price: '$1.99',
    perCredit: '$1.99',
    paddlePriceId: 'pri_01kvv1wpnq508nkg37f9vy0aqy',
    badge: 'TRY ONCE'
  },
  {
    credits: 5,
    price: '$4.99',
    perCredit: '$1.00',
    paddlePriceId: 'pri_01kvv20wppf64fht2tn82wq8wc'
  },
  {
    credits: 15,
    price: '$7.99',
    perCredit: '$0.53',
    paddlePriceId: 'pri_01kvv24222vst09fyh7rxv3ck8',
    badge: 'MOST POPULAR',
    featured: true
  },
  {
    credits: 30,
    price: '$11.99',
    perCredit: '$0.40',
    paddlePriceId: 'pri_01kvv27axkgbd5ddmd9c6gaaj9',
    badge: 'BEST VALUE'
  },
  {
    credits: 100,
    price: '$24.99',
    perCredit: '$0.25',
    paddlePriceId: 'pri_01kvv28x31xas1q8pdrqqa4hr7',
    badge: 'MAX SAVINGS'
  }
];

export const FREE_MONTHLY_CREDITS = '3-5';
export const CREDIT_VALIDITY = '12 months';

export function getPackageByPriceId(priceId: string): CreditPackage | undefined {
  return PACKAGES.find((p) => p.paddlePriceId === priceId);
}

export function getPackageByCredits(credits: number): CreditPackage | undefined {
  return PACKAGES.find((p) => p.credits === credits);
}
