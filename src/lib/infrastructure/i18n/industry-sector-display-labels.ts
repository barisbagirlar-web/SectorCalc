import type { IndustrySlug } from "@/lib/features/tools/industry-registry";
import { industryRegistry } from "@/lib/features/tools/industry-registry";
import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";

type LocaleLabelMap = Readonly<Record<SupportedLocale, string>>;

function buildEnglishIndustryLabels(): Record<IndustrySlug, string> {
  const labels = {} as Record<IndustrySlug, string>;
  for (const entry of industryRegistry) {
    labels[entry.slug] = entry.name;
  }
  return labels;
}

const EN_INDUSTRY_LABELS = buildEnglishIndustryLabels();

/** Localized display names for all 27 industry sector slugs (6 locales). */
export const INDUSTRY_SECTOR_DISPLAY_LABELS: Readonly<
  Record<IndustrySlug, LocaleLabelMap>
> = {
  "cnc-manufacturing": {
    en: EN_INDUSTRY_LABELS["cnc-manufacturing"],
  },
  construction: {
    en: EN_INDUSTRY_LABELS.construction,
  },
  cleaning: {
    en: EN_INDUSTRY_LABELS.cleaning,
  },
  restaurant: {
    en: EN_INDUSTRY_LABELS.restaurant,
  },
  ecommerce: {
    en: EN_INDUSTRY_LABELS.ecommerce,
  },
  "welding-fabrication": {
    en: EN_INDUSTRY_LABELS["welding-fabrication"],
  },
  hvac: {
    en: EN_INDUSTRY_LABELS.hvac,
  },
  "electrical-contracting": {
    en: EN_INDUSTRY_LABELS["electrical-contracting"],
  },
  "landscaping-lawn-care": {
    en: EN_INDUSTRY_LABELS["landscaping-lawn-care"],
  },
  "auto-repair-shop": {
    en: EN_INDUSTRY_LABELS["auto-repair-shop"],
  },
  "printing-signage": {
    en: EN_INDUSTRY_LABELS["printing-signage"],
  },
  plumbing: {
    en: EN_INDUSTRY_LABELS.plumbing,
  },
  "carpentry-millwork": {
    en: EN_INDUSTRY_LABELS["carpentry-millwork"],
  },
  roofing: {
    en: EN_INDUSTRY_LABELS.roofing,
  },
  painting: {
    en: EN_INDUSTRY_LABELS.painting,
  },
  "sheet-metal": {
    en: EN_INDUSTRY_LABELS["sheet-metal"],
  },
  "3d-printing-service": {
    en: EN_INDUSTRY_LABELS["3d-printing-service"],
  },
  "logistics-transport": {
    en: EN_INDUSTRY_LABELS["logistics-transport"],
  },
  "agriculture-crops": {
    en: EN_INDUSTRY_LABELS["agriculture-crops"],
  },
  "agriculture-irrigation": {
    en: EN_INDUSTRY_LABELS["agriculture-irrigation"],
  },
  "agriculture-feed": {
    en: EN_INDUSTRY_LABELS["agriculture-feed"],
  },
  "agriculture-dairy": {
    en: EN_INDUSTRY_LABELS["agriculture-dairy"],
  },
  "energy-consumption": {
    en: EN_INDUSTRY_LABELS["energy-consumption"],
  },
  "energy-carbon": {
    en: EN_INDUSTRY_LABELS["energy-carbon"],
  },
  "daily-renovation": {
    en: EN_INDUSTRY_LABELS["daily-renovation"],
  },
  "daily-fuel": {
    en: EN_INDUSTRY_LABELS["daily-fuel"],
  },
  "daily-meals": {
    en: EN_INDUSTRY_LABELS["daily-meals"],
  },
};

export function resolveIndustrySectorDisplayLabel(slug: string, locale: string): string | null {
  const labels = INDUSTRY_SECTOR_DISPLAY_LABELS[slug as IndustrySlug];
  if (!labels) {
    return null;
  }
  const normalized = locale.toLowerCase() as SupportedLocale;
  if (SUPPORTED_LOCALES.includes(normalized)) {
    return labels[normalized];
  }
  return labels.en;
}
