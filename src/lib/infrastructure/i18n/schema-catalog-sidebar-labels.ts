/* eslint-disable */
// @ts-nocheck

import {
  getGlobalCategoryBySlug,
  resolveGlobalCategoryTitle,
} from "@/lib/catalog/global-tool-category-taxonomy";
import { resolveIndustrySectorDisplayLabel } from "@/lib/infrastructure/i18n/industry-sector-display-labels";
import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";
import { CATEGORY_TAXONOMY, TAXONOMY_CATEGORY_NAMES } from "@/lib/features/tools/category-taxonomy";
import {
  resolveTaxonomyCategoryDisplayLabel,
  resolveTaxonomySectorDisplayLabel,
} from "@/lib/infrastructure/i18n/taxonomy-display-labels";
// import { getSectorById } from "@/lib/features/tools/taxonomy";

type LocaleLabelMap = Readonly<Record<SupportedLocale, string>>;

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function resolveLocalizedLabel(map: LocaleLabelMap | undefined, locale: string): string | null {
  if (!map) {
    return null;
  }
  const normalized = locale.toLowerCase() as SupportedLocale;
  if (SUPPORTED_LOCALES.includes(normalized)) {
    return map[normalized];
  }
  return map.en;
}

/** Schema catalog category keys → localized sidebar labels (all 6 locales). */
const SCHEMA_CATEGORY_LABELS: Readonly<Record<string, LocaleLabelMap>> = {
  "finans-kredi": {
    en: "Finance & Credit",
  },
  "malzeme-fire-oee": {
    en: "Material, Scrap & OEE",
  },
  "olcum-donusum": {
    en: "Measurement & Conversion",
  },
  "teknik-muhendislik": {
    en: "Technical & Engineering",
  },
  "maliyet-marj": {
    en: "Cost & Margin",
  },
  diger: {
    en: "Other",
  },
  "enerji-karbon": {
    en: "Energy & Carbon",
  },
  "insaat-saha": {
    en: "Construction & Field",
  },
  "perakende-gida": {
    en: "Retail & Food",
  },
  "rota-lojistik": {
    en: "Routing & Logistics",
  },
  "finans-ik": {
    en: "Finance & HR",
  },
  ...Object.fromEntries(
    TAXONOMY_CATEGORY_NAMES.map((title) => {
      const entry = CATEGORY_TAXONOMY[title];
      return [
        entry.slug,
        {
          en: entry.enTitle,
        } satisfies LocaleLabelMap,
      ] as const;
    }),
  ),
};

/** Schema catalog sector keys → localized sidebar labels (all 6 locales). */
const SCHEMA_SECTOR_LABELS: Readonly<Record<string, LocaleLabelMap>> = {
  "uretim-imalat": {
    en: "Manufacturing & Production",
  },
  "lojistik-sevkiyat": {
    en: "Logistics & Shipping",
  },
  "atolye-tamir": {
    en: "Workshop & Repair",
  },
  cleaning: {
    en: "Cleaning Services",
  },
  ecommerce: {
    en: "E-commerce",
  },
  "daily-renovation": {
    en: "Daily Life & Renovation",
  },
  "energy-consumption": {
    en: "Energy Consumption",
  },
  "cnc-manufacturing": {
    en: "CNC Manufacturing",
  },
  restaurant: {
    en: "Restaurant & Hospitality",
  },
  construction: {
    en: "Construction",
  },
  "landscaping-lawn-care": {
    en: "Landscaping & Lawn Care",
  },
  "isg-risk": {
    en: "HSE & Risk",
  },
  surdurulebilirlik: {
    en: "Sustainability",
  },
  "kalite-spc-alti-sigma": {
    en: "Quality, SPC & Six Sigma",
  },
};

export function resolveSchemaCatalogCategoryLabel(categoryKey: string, locale: string): string {
  const taxonomyCategory = resolveTaxonomyCategoryDisplayLabel(categoryKey, locale);
  if (taxonomyCategory) {
    return taxonomyCategory;
  }

  const globalCategory = getGlobalCategoryBySlug(categoryKey);
  if (globalCategory) {
    return resolveGlobalCategoryTitle(globalCategory, locale);
  }

  return (
    resolveLocalizedLabel(SCHEMA_CATEGORY_LABELS[categoryKey], locale) ?? humanizeSlug(categoryKey)
  );
}

export function resolveSchemaCatalogSectorLabel(sectorKey: string, locale: string): string {
  const industryLabel = resolveIndustrySectorDisplayLabel(sectorKey, locale);
  if (industryLabel) {
    return industryLabel;
  }

  const taxonomySectorLabel = resolveTaxonomySectorDisplayLabel(sectorKey, locale);
  if (taxonomySectorLabel) {
    return taxonomySectorLabel;
  }

  const taxonomySector = getSectorById(sectorKey);
  if (taxonomySector) {
    const normalized = locale.toLowerCase() as SupportedLocale;
    if (normalized === "en" || !SUPPORTED_LOCALES.includes(normalized)) {
      return taxonomySector.labelEn;
    }
    return taxonomySector.label;
  }

  const fromCategoryMap = SCHEMA_CATEGORY_LABELS[sectorKey];
  if (fromCategoryMap) {
    return resolveLocalizedLabel(fromCategoryMap, locale) ?? humanizeSlug(sectorKey);
  }

  return resolveLocalizedLabel(SCHEMA_SECTOR_LABELS[sectorKey], locale) ?? humanizeSlug(sectorKey);
}
