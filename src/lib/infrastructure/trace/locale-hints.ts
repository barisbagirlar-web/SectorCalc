import { isSupportedLocale, type SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

const RESPONSE_LANGUAGE_HINT: Record<SupportedLocale, string> = {
  en: "Respond in English unless the user writes in another language.",
  tr: "Respond in Turkish unless the user writes in another language.",
  de: "Respond in German unless the user writes in another language.",
  fr: "Respond in French unless the user writes in another language.",
  es: "Respond in Spanish unless the user writes in another language.",
  ar: "Respond in Arabic unless the user writes in another language.",
};

export function resolveTraceLocale(locale: string): SupportedLocale {
  return isSupportedLocale(locale) ? locale : "en";
}

export function buildTraceLocaleHint(locale: string): string {
  return RESPONSE_LANGUAGE_HINT[resolveTraceLocale(locale)];
}
