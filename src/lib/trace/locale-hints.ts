import { isSupportedLocale, type SupportedLocale } from "@/lib/i18n/locale-config";

const RESPONSE_LANGUAGE_HINT: Record<SupportedLocale, string> = {
  en: "Respond in English unless the user writes in another language.",
};

export function resolveTraceLocale(locale: string): SupportedLocale {
  return isSupportedLocale(locale) ? locale : "en";
}

export function getResponseLanguageHint(locale: string): string {
  const safeLocale = resolveTraceLocale(locale);
  return RESPONSE_LANGUAGE_HINT[safeLocale];
}

export function buildTraceLocaleHint(_locale: string): string {
  return RESPONSE_LANGUAGE_HINT.en;
}
