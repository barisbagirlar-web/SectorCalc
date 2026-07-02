export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'TRY', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'INR', 'BRL',
] as const;

export type Currency = typeof SUPPORTED_CURRENCIES[number];

export function convertGlobal(
  value: number,
  from: string,
  to: string,
  rates: Record<string, number>
): number {
  if (from === to) return value;
  // from → USD (base) → to
  const inUSD = value / rates[from];
  return inUSD * rates[to];
}
