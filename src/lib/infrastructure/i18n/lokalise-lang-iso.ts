import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

/** SectorCalc locale file name → Lokalise project lang_iso */
const LOKALISE_LANG_ISO_MAP: Readonly<Record<SupportedLocale, string>> = {
  en: "en",
};

export function resolveLokaliseLangIso(locale: SupportedLocale): string {
  return LOKALISE_LANG_ISO_MAP[locale];
}
