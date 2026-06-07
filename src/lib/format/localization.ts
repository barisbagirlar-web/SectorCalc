/**
 * Locale-aware formatting helpers for SectorCalc public surfaces.
 * EN/TR primary; USD currency fallback when unspecified.
 */

export type SupportedLocale = "en" | "tr";

export type CurrencyCode = "USD" | "TRY" | "EUR" | "GBP";

export type UnitSystem = "metric" | "imperial";

export const NOT_AVAILABLE = "Not available";

const LANGUAGE_TAGS: Record<SupportedLocale, string> = {
  en: "en-US",
  tr: "tr-TR",
};

const FREE_TOOL_LEGAL_NOTE: Record<SupportedLocale, string> = {
  en: "This is a technical estimate based on the values you entered. It is not financial, legal, medical or engineering advice.",
  tr: "Bu sonuç, girdiğiniz değerlere dayalı teknik bir tahmindir. Mali, hukuki, tıbbi veya mühendislik danışmanlığı yerine geçmez.",
};

const PREMIUM_LEGAL_NOTE: Record<SupportedLocale, string> = {
  en: "This report is a technical decision-support simulation based on user-provided inputs and sector assumptions. It is not financial, legal, medical or engineering advice. Verify all outputs before business decisions.",
  tr: "Bu rapor, kullanıcı girdileri ve sektör varsayımlarına dayalı teknik bir karar destek simülasyonudur. Mali, hukuki, tıbbi veya mühendislik danışmanlığı yerine geçmez. İş kararlarından önce tüm çıktıları doğrulayın.",
};

const TECHNICAL_SIMULATION_NOTICE: Record<SupportedLocale, string> = {
  en: "Technical decision-support simulation — not financial, legal, medical or engineering advice.",
  tr: "Teknik karar destek simülasyonu — mali, hukuki, tıbbi veya mühendislik danışmanlığı değildir.",
};

export interface FormatNumberOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

function isUnavailable(value: number): boolean {
  return !Number.isFinite(value);
}

export function normalizeLocale(locale: string | undefined): SupportedLocale {
  if (locale === "tr" || locale?.startsWith("tr-") || locale?.startsWith("tr_")) {
    return "tr";
  }
  return "en";
}

export function getDefaultCurrency(locale: SupportedLocale): CurrencyCode {
  return locale === "tr" ? "TRY" : "USD";
}

export function getDefaultUnitSystem(locale: SupportedLocale): UnitSystem {
  if (locale === "tr") {
    return "metric";
  }
  return "metric";
}

export function getDecimalSeparator(locale: SupportedLocale): string {
  const parts = new Intl.NumberFormat(LANGUAGE_TAGS[locale]).formatToParts(1.1);
  return parts.find((part) => part.type === "decimal")?.value ?? ".";
}

export function formatLocalizedNumber(
  value: number,
  locale: SupportedLocale,
  options: FormatNumberOptions = {},
): string {
  if (isUnavailable(value)) {
    return NOT_AVAILABLE;
  }
  return new Intl.NumberFormat(LANGUAGE_TAGS[locale], {
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
    return NOT_AVAILABLE;
  }
  const code = currency ?? getDefaultCurrency(locale);
  try {
    return new Intl.NumberFormat(LANGUAGE_TAGS[locale], {
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
    return NOT_AVAILABLE;
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
    return NOT_AVAILABLE;
  }
  return new Intl.DateTimeFormat(LANGUAGE_TAGS[locale], {
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
  if (formatted === NOT_AVAILABLE) {
    return NOT_AVAILABLE;
  }
  return unit ? `${formatted} ${unit}`.trim() : formatted;
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
    return NOT_AVAILABLE;
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
