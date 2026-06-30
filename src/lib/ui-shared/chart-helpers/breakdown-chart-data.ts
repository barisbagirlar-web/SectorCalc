import { resolveBreakdownColor } from "@/lib/ui-shared/chart-helpers";
import {
  classifyBreakdownKey,
  sortBreakdownDimensions,
  type BreakdownChartDimension,
} from "@/lib/ui-shared/chart-helpers/breakdown-chart-dimensions";
import type { GeneratedToolBreakdown } from "@/lib/features/generated-tools/types";

export type BreakdownChartItem = {
  readonly key: string;
  readonly name: string;
  readonly value: number;
  readonly percent: string;
  readonly displayValue: string;
  readonly color: string;
  readonly dimension: BreakdownChartDimension;
  readonly unitHint?: string;
};

export type BreakdownChartGroup = {
  readonly dimension: BreakdownChartDimension;
  readonly items: readonly BreakdownChartItem[];
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

function isValidBreakdownValue(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function formatChartValueForDimension(
  value: number,
  dimension: BreakdownChartDimension,
  locale: string,
  currency: string,
  key = "",
): string {
  const absValue = Math.abs(value);

  switch (dimension) {
    case "percent":
      if (absValue <= 1 && isRatioLikeKey(key)) {
        return new Intl.NumberFormat(locale, {
          style: "percent",
          maximumFractionDigits: 1,
        }).format(value);
      }
      return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)}%`;
    case "currency":
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(value);
    case "factor":
      return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 3,
      }).format(value);
    case "time":
    case "count":
    case "generic":
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
    default:
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
  }
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

function buildItemsForEntries(
  entries: readonly (readonly [string, number])[],
  locale: string,
  currency: string,
  resolveLabel: (key: string) => string,
  unitHints?: Readonly<Record<string, string>>,
  forcedDimension?: BreakdownChartDimension,
): BreakdownChartItem[] {
  if (entries.length === 0) {
    return [];
  }

  const dimension =
    forcedDimension ??
  classifyBreakdownKey(entries[0]?.[0] ?? "", unitHints?.[entries[0]?.[0] ?? ""]);

  const useCurrency = dimension === "currency";
  const total = entries.reduce((sum, [, value]) => sum + Math.abs(value), 0);
  const safeTotal = total > 0 ? total : 1;

  return entries.map(([key, value]) => {
    const itemDimension = forcedDimension ?? classifyBreakdownKey(key, unitHints?.[key]);
    return {
      key,
      name: resolveLabel(key),
      value: Math.abs(value),
      percent: ((Math.abs(value) / safeTotal) * 100).toFixed(1),
      displayValue: formatChartValueForDimension(value, itemDimension, locale, currency, key),
      color: resolveBreakdownColor(key),
      dimension: itemDimension,
      unitHint: unitHints?.[key],
    };
  });
}

export function buildBreakdownChartData(
  breakdown: GeneratedToolBreakdown,
  locale: string,
  currency: string,
  resolveLabel: (key: string) => string,
  unitHints?: Readonly<Record<string, string>>,
): BreakdownChartItem[] {
  const entries = Object.entries(breakdown).filter((entry): entry is [string, number] =>
    isValidBreakdownValue(entry[1]),
  );

  if (entries.length === 0) {
    return [];
  }

  const useCurrency = entries.every(
    ([key, value]) =>
      classifyBreakdownKey(key, unitHints?.[key]) !== "percent" &&
      classifyBreakdownKey(key, unitHints?.[key]) !== "factor" &&
      (!isRatioLikeKey(key) || Math.abs(value) >= 1),
  );

  return entries.map(([key, value]) => {
    const dimension = classifyBreakdownKey(key, unitHints?.[key]);
    return {
      key,
      name: resolveLabel(key),
      value: Math.abs(value),
      percent: (() => {
        const total = entries.reduce((sum, [, entryValue]) => sum + Math.abs(entryValue), 0);
        const safeTotal = total > 0 ? total : 1;
        return ((Math.abs(value) / safeTotal) * 100).toFixed(1);
      })(),
      displayValue:
        dimension === "currency" || dimension === "percent" || dimension === "factor"
          ? formatChartValueForDimension(value, dimension, locale, currency, key)
          : formatChartValue(value, key, locale, currency, useCurrency),
      color: resolveBreakdownColor(key),
      dimension,
      unitHint: unitHints?.[key],
    };
  });
}

export function buildBreakdownChartGroups(
  breakdown: GeneratedToolBreakdown,
  locale: string,
  currency: string,
  resolveLabel: (key: string) => string,
  unitHints?: Readonly<Record<string, string>>,
): BreakdownChartGroup[] {
  const entries = Object.entries(breakdown).filter((entry): entry is [string, number] =>
    isValidBreakdownValue(entry[1]),
  );

  if (entries.length === 0) {
    return [];
  }

  const grouped = new Map<BreakdownChartDimension, [string, number][]>();
  for (const entry of entries) {
    const [key, value] = entry;
    const dimension = classifyBreakdownKey(key, unitHints?.[key]);
    const bucket = grouped.get(dimension) ?? [];
    bucket.push([key, value]);
    grouped.set(dimension, bucket);
  }

  return sortBreakdownDimensions([...grouped.keys()]).map((dimension) => ({
    dimension,
    items: buildItemsForEntries(
      grouped.get(dimension) ?? [],
      locale,
      currency,
      resolveLabel,
      unitHints,
      dimension,
    ),
  }));
}

export function shouldUseCurrencyAxis(
  breakdown: GeneratedToolBreakdown,
  unitHints?: Readonly<Record<string, string>>,
): boolean {
  const entries = Object.entries(breakdown).filter(([, value]) => isValidBreakdownValue(value));
  if (entries.length === 0) {
    return false;
  }

  return entries.every(([key, value]) => {
    const dimension = classifyBreakdownKey(key, unitHints?.[key]);
    if (dimension === "currency") {
      return true;
    }
    return !isRatioLikeKey(key) || Math.abs(value ?? 0) >= 1;
  });
}

export function resolveChartAxisWidth(items: readonly BreakdownChartItem[]): number {
  const longestLabel = items.reduce((max, item) => Math.max(max, item.name.length), 0);
  return Math.min(240, Math.max(128, longestLabel * 7));
}

export function resolveChartPanelHeight(itemCount: number): number {
  return Math.min(420, Math.max(220, itemCount * 52));
}

export { formatBreakdownKey, formatChartValue, isRatioLikeKey };
