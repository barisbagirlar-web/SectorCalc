import { isSupportedLocale, type SupportedLocale } from "@/lib/i18n/locale-config";
import { translateCalculatorPhrase } from "@/lib/i18n/calculator-phrase-translate";
import type { GeneratedToolI18nText } from "@/lib/generated-tools/types";

export const GENERATED_TOOL_I18N_LOCALES = [
  "en",
  "tr",
  "de",
  "fr",
  "es",
  "ar",
] as const satisfies readonly SupportedLocale[];

export function normalizeGeneratedI18nText(
  raw: unknown,
  fallback: string,
): GeneratedToolI18nText {
  const trimmedFallback = fallback.trim();
  const normalized: Partial<Record<SupportedLocale, string>> = {};

  if (raw && typeof raw === "object") {
    for (const locale of GENERATED_TOOL_I18N_LOCALES) {
      const value = (raw as Record<string, unknown>)[locale];
      if (typeof value === "string" && value.trim()) {
        normalized[locale] = value.trim();
      }
    }
  }

  if (!normalized.en) {
    normalized.en = trimmedFallback;
  }

  return normalized as GeneratedToolI18nText;
}

export function resolveGeneratedI18nText(
  i18n: GeneratedToolI18nText | undefined,
  locale: string,
  fallback: string,
): string {
  if (!i18n) {
    return fallback;
  }

  const normalizedLocale: SupportedLocale = isSupportedLocale(locale) ? locale : "en";
  const localized = i18n[normalizedLocale]?.trim();
  if (localized) {
    return localized;
  }

  const english = i18n.en?.trim();
  if (english && normalizedLocale !== "en") {
    return translateCalculatorPhrase(english, normalizedLocale);
  }
  if (english) {
    return english;
  }

  for (const localeKey of GENERATED_TOOL_I18N_LOCALES) {
    const value = i18n[localeKey]?.trim();
    if (value) {
      return normalizedLocale === "en" ? value : translateCalculatorPhrase(value, normalizedLocale);
    }
  }

  return normalizedLocale === "en" ? fallback : translateCalculatorPhrase(fallback, normalizedLocale);
}
