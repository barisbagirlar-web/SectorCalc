/**
 * Locale-aware formatting helpers for SectorCalc public surfaces.
 */

import {
  LOCALE_DEFINITIONS,
  type SupportedLocale,
  isSupportedLocale,
} from "@/lib/i18n/locale-config";

export type { SupportedLocale };

export type CurrencyCode = "USD" | "EUR" | "GBP";

export type UnitSystem = "metric" | "imperial";

const NOT_AVAILABLE_BY_LOCALE: Record<SupportedLocale, string> = {
  en: "Not available",
};

const FREE_TOOL_LEGAL_NOTE: Record<SupportedLocale, string> = {
  en: "This is a technical estimate based on the values you entered. It is not financial, legal, medical or engineering advice.",
};

const PREMIUM_LEGAL_NOTE: Record<SupportedLocale, string> = {
  en: "This report is a technical decision-support simulation based on user-provided inputs and sector assumptions. It is not financial, legal, medical or engineering advice. Verify all outputs before business decisions.",
};

const TECHNICAL_SIMULATION_NOTICE: Record<SupportedLocale, string> = {
  en: "Technical decision-support simulation — not financial, legal, medical or engineering advice.",
};

export interface FormatNumberOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

function isUnavailable(value: number): boolean {
  return !Number.isFinite(value);
}

export function normalizeLocale(locale: string | undefined): SupportedLocale {
  const base = locale?.split("-")[0]?.toLowerCase();
  if (base && isSupportedLocale(base)) {
    return base;
  }
  return "en";
}

export function getLocalizedNotAvailable(locale: SupportedLocale): string {
  return NOT_AVAILABLE_BY_LOCALE[locale];
}

export function getDefaultCurrency(locale: SupportedLocale): CurrencyCode {
  return LOCALE_DEFINITIONS[locale].currency;
}

export function getDefaultUnitSystem(locale: SupportedLocale): UnitSystem {
  return LOCALE_DEFINITIONS[locale].unitSystem;
}

export function getDecimalSeparator(locale: SupportedLocale): string {
  const tag = LOCALE_DEFINITIONS[locale].numberLocale;
  const parts = new Intl.NumberFormat(tag).formatToParts(1.1);
  return parts.find((part) => part.type === "decimal")?.value ?? ".";
}

export function formatLocalizedNumber(
  value: number,
  locale: SupportedLocale,
  options: FormatNumberOptions = {},
): string {
  if (isUnavailable(value)) {
    return getLocalizedNotAvailable(locale);
  }
  return new Intl.NumberFormat(LOCALE_DEFINITIONS[locale].numberLocale, {
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(value);
}

export function formatLocalizedCurrency(
  value: number,
  locale: SupportedLocale,
  currency?: CurrencyCode,
  options: FormatNumberOptions = {},
): string {
  if (isUnavailable(value)) {
    return getLocalizedNotAvailable(locale);
  }
  const code = currency ?? getDefaultCurrency(locale);
  try {
    return new Intl.NumberFormat(LOCALE_DEFINITIONS[locale].numberLocale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: options.minimumFractionDigits,
      maximumFractionDigits: options.maximumFractionDigits,
    }).format(value);
  } catch {
    return `${code} ${formatLocalizedNumber(value, locale, options)}`;
  }
}

export function formatLocalizedPercent(value: number, locale: SupportedLocale): string {
  if (isUnavailable(value)) {
    return getLocalizedNotAvailable(locale);
  }
  return `${formatLocalizedNumber(value, locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  })}%`;
}

export function formatLocalizedDate(
  value: string | Date | number,
  locale: SupportedLocale,
): string {
  const parsed =
    value instanceof Date
      ? value.getTime()
      : typeof value === "number"
        ? value
        : Date.parse(String(value));
  if (!Number.isFinite(parsed)) {
    return getLocalizedNotAvailable(locale);
  }
  return new Intl.DateTimeFormat(LOCALE_DEFINITIONS[locale].dateLocale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(parsed));
}

export function formatUnitValue(
  value: number,
  unit: string,
  locale: SupportedLocale,
): string {
  const formatted = formatLocalizedNumber(value, locale);
  if (formatted === getLocalizedNotAvailable(locale)) {
    return formatted;
  }
  return unit ? `${formatted} ${unit}`.trim() : formatted;
}

export function getLocalizedLegalNote(locale: SupportedLocale): string {
  return FREE_TOOL_LEGAL_NOTE[locale];
}

export function getFreeToolLegalNote(locale: SupportedLocale): string {
  return FREE_TOOL_LEGAL_NOTE[locale];
}

export function getPremiumLegalNote(locale: SupportedLocale): string {
  return PREMIUM_LEGAL_NOTE[locale];
}

export function getTechnicalSimulationNotice(locale: SupportedLocale = "en"): string {
  return TECHNICAL_SIMULATION_NOTICE[normalizeLocale(locale)];
}

export function getPremiumOutputFormatted(
  value: number,
  format: "currency" | "percentage" | "number" | "duration" | "score",
  unit: string,
  locale: SupportedLocale,
  currency: CurrencyCode = "USD",
): string {
  if (isUnavailable(value)) {
    return getLocalizedNotAvailable(locale);
  }

  switch (format) {
    case "currency":
      return formatLocalizedCurrency(value, locale, currency, { maximumFractionDigits: 0 });
    case "percentage":
      return formatLocalizedPercent(value, locale);
    case "duration":
      return `${formatLocalizedNumber(value, locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 })} h`;
    case "score":
      return formatLocalizedNumber(value, locale, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    default:
      return unit
        ? formatUnitValue(value, unit, locale)
        : formatLocalizedNumber(value, locale, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }
}

/** @deprecated Use getLocalizedNotAvailable */
export const NOT_AVAILABLE = NOT_AVAILABLE_BY_LOCALE.en;
