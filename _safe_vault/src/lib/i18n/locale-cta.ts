import type { SupportedLocale } from "@/lib/i18n/locale-config";

export const CTA_KEYS = [
  "startFree",
  "calculateNow",
  "viewFreeTools",
  "openPremiumAnalyzer",
  "unlockFullReport",
  "viewPricing",
  "downloadCsv",
  "printReport",
  "copySummary",
  "switchLanguage",
  "chooseSector",
  "seeWhatThisEstimateMisses",
] as const;

export type CtaKey = (typeof CTA_KEYS)[number];

export type LocaleCtaMap = Record<CtaKey, string>;

/** Maximum button label length per locale (public UI). */
export const CTA_MAX_LENGTH: Record<SupportedLocale, number> = {
  en: 28,
} as Record<SupportedLocale, number>;

export const LOCALE_CTA: Record<SupportedLocale, LocaleCtaMap> = {
  en: {
    startFree: "Start free",
    calculateNow: "Calculate now",
    viewFreeTools: "View free calculators",
    openPremiumAnalyzer: "Open calculator",
    unlockFullReport: "Unlock full report",
    viewPricing: "View pricing",
    downloadCsv: "Download CSV",
    printReport: "Print report",
    copySummary: "Copy summary",
    switchLanguage: "Language",
    chooseSector: "Choose sector",
    seeWhatThisEstimateMisses: "See what's missing",
  },
} as Record<SupportedLocale, LocaleCtaMap>;

export function getCtaLabel(locale: SupportedLocale, key: CtaKey): string {
  return LOCALE_CTA[locale][key];
}

export function getCtaLengthViolations(
  locale: SupportedLocale,
): readonly { key: CtaKey; length: number; max: number }[] {
  const max = CTA_MAX_LENGTH[locale];
  return CTA_KEYS.filter((key) => LOCALE_CTA[locale][key].length > max).map(
    (key) => ({
      key,
      length: LOCALE_CTA[locale][key].length,
      max,
    }),
  );
}
