import type { Tool } from "@/data/tools";
import { getIndustryBySlug, type IndustrySlug } from "@/data/industries";
import {
  getAllIndustryCategories,
  getIndustriesByCategory,
  INDUSTRY_CATEGORY_LABELS,
  type IndustryCategory,
} from "@/lib/tools/industry-registry";
import {
  PREMIUM_REPORT_FAMILY_LABELS,
  type PremiumReportFamily,
} from "@/lib/premium/premium-architecture";
import { getPremiumArchitectureProfile } from "@/lib/premium/sector-loss-registry";
import { getRevenueToolBySector } from "@/lib/tools/revenue-tools";
import { getToolHref } from "@/lib/tools/paths";
import {
  DEFAULT_FREE_TRAFFIC_CATEGORY,
  getOrderedFreeTrafficCategories,
  type FreeTrafficCategoryMeta,
} from "@/lib/tools/free-traffic-categories";
import type { FreeTrafficTool } from "@/lib/tools/free-traffic-catalog";
import { resolveFreeToolLocalizedCopy } from "@/lib/i18n/free-tool-i18n";
import type { CatalogGroup, CatalogItem } from "@/lib/catalog/catalog-types";
import {
  getIndustryRelatedPremiumItems,
  getPremiumSchemasForIndustrySlug,
} from "@/lib/premium-schema/premium-schema-catalog";
import { getLocalizedIndustryHub } from "@/data/industry-hub-i18n";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";
import {
  resolveCatalogCtaLabels,
  resolveIndustryCategoryDescription,
  resolveIndustryCategoryLabel,
} from "@/lib/i18n/catalog-labels-i18n";

export const INDUSTRY_CATEGORY_DESCRIPTIONS: Record<IndustryCategory, string> = {
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

const PREMIUM_CATALOG_ORDER: readonly PremiumReportFamily[] = [
  "measurement_calibration",
  "loss_detection",
  "productivity_oee",
  "route_optimization",
  "cost_margin",
  "energy_carbon",
  "benchmark_financial_health",
] as const;

export const PREMIUM_CATALOG_DESCRIPTIONS: Record<PremiumReportFamily, string> = {
  measurement_calibration:
    "Tolerance, calibration drift and measurement accuracy before loss compounds.",
  loss_detection:
    "Hidden scrap, rework and exposure that erode quoted margin.",
  productivity_oee:
    "Setup, cycle time, capacity and OEE drivers on the shop floor.",
  route_optimization:
    "Route time, crew load and resource allocation across jobs.",
  cost_margin:
    "Sector cost stacks, buffers and safe price floors.",
  energy_carbon:
    "Peak demand, carbon exposure and utility efficiency.",
  benchmark_financial_health:
    "Health scores, benchmarks and go/no-go decision signals.",
};

export const PREMIUM_CATALOG_SHORT_LABELS: Record<PremiumReportFamily, string> = {
  measurement_calibration: "Measurement & Calibration",
  loss_detection: "Loss Detection",
  productivity_oee: "OEE & Productivity",
  route_optimization: "Route & Resource",
  cost_margin: "Cost & Margin",
  energy_carbon: "Energy & Carbon",
  benchmark_financial_health: "Benchmark & Health",
};

export const DEFAULT_PREMIUM_REPORT_FAMILY: PremiumReportFamily = "loss_detection";

export const FEATURED_PREMIUM_SLUGS: readonly string[] = [
  "cnc-quote-risk-analyzer",
  "sheet-metal-quote-risk-tool",
  "route-optimization-analyzer",
  "change-order-impact-analyzer",
  "energy-efficiency-report",
  "menu-profit-leak-detector",
  "office-cleaning-bid-optimizer",
  "crop-yield-loss-analyzer",
] as const;

function toolToCatalogItem(tool: Tool, catalogVariant: "default" | "premium") {
  const industry = getIndustryBySlug(tool.industrySlug as IndustrySlug);
  const architecture =
    catalogVariant === "premium" ? getPremiumArchitectureProfile(tool.slug) : null;

  const ctaLabel =
    catalogVariant === "premium" ? "View calculator →" : "Open calculator →";

  return {
    title: architecture?.reclassifiedTitle ?? tool.name,
    description: architecture?.reclassifiedPromise ?? tool.shortDescription,
    href: tool.href,
    meta: architecture?.whatIsMeasured ?? industry?.name,
    badge: architecture ? PREMIUM_CATALOG_SHORT_LABELS[architecture.reportFamily] : industry?.name,
    ctaLabel,
  };
}

export function buildSectorToolCatalogGroups(
  tools: readonly Tool[],
  catalogVariant: "default" | "premium" = "default"
): CatalogGroup[] {
  return getAllIndustryCategories()
    .map((category) => ({
      id: category,
      label: INDUSTRY_CATEGORY_LABELS[category],
      description: INDUSTRY_CATEGORY_DESCRIPTIONS[category],
      items: tools
        .filter((tool) => {
          const industry = getIndustryBySlug(tool.industrySlug as IndustrySlug);
          return industry?.category === category;
        })
        .map((tool) => toolToCatalogItem(tool, catalogVariant)),
    }))
    .filter((group) => group.items.length > 0);
}

export function buildPremiumToolCatalogGroups(tools: readonly Tool[]): CatalogGroup[] {
  const byFamily = new Map<PremiumReportFamily, CatalogItem[]>();

  for (const family of PREMIUM_CATALOG_ORDER) {
    byFamily.set(family, []);
  }

  for (const tool of tools) {
    const architecture = getPremiumArchitectureProfile(tool.slug);
    const family = architecture?.reportFamily ?? "loss_detection";
    const list = byFamily.get(family);
    if (list) {
      list.push(toolToCatalogItem(tool, "premium"));
    }
  }

  return PREMIUM_CATALOG_ORDER.map((family) => ({
    id: family,
    label: PREMIUM_CATALOG_SHORT_LABELS[family],
    description:
      PREMIUM_CATALOG_DESCRIPTIONS[family] ??
      PREMIUM_REPORT_FAMILY_LABELS[family],
    items: byFamily.get(family) ?? [],
  })).filter((group) => group.items.length > 0);
}

export function buildIndustryCatalogGroups(locale = "en"): CatalogGroup[] {
  const ctaLabels = resolveCatalogCtaLabels(locale);

  return getAllIndustryCategories()
    .map((category) => {
      const entries = getIndustriesByCategory(category);
      const items = entries
        .map((entry) => {
          const industry = getIndustryBySlug(entry.slug);
          const tool = getRevenueToolBySector(entry.slug);
          if (!industry || !tool) {
            return null;
          }
          const hubCopy = getLocalizedIndustryHub(entry.slug, locale);
          const freeTitle = getLocalizedRevenueToolTitle(
            tool.freeSlug,
            "free",
            locale,
            tool.freeTitle
          );
          const paidTitle = getLocalizedRevenueToolTitle(
            tool.paidSlug,
            "paid",
            locale,
            tool.paidTitle
          );
          const relatedPremium = getIndustryRelatedPremiumItems(entry.slug, locale, 3);
          const premiumToolCount = getPremiumSchemasForIndustrySlug(entry.slug, locale, 50).length;
          return {
            title: hubCopy?.eyebrow ?? industry.name,
            description:
              hubCopy?.painStatement ??
              industry.shortDescription ??
              industry.businessPain,
            href: `/industries/${industry.slug}`,
            meta: `${freeTitle} · ${paidTitle}`,
            ctaLabel: ctaLabels.openIndustry,
            freeToolCount: 1,
            premiumToolCount,
            relatedPremium: relatedPremium.length > 0 ? relatedPremium : undefined,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      return {
        id: category,
        label: resolveIndustryCategoryLabel(category, locale),
        description: resolveIndustryCategoryDescription(category, locale),
        items,
      };
    })
    .filter((group) => group.items.length > 0);
}

export function resolveDefaultGroupId(groups: readonly CatalogGroup[]): string | undefined {
  return groups[0]?.id;
}

export { DEFAULT_FREE_TRAFFIC_CATEGORY };

function resolveFreeTrafficToolCardCopy(
  tool: FreeTrafficTool,
  locale: string
): Pick<CatalogItem, "title" | "description"> {
  const localizedCopy = resolveFreeToolLocalizedCopy(tool.slug, locale);
  return {
    title: localizedCopy.title ?? tool.title,
    description: localizedCopy.description ?? tool.description,
  };
}

export function buildFreeTrafficCatalogGroups(
  tools: readonly FreeTrafficTool[],
  locale: string,
  resolveCategoryCopy: (
    meta: FreeTrafficCategoryMeta
  ) => { label: string; description: string },
  premiumNote: string,
  openCalculatorLabel: string
): CatalogGroup[] {
  return getOrderedFreeTrafficCategories()
    .map((meta) => ({
      id: meta.id,
      label: resolveCategoryCopy(meta).label,
      description: resolveCategoryCopy(meta).description,
      items: tools
        .filter((tool) => tool.category === meta.id)
        .map((tool) => ({
          ...resolveFreeTrafficToolCardCopy(tool, locale),
          href: getToolHref("free", tool.slug),
          meta: tool.relatedPremiumSlug ? premiumNote : undefined,
          ctaLabel: openCalculatorLabel,
          itemKind: "free-calculator" as const,
        })),
    }))
    .filter((group) => group.items.length > 0);
}
