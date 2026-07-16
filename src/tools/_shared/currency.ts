// SectorCalc — Currency Selector V5.4
// Single currency component for all 20 PRO tools.
// DISPLAY ONLY — no conversion. ISO codes are labels, not conversion factors.
// Exception: FX & Commodity Pass-Through Pricer (#20) has a manual rate field.

export const CURRENCIES = [
  { code: "EUR", sym: "\u20AC", name: "Euro" },
  { code: "USD", sym: "$", name: "US dollar" },
  { code: "GBP", sym: "\u00A3", name: "British pound" },
  { code: "TRY", sym: "\u20BA", name: "Turkish lira" },
  { code: "JPY", sym: "\u00A5", name: "Japanese yen" },
  { code: "CNY", sym: "\u00A5", name: "Chinese yuan" },
  { code: "CHF", sym: "CHF", name: "Swiss franc" },
  { code: "SEK", sym: "kr", name: "Swedish krona" },
  { code: "AUD", sym: "A$", name: "Australian dollar" },
  { code: "CAD", sym: "C$", name: "Canadian dollar" },
  { code: "INR", sym: "\u20B9", name: "Indian rupee" },
  { code: "AED", sym: "AED", name: "UAE dirham" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

/** Resolve the symbol for a given currency code. */
export function getCurrencySymbol(code: CurrencyCode): string {
  const found = CURRENCIES.find((c) => c.code === code);
  return found?.sym ?? code;
}

/** Format a monetary value with currency code prefix. No FX conversion applied. */
export function formatCurrency(value: number, code: CurrencyCode): string {
  const sym = getCurrencySymbol(code);
  const abs = Math.abs(value);
  const prefix = value < 0 ? "-" : "";
  // Handle large numbers with compact notation
  if (abs >= 1e6) return `${prefix}${sym}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${prefix}${sym}${(abs / 1e3).toFixed(1)}K`;
  return `${prefix}${sym}${abs.toFixed(2)}`;
}

/** Format a monetary rate value (per-unit). */
export function formatCurrencyRate(value: number, code: CurrencyCode, perLabel: string): string {
  const sym = getCurrencySymbol(code);
  return `${sym}${value.toFixed(2)} ${perLabel}`;
}
