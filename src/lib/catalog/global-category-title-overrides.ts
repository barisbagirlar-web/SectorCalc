import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import type { GlobalToolCategorySlug } from "@/lib/catalog/global-tool-category-taxonomy";

/** Per-locale overrides for premium-152 global category titles (de, fr, es, ar). */
export const GLOBAL_CATEGORY_TITLE_OVERRIDES: Readonly<
  Partial<Record<GlobalToolCategorySlug, Partial<Record<SupportedLocale, string>>>>
> = {
  "lean-production": {
  },
  "quality-six-sigma": {
  },
  "process-chemical": {
  },
  "cnc-additive-manufacturing": {
  },
  "metal-plastics-forming": {
  },
  "project-construction-management": {
  },
  "digital-factory-automation": {
  },
  "maintenance-reliability": {
  },
  "hse-ergonomics": {
  },
  "procurement-supply-chain": {
  },
  "workforce-hr": {
  },
  "finance-sales-working-capital": {
  },
  "sustainability-resource-esg": {
  },
  "food-cold-chain-hygiene": {
  },
  "textile-print-lab": {
  },
  "electrical-power-systems": {
  },
  "mechanical-hvac-energy-loss": {
  },
  "packaging-local-business": {
  },
  "global-compliance-trade": {
  },
  "technology-ai-cloud-cyber": {
  },
};

export function resolveGlobalCategoryTitleForLocale(
  slug: GlobalToolCategorySlug,
  locale: string,
  trTitle: string,
  enTitle: string,
): string {
  const overrides = GLOBAL_CATEGORY_TITLE_OVERRIDES[slug];
  const localized = overrides?.[locale as SupportedLocale];
  if (localized) {
    return localized;
  }
  if (locale === "tr") {
    return trTitle;
  }
  return enTitle;
}
