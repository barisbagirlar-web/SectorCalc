/**
 * Global unit and currency formatters for Manufacturing OS.
 */

export type FormatLocale = "en-US" | "tr-TR" | "de-DE" | "es-ES" | "ar-SA";

const DEFAULT_LOCALE: FormatLocale = "en-US";

export function formatCurrency(
 value: number,
 locale: FormatLocale = DEFAULT_LOCALE,
 currency = "USD"
): string {
 if (!Number.isFinite(value)) {
 return "—";
 }
 return new Intl.NumberFormat(locale, {
 style: "currency",
 currency,
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 }).format(value);
}

export function formatNumber(
 value: number,
 locale: FormatLocale = DEFAULT_LOCALE,
 fractionDigits = 2
): string {
 if (!Number.isFinite(value)) {
 return "—";
 }
 return value.toLocaleString(locale, {
 minimumFractionDigits: fractionDigits,
 maximumFractionDigits: fractionDigits,
 });
}

export function formatPercent(
 value: number,
 locale: FormatLocale = DEFAULT_LOCALE,
 fractionDigits = 2
): string {
 if (!Number.isFinite(value)) {
 return "—";
 }
 return `${value.toLocaleString(locale, {
 minimumFractionDigits: fractionDigits,
 maximumFractionDigits: fractionDigits,
 })}%`;
}

export function formatUnitValue(
 value: number,
 unit: string,
 locale: FormatLocale = DEFAULT_LOCALE,
 fractionDigits = 2
): string {
 return `${formatNumber(value, locale, fractionDigits)} ${unit}`;
}

export const UNIT_LABELS = {
 seconds: "s",
 minutes: "min",
 hours: "hr",
 liters: "L",
 kilograms: "kg",
 kwh: "kWh",
 tonnes: "tCO₂e",
 squareFeet: "sq ft",
 percent: "%",
 currency: "$",
} as const;

export type UnitLabelKey = keyof typeof UNIT_LABELS;

export function unitLabel(key: UnitLabelKey): string {
 return UNIT_LABELS[key];
}
