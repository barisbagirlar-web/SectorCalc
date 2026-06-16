import { resolveBreakdownColor } from "@/lib/chart-helpers";
import type { GeneratedToolBreakdown } from "@/lib/generated-tools/types";

export type BreakdownChartItem = {
  readonly key: string;
  readonly name: string;
  readonly value: number;
  readonly percent: string;
  readonly displayValue: string;
  readonly color: string;
};

function formatBreakdownKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function isRatioLikeKey(key: string): boolean {
  if (/time|downtime|cycle|duration|spindle_speed|rpm|frequency|passes|count/i.test(key)) {
    return false;
  }
  return /ratio|rate|percent|multiplier|availability|performance|quality|share/i.test(key);
}

function formatChartValue(
  value: number,
  key: string,
  locale: string,
  currency: string,
  useCurrency: boolean,
): string {
  if (value > 0 && value < 1 && isRatioLikeKey(key)) {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(value);
  }

  if (useCurrency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
}

export function buildBreakdownChartData(
  breakdown: GeneratedToolBreakdown,
  locale: string,
  currency: string,
  resolveLabel: (key: string) => string,
): BreakdownChartItem[] {
  const entries = Object.entries(breakdown).filter(
    (entry): entry is [string, number] => {
      const value = entry[1];
      return typeof value === "number" && Number.isFinite(value);
    },
  );

  if (entries.length === 0) {
    return [];
  }

  const total = entries.reduce((sum, [, value]) => sum + Math.abs(value), 0);
  const safeTotal = total > 0 ? total : 1;
  const useCurrency = entries.every(
    ([key, value]) => !isRatioLikeKey(key) || Math.abs(value) >= 1,
  );

  return entries.map(([key, value]) => ({
    key,
    name: resolveLabel(key),
    value: Math.abs(value),
    percent: ((Math.abs(value) / safeTotal) * 100).toFixed(1),
    displayValue: formatChartValue(value, key, locale, currency, useCurrency),
    color: resolveBreakdownColor(key),
  }));
}

export function shouldUseCurrencyAxis(breakdown: GeneratedToolBreakdown): boolean {
  return Object.entries(breakdown).every(([key, value]) => {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return true;
    }
    return !isRatioLikeKey(key) || Math.abs(value) >= 1;
  });
}

export { formatBreakdownKey, formatChartValue, isRatioLikeKey };
