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

/** Words beyond this length WILL produce garbage with translateCalculatorPhrase. */
const GLOSSARY_SAFE_WORD_LIMIT = 8;

function isGlossarySafe(text: string): boolean {
  return text.split(/\s+/).filter(Boolean).length <= GLOSSARY_SAFE_WORD_LIMIT;
}

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

/**
 * Resolve locale text from schema i18n data.
 *
 * Resolution order:
 *   1. locale-specific schema i18n (if present and non-empty)
 *   2. English schema i18n (clean EN, no glossary garbage)
 *   3. Glossary-safe fallback for short labels only (≤8 words),
 *      uses translateCalculatorPhrase which does word-for-word
 *      glossary replacement.
 *   4. Raw English fallback
 *
 * This avoids the mixed-language garbage that occurs when
 * translateCalculatorPhrase does word-by-word glossary replacement
 * on long descriptive text (businessContext, descriptions).
 *
 * Build-time audit (audit:schema-field-i18n --strict) catches
 * schemas with incomplete i18n and can fail CI.
 */
export function resolveGeneratedI18nText(
  i18n: GeneratedToolI18nText | undefined,
  locale: string,
  fallback: string,
): string {
  if (!i18n) {
    return fallback;
  }

  const normalizedLocale: SupportedLocale = isSupportedLocale(locale) ? locale : "en";

  // 1. Return proper locale-specific text
  const localized = i18n[normalizedLocale]?.trim();
  if (localized) {
    return localized;
  }

  const english = i18n.en?.trim();

  // 2. For short text (labels ≤8 words): use glossary as fallback.
  //    translateCalculatorPhrase works acceptably for short
  //    field labels even when schema i18n is missing.
  if (english && normalizedLocale !== "en" && isGlossarySafe(english)) {
    return translateCalculatorPhrase(english, normalizedLocale);
  }

  // 3. Fall back to English directly (for long descriptions this
  //    is cleaner than mixed-language glossary garbage).
  if (english) {
    return english;
  }

  // 4. Try any available locale
  for (const localeKey of GENERATED_TOOL_I18N_LOCALES) {
    const value = i18n[localeKey]?.trim();
    if (value) {
      return normalizedLocale === "en" ? value : value;
    }
  }

  // 5. Ultimate fallback
  return fallback;
}
