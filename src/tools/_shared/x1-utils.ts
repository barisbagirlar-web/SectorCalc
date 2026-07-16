// SectorCalc — x1 Design Pattern Shared Utilities
// Single source for 12-currency, severity class, number formatting,
// canonical suffixes, and field validation helpers.
// Every tool page imports from here instead of defining locally.

import { toCanonical } from "./units";
import type { DomainKey } from "./units";

// ── 12 ISO Currencies (matches x1.html) ────────────────────────

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

export const DEFAULT_CURRENCY_INDEX = 1; // USD

// ── Severity types ─────────────────────────────────────────────

export type Severity = "crit" | "opp" | "info";

export const SEVERITY_CLASS: Record<Severity, string> = {
  crit: "neg",
  opp: "pos",
  info: "warn",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  crit: "CRITICAL",
  opp: "OPPORTUNITY",
  info: "CONTEXT",
};

// ── Number formatting ─────────────────────────────────────────

/** Format a number for display. Returns em-dash for null/NaN, infinity for Infinity. */
export function fmtNum(x: number | null | undefined): string {
  if (x == null || Number.isNaN(x)) return "\u2014";
  if (!Number.isFinite(x)) return "\u221E";
  const a = Math.abs(x);
  return (+x).toLocaleString("en-US", { maximumFractionDigits: a >= 100 ? 0 : 2 });
}

// ── Canonical suffixes ────────────────────────────────────────

export const CANON_SUFFIX: Record<string, string> = {
  flat: "",
  years: " yr",
  hours: " h",
  wage: "/h",
  power: " kW",
  energyPrice: "/kWh",
  percent: "",
  days: " day",
  mass: " kg",
  length: " mm",
  energy: " kWh",
  money: "/mo",
  vol: "/mo",
  perUnit: "/unit",
};

// ── Field validation ──────────────────────────────────────────

export interface FieldDef {
  id: string;
  label: string;
  unit: string;
  domain: DomainKey;
  showPrefix: boolean;
  default: number;
  hint: string;
  ref: string;
  group: string;
  hardMin: number;
  hardMax: number;
  /** Unit options for the dropdown. Empty array = no selector. */
  unitOptions: string[];
}

/** Get error text for a field value. Returns empty string if valid. */
export function getFieldError(f: FieldDef, raw: number, unit: string): string {
  if (isNaN(raw)) return "Enter a number.";
  const canon = toCanonical(f.domain, raw, unit);
  if (canon < f.hardMin)
    return `Outside valid range (${f.hardMin}\u2013${f.hardMax} ${canonicalLabel(f.domain)}).`;
  if (canon > f.hardMax)
    return `Outside valid range (${f.hardMin}\u2013${f.hardMax} ${canonicalLabel(f.domain)}).`;
  return "";
}

/** Canonical unit label for a domain. */
export function canonicalLabel(domain: DomainKey): string {
  const labels: Record<string, string> = {
    flat: "cur", years: "yr", hours: "h",
    wage: "cur/h", power: "kW", energyPrice: "cur/kWh",
    percent: "fraction", days: "day", mass: "kg",
    length: "mm", energy: "kWh", money: "cur/mo",
    vol: "u/mo", perUnit: "cur/unit",
  };
  return labels[domain] || domain;
}

// ── Currency note (x1.html) ───────────────────────────────────

export const CURRENCY_NOTE =
  "Symbol only \u2014 no exchange-rate conversion applied. Enter every figure in the same currency.";
