/**
 * Locale Center — canonical money/number/percent/date formatters.
 * Public UI must use these instead of ad-hoc toLocaleString / Intl calls.
 */

import {
  formatLocalizedCurrency,
  formatLocalizedDate,
  formatLocalizedNumber,
  formatLocalizedPercent,
  getDefaultCurrency,
  normalizeLocale,
  type CurrencyCode,
  type SupportedLocale,
} from "@/lib/format/localization";
import { getDefaultCurrency as getRegionCurrency } from "@/lib/locale-center/unit-currency-center";
import { resolveRegionFromLocale } from "@/lib/locale-center/region-resolver";
import type { SupportedRegion } from "@/lib/locale-center/locale-types";

export type { SupportedLocale, CurrencyCode };

export function formatMoney(
  value: number,
  locale: SupportedLocale,
  currency?: string,
  region?: SupportedRegion,
): string {
  const normalized = normalizeLocale(locale);
  const code =
    (currency as CurrencyCode | undefined) ??
    (region ? getRegionCurrency(normalized, region) : getDefaultCurrency(normalized));
  return formatLocalizedCurrency(value, normalized, code as CurrencyCode);
}

export function formatNumber(
  value: number,
  locale: SupportedLocale,
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number },
): string {
  return formatLocalizedNumber(value, normalizeLocale(locale), options);
}

export function formatPercent(value: number, locale: SupportedLocale): string {
  return formatLocalizedPercent(value, normalizeLocale(locale));
}

export function formatDate(value: Date | string, locale: SupportedLocale): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return formatLocalizedDate(date, normalizeLocale(locale));
}

export function formatMoneyForLocaleRegion(
  value: number,
  locale: SupportedLocale,
  region?: SupportedRegion,
): string {
  const resolvedRegion = region ?? resolveRegionFromLocale(normalizeLocale(locale));
  return formatMoney(value, locale, undefined, resolvedRegion);
}

/** @deprecated Prefer formatNumber — kept for gradual migration */
export const formatLocalizedNumberExport = formatLocalizedNumber;
