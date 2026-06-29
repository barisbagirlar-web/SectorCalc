import phraseGlossary from "@/data/calculator-phrase-glossary.json";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n/locale-config";

type GlossaryMap = Record<string, string>;

const GLOSSARY = phraseGlossary as Record<string, GlossaryMap>;

function sortedEntries(locale: string): readonly (readonly [string, string])[] {
  const map = GLOSSARY[locale] ?? {};
  return Object.entries(map).sort((a, b) => b[0].length - a[0].length);
}

export function isSupportedCalculatorLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

/** Deterministic EN phrase → locale phrase (longest match first). */
export function translateCalculatorPhrase(text: string, locale: string): string {
  if (!text || locale === "en" || !isSupportedCalculatorLocale(locale)) {
    return text;
  }

  let result = text;
  for (const [en, localized] of sortedEntries(locale)) {
    const re = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(re, localized);
  }
  return result;
}

export function translateCalculatorPhrases(
  texts: readonly string[],
  locale: string,
): string[] {
  return texts.map((text) => translateCalculatorPhrase(text, locale));
}
