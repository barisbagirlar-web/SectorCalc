import { isSupportedLocale, type SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

const RESPONSE_LANGUAGE_HINT: Record<SupportedLocale, string> = {
  en: "Respond in English unless the user writes in another language.",
};

export function resolveTraceLocale(locale: string): SupportedLocale {
  return isSupportedLocale(locale) ? locale : "en";
}

export function buildTraceLocaleHint(locale: string): string {
  return RESPONSE_LANGUAGE_HINT[resolveTraceLocale(locale)];
}
