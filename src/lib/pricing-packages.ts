/**
 * Credit package definitions — single source of truth for the pricing page.
 * Paddle price IDs are attached in RM-009b (payment integration).
 */
export interface CreditPackage {
  credits: number;
  price: string;
  perCredit: string;
  badge?: string;
  featured?: boolean;
}

export const PACKAGES: CreditPackage[] = [
  { credits: 1, price: '$1.99', perCredit: '$1.99', badge: 'TRY ONCE' },
  { credits: 5, price: '$4.99', perCredit: '$1.00' },
  { credits: 15, price: '$7.99', perCredit: '$0.53', badge: 'MOST POPULAR', featured: true },
  { credits: 30, price: '$11.99', perCredit: '$0.40', badge: 'BEST VALUE' },
  { credits: 100, price: '$24.99', perCredit: '$0.25', badge: 'MAX SAVINGS' }
];

export const FREE_MONTHLY_CREDITS = '3-5';
export const CREDIT_VALIDITY = '12 months';
