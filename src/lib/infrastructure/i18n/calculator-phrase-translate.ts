import phraseGlossary from "@/data/calculator-phrase-glossary.json";
import { polishCalculatorSurfaceResidue } from "@/lib/infrastructure/i18n/calculator-surface-residue";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

type GlossaryMap = Record<string, string>;

const GLOSSARY = phraseGlossary as Record<string, GlossaryMap>;

function sortedEntries(locale: string): readonly (readonly [string, string])[] {
  const map = GLOSSARY[locale] ?? {};
  return Object.entries(map).sort((a, b) => b[0].length - a[0].length);
}

/** Single-token glossary keys must not match inside longer words (e.g. per → operations). */
function glossaryReplacePattern(english: string): RegExp {
  const escaped = english.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (/^[\p{L}\p{N}_'-]+$/u.test(english)) {
    return new RegExp(`\\b${escaped}\\b`, "giu");
  }
  return new RegExp(escaped, "gi");
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
    result = result.replace(glossaryReplacePattern(en), localized);
  }
  return polishCalculatorSurfaceResidue(result, locale);
}

export function translateCalculatorPhrases(
  texts: readonly string[],
  locale: string,
): string[] {
  return texts.map((text) => translateCalculatorPhrase(text, locale));
}
