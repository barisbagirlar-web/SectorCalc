import titlesBundle from "@/data/generated-tool-titles-i18n.generated.json";
import descriptionsBundle from "@/data/generated-tool-descriptions-i18n.generated.json";
import { isSupportedLocale, type SupportedLocale } from "@/lib/i18n/locale-config";

type LocaleTitleMap = Partial<Record<SupportedLocale, string>> & { readonly en?: string };

const TITLES = titlesBundle as Record<string, LocaleTitleMap>;
const DESCRIPTIONS = descriptionsBundle as Record<string, LocaleTitleMap>;

/**
 * Try to find a bundle entry using both direct slug and slug+'(-calculator)'.
 * Some schemas have slug="aql-sampling-risk-cost" but bundle key="aql-sampling-risk-cost-calculator".
 */
function findBundleEntry(
  bundle: Record<string, LocaleTitleMap>,
  slug: string,
): LocaleTitleMap | undefined {
  const direct = bundle[slug];
  if (direct) return direct;
  // Try slug + "-calculator" for tools whose bundle key has the suffix
  const withSuffix = bundle[`${slug}-calculator`];
  if (withSuffix) return withSuffix;
  return undefined;
}

export function resolveGeneratedToolDisplayTitle(
  slug: string,
  fallbackEn: string,
  locale: string,
): string {
  const normalizedLocale: SupportedLocale = isSupportedLocale(locale) ? locale : "en";
  const entry = findBundleEntry(TITLES, slug);
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
  const entry = findBundleEntry(DESCRIPTIONS, slug);
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
