import { translateCalculatorPhrase } from "@/lib/i18n/calculator-phrase-translate";
import type { SupportedLocale } from "@/lib/format/localization";

export type LocalizableTrafficResultPartial = {
  readonly headline: string;
  readonly primaryLabel: string;
  readonly explanation: string;
  readonly secondaryValues: readonly { readonly label: string; readonly value: string }[];
  readonly missingFactors?: readonly string[];
};

export function localizeTrafficResultPartial<T extends LocalizableTrafficResultPartial>(
  partial: T,
  locale: SupportedLocale | string,
): T {
  if (locale === "en") {
    return partial;
  }

  const translate = (text: string) => translateCalculatorPhrase(text, locale);

  return {
    ...partial,
    headline: translate(partial.headline),
    primaryLabel: translate(partial.primaryLabel),
    explanation: translate(partial.explanation),
    secondaryValues: partial.secondaryValues.map((entry) => ({
      label: translate(entry.label),
      value: entry.value,
    })),
    missingFactors: partial.missingFactors?.map((factor) => translate(factor)),
  };
}
