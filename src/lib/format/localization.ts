/**
 * Locale-aware formatting helpers for SectorCalc public surfaces.
 */

import {
  LOCALE_DEFINITIONS,
  type SupportedLocale,
  isSupportedLocale,
} from "@/lib/i18n/locale-config";

export type { SupportedLocale };

export type CurrencyCode = "USD" | "TRY" | "EUR" | "GBP";

export type UnitSystem = "metric" | "imperial";

const NOT_AVAILABLE_BY_LOCALE: Record<SupportedLocale, string> = {
  en: "Not available",
  tr: "Mevcut değil",
  de: "Nicht verfügbar",
  fr: "Non disponible",
  es: "No disponible",
  ar: "غير متاح",
};

const FREE_TOOL_LEGAL_NOTE: Record<SupportedLocale, string> = {
  en: "This is a technical estimate based on the values you entered. It is not financial, legal, medical or engineering advice.",
  tr: "Bu sonuç, girdiğiniz değerlere dayalı teknik bir tahmindir. Mali, hukuki, tıbbi veya mühendislik danışmanlığı yerine geçmez.",
  de: "Dieses Ergebnis ist eine technische Schätzung auf Basis Ihrer Eingaben. Es ersetzt keine Finanz-, Rechts-, Medizin- oder Ingenieurberatung.",
  fr: "Ce résultat est une estimation technique basée sur les valeurs saisies. Il ne remplace pas un conseil financier, juridique, médical ou d'ingénierie.",
  es: "Este resultado es una estimación técnica basada en los valores introducidos. No sustituye el asesoramiento financiero, legal, médico o de ingeniería.",
  ar: "هذه النتيجة تقدير تقني بناءً على القيم التي أدخلتها. ولا تُعد بديلاً عن الاستشارة المالية أو القانونية أو الطبية أو الهندسية.",
};

const PREMIUM_LEGAL_NOTE: Record<SupportedLocale, string> = {
  en: "This report is a technical decision-support simulation based on user-provided inputs and sector assumptions. It is not financial, legal, medical or engineering advice. Verify all outputs before business decisions.",
  tr: "Bu rapor, kullanıcı girdileri ve sektör varsayımlarına dayalı teknik bir karar destek simülasyonudur. Mali, hukuki, tıbbi veya mühendislik danışmanlığı yerine geçmez. İş kararlarından önce tüm çıktıları doğrulayın.",
  de: "Dieser Bericht ist eine technische Entscheidungsunterstützung auf Basis Ihrer Eingaben und Branchenannahmen. Er ersetzt keine Finanz-, Rechts-, Medizin- oder Ingenieurberatung. Prüfen Sie alle Ergebnisse vor Geschäftsentscheidungen.",
  fr: "Ce rapport est une simulation d'aide à la décision basée sur vos entrées et les hypothèses sectorielles. Il ne remplace pas un conseil financier, juridique, médical ou d'ingénierie. Vérifiez toutes les sorties avant toute décision.",
  es: "Este informe es una simulación de apoyo a decisiones basada en entradas del usuario y supuestos sectoriales. No sustituye asesoramiento financiero, legal, médico o de ingeniería. Verifique todos los resultados antes de decidir.",
  ar: "هذا التقرير محاكاة دعم قرار تقنية بناءً على مدخلات المستخدم وافتراضات القطاع. ولا يُعد بديلاً عن الاستشارة المالية أو القانونية أو الطبية أو الهندسية. تحقق من جميع المخرجات قبل قرارات العمل.",
};

const TECHNICAL_SIMULATION_NOTICE: Record<SupportedLocale, string> = {
  en: "Technical decision-support simulation — not financial, legal, medical or engineering advice.",
  tr: "Teknik karar destek simülasyonu — mali, hukuki, tıbbi veya mühendislik danışmanlığı değildir.",
  de: "Technische Entscheidungsunterstützung — keine Finanz-, Rechts-, Medizin- oder Ingenieurberatung.",
  fr: "Simulation d'aide à la décision — pas un conseil financier, juridique, médical ou d'ingénierie.",
  es: "Simulación de apoyo a decisiones — no es asesoramiento financiero, legal, médico o de ingeniería.",
  ar: "محاكاة دعم قرار تقنية — ليست استشارة مالية أو قانونية أو طبية أو هندسية.",
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
