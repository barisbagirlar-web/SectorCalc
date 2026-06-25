import type { IndustryCategory } from "@/lib/tools/industry-registry";
import { INDUSTRY_CATEGORY_LABELS } from "@/lib/tools/industry-registry";
import type { PremiumSchemaCatalogGroupId } from "@/lib/premium-schema/premium-schema-catalog";
import {
  PREMIUM_SCHEMA_CATALOG_GROUP_DESCRIPTIONS,
  PREMIUM_SCHEMA_CATALOG_GROUP_LABELS,
} from "@/lib/premium-schema/premium-schema-catalog";

const EN_INDUSTRY_CATEGORY_DESCRIPTIONS: Record<IndustryCategory, string> = {
  "heavy-industry":
    "Machine time, scrap, tolerance and shop-floor margin on production work.",
  "building-trades":
    "Quote risk, labor burden and material loss across construction trades.",
  "field-services":
    "Route time, crew utilization and job profitability in the field.",
  "food-retail":
    "Food cost, waste, margin and service-floor efficiency checks.",
  "custom-manufacturing":
    "Prototype, batch and custom job costing before you commit.",
  "logistics-transport":
    "Route loss, fuel exposure and delivery margin on every run.",
  "agriculture-livestock":
    "Crop, feed, irrigation and livestock efficiency on the farm.",
  "energy-environment":
    "Peak load, carbon exposure and utility cost on the floor.",
  "daily-life":
    "Everyday renovation, fuel and household decision checks.",
};

export type CatalogCtaLabels = {
  readonly openIndustry: string;
  readonly viewAnalyzer: string;
  readonly viewCalculator: string;
  readonly openCalculator: string;
  readonly premiumBadge: string;
};

const EN_CATALOG_CTA: CatalogCtaLabels = {
  openIndustry: "Open industry →",
  viewAnalyzer: "View calculator →",
  viewCalculator: "Open calculator →",
  openCalculator: "Open calculator →",
  premiumBadge: "Premium",
};

export function resolveIndustryCategoryLabel(
  category: IndustryCategory,
  _locale?: string
): string {
  return INDUSTRY_CATEGORY_LABELS[category];
}

export function resolveIndustryCategoryDescription(
  category: IndustryCategory,
  _locale?: string
): string {
  return EN_INDUSTRY_CATEGORY_DESCRIPTIONS[category];
}

export function resolvePremiumCatalogGroupLabel(
  groupId: PremiumSchemaCatalogGroupId,
  _locale?: string
): string {
  return PREMIUM_SCHEMA_CATALOG_GROUP_LABELS[groupId];
}

export function resolvePremiumCatalogGroupDescription(
  groupId: PremiumSchemaCatalogGroupId,
  _locale?: string
): string {
  return PREMIUM_SCHEMA_CATALOG_GROUP_DESCRIPTIONS[groupId];
}

export function resolveCatalogCtaLabels(_locale?: string): CatalogCtaLabels {
  return EN_CATALOG_CTA;
}

export function shouldRenderCrawlIndexForLocale(_locale?: string): boolean {
  return true;
}
