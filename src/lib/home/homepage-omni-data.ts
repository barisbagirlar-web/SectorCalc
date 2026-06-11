import type { CatalogGroup } from "@/lib/catalog/catalog-types";
import {
  countItemsForDiscoveryTab,
  getDiscoveryTabsForVariant,
} from "@/lib/catalog/discovery-tab-groups";
import { countToolsInCategory } from "@/lib/tools/free-traffic-categories";
import { FREE_TRAFFIC_TOOLS } from "@/lib/tools/free-traffic-catalog";
import { getPremiumCalculatorSchema, PREMIUM_CALCULATOR_SCHEMAS } from "@/lib/premium-schema/schema-registry";
import { resolveFreeToolLocalizedCopy } from "@/lib/i18n/free-tool-i18n";
import { getLocalizedPremiumSchema } from "@/data/premium-schema-i18n";

export const HOMEPAGE_CATEGORY_IDS = [
  "costMargin",
  "scrapOee",
  "energyCarbon",
  "routingLogistics",
  "constructionField",
  "financeBusiness",
  "dailyPractical",
  "premium",
] as const;

export type HomepageCategoryId = (typeof HOMEPAGE_CATEGORY_IDS)[number];

export const HOMEPAGE_CATEGORY_HREFS: Record<HomepageCategoryId, string> = {
  costMargin: "/free-tools",
  scrapOee: "/free-tools",
  energyCarbon: "/free-tools",
  routingLogistics: "/free-tools",
  constructionField: "/free-tools",
  financeBusiness: "/free-tools",
  dailyPractical: "/free-tools",
  premium: "/premium-tools",
};

const CATEGORY_TAB_MAP: Partial<Record<HomepageCategoryId, string>> = {
  costMargin: "cost-margin",
  scrapOee: "scrap-oee",
  energyCarbon: "energy-carbon",
  routingLogistics: "routing-logistics",
  constructionField: "construction-field",
  dailyPractical: "daily-practical",
};

export const HOMEPAGE_SECTOR_IDS = [
  "manufacturing",
  "logistics",
  "construction",
  "energy",
  "food",
  "textile",
  "automotive",
  "healthcare",
] as const;

export const HOMEPAGE_SECTOR_HREFS: Record<(typeof HOMEPAGE_SECTOR_IDS)[number], string> = {
  manufacturing: "/industries/cnc-manufacturing",
  logistics: "/industries/logistics-transport",
  construction: "/industries/construction",
  energy: "/industries/energy-carbon",
  food: "/industries/restaurant",
  textile: "/industries/welding-fabrication",
  automotive: "/industries/auto-repair-shop",
  healthcare: "/categories",
};

const POPULAR_TOOL_DEFS = [
  { slug: "square-meter-calculator", tier: "free" as const },
  { slug: "loan-payment-calculator", tier: "free" as const },
  { slug: "machine-time-calculator", tier: "free" as const },
  { slug: "paint-coverage-calculator", tier: "free" as const },
  { slug: "concrete-volume-calculator", tier: "free" as const },
  { slug: "food-waste-margin-loss", tier: "premium-schema" as const },
  { slug: "route-cost-calculator", tier: "free" as const },
  { slug: "energy-consumption-check", tier: "free" as const },
] as const;

export type HomepagePopularTool = {
  readonly slug: string;
  readonly title: string;
  readonly href: string;
  readonly tier: "free" | "premium";
};

export function getHomepageToolTotalCount(): number {
  return FREE_TRAFFIC_TOOLS.length + PREMIUM_CALCULATOR_SCHEMAS.length;
}

export function getHomepageCategoryCounts(freeGroups: readonly CatalogGroup[]): Record<HomepageCategoryId, number> {
  const tabs = getDiscoveryTabsForVariant("free-tools", freeGroups);
  const tabCounts = new Map<string, number>();
  for (const tab of tabs) {
    if (tab.id !== "all") {
      tabCounts.set(tab.id, countItemsForDiscoveryTab(freeGroups, tab));
    }
  }

  return {
    costMargin: tabCounts.get("cost-margin") ?? countToolsInCategory(FREE_TRAFFIC_TOOLS, "finance-business"),
    scrapOee: tabCounts.get("scrap-oee") ?? countToolsInCategory(FREE_TRAFFIC_TOOLS, "manufacturing-workshop"),
    energyCarbon: tabCounts.get("energy-carbon") ?? countToolsInCategory(FREE_TRAFFIC_TOOLS, "energy-carbon"),
    routingLogistics: tabCounts.get("routing-logistics") ?? countToolsInCategory(FREE_TRAFFIC_TOOLS, "logistics-travel"),
    constructionField:
      tabCounts.get("construction-field") ?? countToolsInCategory(FREE_TRAFFIC_TOOLS, "construction-measurement"),
    financeBusiness: countToolsInCategory(FREE_TRAFFIC_TOOLS, "finance-business"),
    dailyPractical: tabCounts.get("daily-practical") ?? 0,
    premium: PREMIUM_CALCULATOR_SCHEMAS.length,
  };
}

export function resolveHomepagePopularTools(locale: string): HomepagePopularTool[] {
  const resolved: HomepagePopularTool[] = [];

  for (const def of POPULAR_TOOL_DEFS) {
    if (def.tier === "free") {
      const tool = FREE_TRAFFIC_TOOLS.find((entry) => entry.slug === def.slug);
      if (!tool) {
        continue;
      }
      const copy = resolveFreeToolLocalizedCopy(tool.slug, locale);
      resolved.push({
        slug: tool.slug,
        title: copy.title ?? tool.title,
        href: `/tools/free/${tool.slug}`,
        tier: "free",
      });
      continue;
    }

    const schema = getPremiumCalculatorSchema(def.slug);
    if (!schema) {
      continue;
    }
    const localized = getLocalizedPremiumSchema(def.slug, locale);
    resolved.push({
      slug: def.slug,
      title: localized?.title ?? schema.name,
      href: `/tools/premium-schema/${def.slug}`,
      tier: "premium",
    });
  }

  return resolved;
}

export function getHomepageCategoryTabId(categoryId: HomepageCategoryId): string | null {
  return CATEGORY_TAB_MAP[categoryId] ?? null;
}
