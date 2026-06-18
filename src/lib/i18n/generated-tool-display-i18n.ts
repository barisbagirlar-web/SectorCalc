import titlesBundle from "@/data/generated-tool-titles-i18n.generated.json";
import descriptionsBundle from "@/data/generated-tool-descriptions-i18n.generated.json";
import { isSupportedLocale, type SupportedLocale } from "@/lib/i18n/locale-config";

type LocaleTitleMap = Partial<Record<SupportedLocale, string>> & { readonly en?: string };

const TITLES = titlesBundle as Record<string, LocaleTitleMap>;
const DESCRIPTIONS = descriptionsBundle as Record<string, LocaleTitleMap>;

export function resolveGeneratedToolDisplayTitle(
  slug: string,
  fallbackEn: string,
  locale: string,
): string {
  const normalizedLocale: SupportedLocale = isSupportedLocale(locale) ? locale : "en";
  const entry = TITLES[slug];
  if (!entry) {
    return fallbackEn;
  }
  const localized = entry[normalizedLocale]?.trim();
  if (localized) {
    return localized;
  }
  if (normalizedLocale === "en") {
    return entry.en?.trim() || fallbackEn;
  }
  return fallbackEn;
}

export function resolveGeneratedToolDisplayDescription(
  slug: string,
  fallbackEn: string,
  locale: string,
): string | undefined {
  const normalizedLocale: SupportedLocale = isSupportedLocale(locale) ? locale : "en";
  const entry = DESCRIPTIONS[slug];
  if (!entry) {
    return undefined;
  }
  const localized = entry[normalizedLocale]?.trim();
  if (localized) {
    return localized;
  }
  if (normalizedLocale === "en") {
    return entry.en?.trim() || fallbackEn;
  }
  return undefined;
}
