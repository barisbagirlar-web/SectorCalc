/**
 * Premium schema catalog - public-facing adapter for premium calculator vitrines.
 * No "schema", "pilot", or "migration" language in public labels.
 */

import type { CatalogGroup, CatalogItem, CatalogRelatedPremiumItem } from "@/lib/catalog/catalog-types";
import type { FormulaFamilyId } from "@/lib/features/premium-schema/formula-families";
import type {
  PremiumCalculatorSchema,
  ReportSectionId,
} from "@/lib/features/premium-schema/premium-calculator-schema";
import { getLocalizedPremiumSchema } from "@/data/premium-schema-i18n";
import {
  getPremiumCalculatorSchema,
  PREMIUM_CALCULATOR_SCHEMAS,
  PREMIUM_SCHEMA_SLUG_MAP,
} from "@/lib/features/premium-schema/schema-registry";
import type { IndustryCategory, IndustrySlug } from "@/lib/features/tools/industry-registry";
import { getRevenueToolByPaidSlug } from "@/lib/features/tools/revenue-tools";
import { resolvePremiumToolHref } from "@/lib/features/tools/tool-links";
import type { ClaimReadiness } from "@/lib/features/benchmarks/benchmark-types";
import {
  getPremiumClaimCopy,
  getPremiumClaimTypeLabel,
} from "@/lib/features/premium-schema/premium-claim-copy";
import { addLocaleToPath, isSupportedLocale, type SupportedLocale } from "@/lib/infrastructure/i18n/locale-routing";
import {
  resolveCatalogCtaLabels,
  resolvePremiumCatalogGroupDescription,
  resolvePremiumCatalogGroupLabel,
} from "@/lib/infrastructure/i18n/catalog-labels-i18n";

export type PremiumSchemaCatalogBadge =
  | "Decision report"
  | "Hidden-loss diagnostic"
  | "Premium analyzer";

export interface PremiumSchemaCatalogItem {
  readonly slug: string;
  readonly href: string;
  readonly title: string;
  readonly sectorSlug: string;
  readonly category: string;
  readonly painStatement: string;
  readonly promise: string;
  readonly primaryOutputLabel: string;
  readonly reportSections: readonly string[];
  readonly priceHint: string;
  readonly badge: PremiumSchemaCatalogBadge;
}

export const PREMIUM_SCHEMA_PRICE_HINT = "From $9/report or Pro access";

const FORBIDDEN_PUBLIC_TERMS = /\b(schema|migration|pilot|debug)\b/i;

const REPORT_SECTION_LABELS: Record<ReportSectionId, string> = {
  executive_summary: "Executive summary",
  loss_breakdown: "Hidden drivers",
  thresholds: "Threshold check",
  sensitivity: "Sensitivity",
  action_plan: "Suggested action",
  assumptions: "Assumptions",
};

export const PREMIUM_SCHEMA_CATALOG_GROUP_ORDER = [
  "measurement_calibration",
  "scrap_waste",
  "oee_productivity",
  "time_delay",
  "route_logistics",
  "cost_margin",
  "energy_carbon",
  "benchmark_health" ] as const;

export type PremiumSchemaCatalogGroupId = (typeof PREMIUM_SCHEMA_CATALOG_GROUP_ORDER)[number];

export const PREMIUM_SCHEMA_CATALOG_GROUP_LABELS: Record<PremiumSchemaCatalogGroupId, string> = {
  measurement_calibration: "Measurement & Calibration",
  scrap_waste: "Scrap & Waste",
  oee_productivity: "OEE & Productivity",
  time_delay: "Time & Delay",
  route_logistics: "Route & Logistics",
  cost_margin: "Cost & Margin",
  energy_carbon: "Energy & Carbon",
  benchmark_health: "Benchmark & Health",
};

export const PREMIUM_SCHEMA_CATALOG_GROUP_DESCRIPTIONS: Record<
  PremiumSchemaCatalogGroupId,
  string
> = {
  measurement_calibration:
    "Tolerance drift, calibration pressure and measurement accuracy before loss compounds.",
  scrap_waste: "Scrap, rework and material waste that erode quoted margin.",
  oee_productivity: "OEE, setup loss and shop-floor productivity drivers.",
  time_delay: "Delay, rework hours and schedule slip on jobs and projects.",
  route_logistics: "Route loss, fuel drift and freight margin exposure.",
  cost_margin: "Cost stacks, margin pressure and safe pricing decisions.",
  energy_carbon: "Peak load, utility cost and carbon compliance exposure.",
  benchmark_health: "Benchmark variance, inventory pressure and health signals.",
};

const CATEGORY_TO_CATALOG_GROUP: Record<FormulaFamilyId, PremiumSchemaCatalogGroupId> = {
  measurement: "measurement_calibration",
  calibration: "measurement_calibration",
  scrap: "scrap_waste",
  oee: "oee_productivity",
  time: "time_delay",
  route: "route_logistics",
  cost: "cost_margin",
  energy: "energy_carbon",
  carbon: "energy_carbon",
  benchmark: "benchmark_health",
  finance: "cost_margin",
  fluid: "measurement_calibration",
  lean: "oee_productivity",
  industrial: "oee_productivity",
};

const SCHEMA_SECTOR_TO_INDUSTRY_CATEGORY: Record<string, IndustryCategory> = {
  "cnc-manufacturing": "heavy-industry",
  manufacturing: "heavy-industry",
  "sheet-metal": "heavy-industry",
  textile: "custom-manufacturing",
  "measurement-calibration": "heavy-industry",
  construction: "building-trades",
  roofing: "building-trades",
  painting: "building-trades",
  plumbing: "building-trades",
  hvac: "building-trades",
  electrical: "building-trades",
  "printing-signage": "custom-manufacturing",
  "auto-repair": "field-services",
  warehouse: "field-services",
  "logistics-transport": "logistics-transport",
  restaurant: "food-retail",
  "food-retail": "food-retail",
  retail: "food-retail",
  "it-cloud": "food-retail",
  "agriculture-crops": "agriculture-livestock",
  dairy: "agriculture-livestock",
  "energy-consumption": "energy-environment",
  "energy-carbon": "energy-environment",
  "legal-tax": "daily-life",
};

const INDUSTRY_SLUG_ANALYZERS: Partial<Record<IndustrySlug, readonly string[]>> = {
  "cnc-manufacturing": ["cnc-oee-loss", "cnc-tool-wear-cost", "sheet-metal-scrap-risk" ],
  "sheet-metal": ["sheet-metal-scrap-risk", "cnc-tool-wear-cost" ],
  "welding-fabrication": ["cnc-tool-wear-cost" ],
  "3d-printing-service": [ ],
  construction: [
    "construction-project-overrun",
    "construction-subcontractor-margin-leak",
    "roofing-weather-delay-risk",
    "painting-rework-coverage-risk" ],
  roofing: ["roofing-weather-delay-risk", "construction-subcontractor-margin-leak"],
  painting: ["painting-rework-coverage-risk"],
  "electrical-contracting": ["electrical-panel-rework-cost"],
  hvac: ["hvac-callback-margin-risk"],
  plumbing: ["plumbing-leak-callback-cost"],
  "auto-repair-shop": ["auto-repair-comeback-cost" ],
  "printing-signage": ["printing-reprint-margin-leak"],
  "carpentry-millwork": ["textile-fabric-waste-risk"],
  "landscaping-lawn-care": ["roofing-weather-delay-risk"],
  cleaning: ["warehouse-space-cost-leak"],
  "logistics-transport": ["logistics-route-loss", "logistics-fuel-route-drift" ],
  restaurant: ["restaurant-menu-margin-leak", "food-waste-margin-loss"],
  "daily-meals": ["food-waste-margin-loss"],
  ecommerce: ["ai-token-cost-analyzer", "cloud-api-cost-overrun", "retail-inventory-turnover-risk", "cloud-api-overrun-analyzer", "cloud-waste-elimination-analyzer"],
  "agriculture-crops": ["agriculture-irrigation-yield-loss"],
  "agriculture-irrigation": ["agriculture-irrigation-yield-loss"],
  "agriculture-feed": ["dairy-feed-efficiency-loss"],
  "agriculture-dairy": ["dairy-feed-efficiency-loss"],
  "energy-consumption": ["energy-peak-cost", "energy-compressor-leak-cost" ],
  "energy-carbon": ["energy-peak-cost", "carbon-footprint-compliance-risk", "energy-compressor-leak-cost", "cbam-exposure-analyzer" ],
  "daily-renovation": ["legal-interest-fee-calculator-pro"],
  "daily-fuel": ["logistics-fuel-route-drift"],
};

export const DEFAULT_PREMIUM_SCHEMA_CATALOG_GROUP: PremiumSchemaCatalogGroupId = "cost_margin";

function buildPremiumSchemaHref(slug: string, locale: string): string {
  const trimmed = locale.trim();
  const normalizedLocale: SupportedLocale = isSupportedLocale(trimmed) ? trimmed : "en";
  return addLocaleToPath(`/tools/premium-schema/${slug}`, normalizedLocale);
}

function deriveBadge(schema: PremiumCalculatorSchema): PremiumSchemaCatalogBadge {
  if (schema.category === "calibration" || schema.category === "measurement") {
    return "Hidden-loss diagnostic";
  }
  if (schema.category === "benchmark") {
    return "Premium analyzer";
  }
  return "Decision report";
}

function derivePromise(schema: PremiumCalculatorSchema): string {
  const title = schema.reportTemplate.title.trim();
  if (title.length > 0) {
    return `${title} with threshold alerts, hidden drivers and export-ready output.`;
  }
  return `Structured hidden-loss analysis for ${schema.name}.`;
}

function getPrimaryOutputLabel(schema: PremiumCalculatorSchema): string {
  const bigNumber = schema.outputs.find((output) => output.isBigNumber);
  if (bigNumber) {
    return bigNumber.label;
  }
  return schema.outputs[0]?.label ?? "Primary exposure";
}

function formatReportSections(sections: readonly ReportSectionId[]): readonly string[] {
  return sections.map((section) => REPORT_SECTION_LABELS[section] ?? section);
}

function formatReportSectionsShort(sections: readonly string[]): string {
  return sections.slice(0, 3).join(" · ");
}

function schemaToCatalogItem(schema: PremiumCalculatorSchema, locale: string): PremiumSchemaCatalogItem {
  const reportSections = formatReportSections(schema.reportTemplate.sections);
  const localized = getLocalizedPremiumSchema(schema.id, locale);

  return {
    slug: schema.id,
    href: buildPremiumSchemaHref(schema.id, locale),
    title: localized?.title ?? schema.name,
    sectorSlug: schema.sectorSlug,
    category: schema.category,
    painStatement: localized?.painStatement ?? schema.painStatement,
    promise: derivePromise(schema),
    primaryOutputLabel: getPrimaryOutputLabel(schema),
    reportSections,
    priceHint: PREMIUM_SCHEMA_PRICE_HINT,
    badge: deriveBadge(schema),
  };
}

export function catalogItemFromPremiumSchema(
  item: PremiumSchemaCatalogItem,
  readiness: ClaimReadiness = "sample_only",
  locale = "en"
): CatalogItem {
  const claim = getPremiumClaimCopy(item.slug, readiness);
  const ctaLabels = resolveCatalogCtaLabels(locale);

  const schema = getPremiumCalculatorSchema(item.slug);

  return {
    title: item.title,
    description: item.painStatement,
    href: item.href.replace(/^\/[a-z]{2}\//, "/"),
    meta: item.primaryOutputLabel,
    badge: ctaLabels.premiumBadge,
    ctaLabel: ctaLabels.viewCalculator,
    itemKind: "premium-analyzer",
    inputCount: schema?.inputs.length,
    promise: claim.valueStatement,
    claimHeadline: claim.headline,
    upgradeReason: claim.upgradeReason,
    claimTypeLabel: getPremiumClaimTypeLabel(claim.claimType),
    reportSections: item.reportSections,
    priceHint: item.priceHint,
    primaryOutputLabel: item.primaryOutputLabel,
  };
}

export function getPremiumSchemaCatalogItems(locale = "en"): PremiumSchemaCatalogItem[] {
  return PREMIUM_CALCULATOR_SCHEMAS.map((schema) => schemaToCatalogItem(schema, locale));
}

export function getPremiumSchemaCatalogItemBySlug(
  slug: string,
  locale = "en"
): PremiumSchemaCatalogItem | null {
  const schema = getPremiumCalculatorSchema(slug);
  if (!schema) {
    return null;
  }
  return schemaToCatalogItem(schema, locale);
}

export function getPremiumSchemasBySector(
  sectorSlug: string,
  locale = "en"
): PremiumSchemaCatalogItem[] {
  return getPremiumSchemaCatalogItems(locale).filter((item) => item.sectorSlug === sectorSlug);
}

export function getPremiumSchemasByCategory(
  category: string,
  locale = "en"
): PremiumSchemaCatalogItem[] {
  return getPremiumSchemaCatalogItems(locale).filter((item) => item.category === category);
}

export function getPremiumSchemasForIndustrySlug(
  industrySlug: IndustrySlug,
  locale = "en",
  maxItems = 3
): PremiumSchemaCatalogItem[] {
  const explicit = INDUSTRY_SLUG_ANALYZERS[industrySlug] ?? [];
  const bySlug = new Map<string, PremiumSchemaCatalogItem>();

  for (const slug of explicit) {
    const item = getPremiumSchemaCatalogItemBySlug(slug, locale);
    if (item) {
      bySlug.set(item.slug, item);
    }
  }

  for (const item of getPremiumSchemaCatalogItems(locale)) {
    if (item.sectorSlug === industrySlug && !bySlug.has(item.slug)) {
      bySlug.set(item.slug, item);
    }
  }

  return Array.from(bySlug.values()).slice(0, maxItems);
}

export function getIndustryRelatedPremiumItems(
  industrySlug: IndustrySlug,
  locale = "en",
  maxItems = 3
): readonly CatalogRelatedPremiumItem[] {
  return getPremiumSchemasForIndustrySlug(industrySlug, locale, maxItems).map((item) => ({
    title: item.title,
    href: item.href.replace(/^\/[a-z]{2}\//, "/"),
    description: item.promise,
  }));
}

export function buildPremiumSchemaCatalogGroups(locale = "en"): CatalogGroup[] {
  const items = getPremiumSchemaCatalogItems(locale);
  const byGroup = new Map<PremiumSchemaCatalogGroupId, CatalogItem[]>();

  for (const groupId of PREMIUM_SCHEMA_CATALOG_GROUP_ORDER) {
    byGroup.set(groupId, []);
  }

  for (const item of items) {
    const schema = getPremiumCalculatorSchema(item.slug);
    if (!schema) {
      continue;
    }
    const groupId = CATEGORY_TO_CATALOG_GROUP[schema.category];
    const list = byGroup.get(groupId);
    if (list) {
      list.push({
        ...catalogItemFromPremiumSchema(item, "sample_only", locale),
        meta: `${item.primaryOutputLabel} · ${formatReportSectionsShort(item.reportSections)}`,
      });
    }
  }

  return PREMIUM_SCHEMA_CATALOG_GROUP_ORDER.map((groupId) => ({
    id: groupId,
    label: resolvePremiumCatalogGroupLabel(groupId, locale),
    description: resolvePremiumCatalogGroupDescription(groupId, locale),
    items: byGroup.get(groupId) ?? [],
  })).filter((group) => group.items.length > 0);
}

export function getPremiumSchemasForIndustryCategory(
  category: IndustryCategory,
  locale = "en",
  maxPerGroup = 4
): PremiumSchemaCatalogItem[] {
  const items = getPremiumSchemaCatalogItems(locale).filter((item) => {
    const mapped = SCHEMA_SECTOR_TO_INDUSTRY_CATEGORY[item.sectorSlug];
    return mapped === category;
  });

  return items.slice(0, maxPerGroup);
}

export function buildCategoryPageCatalogGroups(
  freeGroups: readonly CatalogGroup[],
  locale = "en"
): CatalogGroup[] {
  return freeGroups.map((group) => {
    const premiumItems = getPremiumSchemasForIndustryCategory(
      group.id as IndustryCategory,
      locale,
      4
    ).map((item) => catalogItemFromPremiumSchema(item, "sample_only", locale));

    return {
      ...group,
      items: [
        ...group.items.map((item) => ({ ...item, itemKind: "free-calculator" as const })),
        ...premiumItems ],
    };
  });
}

export function resolvePremiumAnalyzerHref(legacyOrSchemaSlug: string): string {
  const trimmed = legacyOrSchemaSlug.trim();
  if (!trimmed) {
    return "/free-tools";
  }

  const mappedSchemaId = PREMIUM_SCHEMA_SLUG_MAP[trimmed];
  if (mappedSchemaId && getPremiumCalculatorSchema(mappedSchemaId)) {
    return `/tools/premium-schema/${mappedSchemaId}`;
  }

  const schemaFromRegistry = getPremiumCalculatorSchema(trimmed);
  if (schemaFromRegistry) {
    return `/tools/premium-schema/${schemaFromRegistry.id}`;
  }

  if (getRevenueToolByPaidSlug(trimmed)) {
    return resolvePremiumToolHref(trimmed);
  }

  return "/free-tools";
}

export function containsForbiddenPublicCatalogTerm(value: string): boolean {
  return FORBIDDEN_PUBLIC_TERMS.test(value);
}

export function assertPublicCatalogCopySafe(item: PremiumSchemaCatalogItem): boolean {
  const fields = [
    item.title,
    item.painStatement,
    item.promise,
    item.primaryOutputLabel,
    item.priceHint,
    item.badge,
    ...item.reportSections ];
  return fields.every((field) => !containsForbiddenPublicCatalogTerm(field));
}
