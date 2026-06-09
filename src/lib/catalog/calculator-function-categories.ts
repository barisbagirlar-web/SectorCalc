/**
 * Function / measurement type index for /categories — not sector taxonomy.
 */

import type { CatalogGroup, CatalogItem } from "@/lib/catalog/catalog-types";
import {
  catalogItemFromPremiumSchema,
  getPremiumSchemaCatalogItemBySlug,
} from "@/lib/premium-schema/premium-schema-catalog";
import { getPremiumCalculatorSchema, getPremiumSchemaForPaidSlug } from "@/lib/premium-schema/schema-registry";
import { getFreeTrafficToolBySlug } from "@/lib/tools/free-traffic-catalog";
import { getToolHref } from "@/lib/tools/paths";
import { getRevenueToolByFreeSlug } from "@/lib/tools/revenue-tools";

export const FUNCTION_CATEGORY_ORDER = [
  "oee-productivity",
  "scrap-waste",
  "cost-margin",
  "routing-logistics",
  "energy-carbon",
  "measurement-units",
  "finance-business",
  "construction-field",
  "daily-practical",
] as const;

export type FunctionCategoryId = (typeof FUNCTION_CATEGORY_ORDER)[number];

export const DEFAULT_FUNCTION_CATEGORY_ID: FunctionCategoryId = "oee-productivity";

/** Featured slugs per function group — free traffic, revenue free, schema id, or paid slug. */
export const FUNCTION_CATEGORY_TOOL_REFS: Record<FunctionCategoryId, readonly string[]> = {
  "oee-productivity": [
    "oee-calculator",
    "machine-time-calculator",
    "cnc-cycle-time-calculator",
    "machine-hour-rate-calculator",
    "auto-shop-margin-leak-detector",
    "cnc-oee-loss",
  ],
  "scrap-waste": [
    "scrap-rate-calculator",
    "material-waste-calculator",
    "sheet-metal-scrap-risk",
    "food-waste-margin-loss",
    "textile-fabric-waste-risk",
    "batch-yield-calculator",
  ],
  "cost-margin": [
    "profit-margin-calculator",
    "product-margin-calculator",
    "break-even-calculator",
    "unit-cost-calculator",
    "recipe-cost-check",
    "menu-profit-leak-detector",
    "food-cost-calculator",
  ],
  "routing-logistics": [
    "route-cost-calculator",
    "fuel-cost-calculator",
    "fuel-consumption-calculator",
    "desi-calculator",
    "volumetric-weight-calculator",
    "logistics-route-loss",
    "delivery-cost-calculator",
  ],
  "energy-carbon": [
    "electricity-bill-calculator",
    "kwh-cost-calculator",
    "carbon-footprint-quick",
    "cbam-compliance-verdict",
    "energy-peak-cost",
    "compressor-energy-cost-calculator",
    "carbon-footprint-compliance-risk",
  ],
  "measurement-units": [
    "length-converter",
    "square-meter-calculator",
    "tolerance-drift-calculator",
    "calibration-drift-risk",
    "z-score-calculator",
    "area-converter",
    "volume-converter",
  ],
  "finance-business": [
    "loan-payment-calculator",
    "interest-calculator",
    "compound-interest-calculator",
    "vat-calculator",
    "cash-flow-gap-calculator",
    "salary-cost-calculator",
    "mortgage-calculator",
  ],
  "construction-field": [
    "concrete-volume-calculator",
    "roofing-area-calculator",
    "paint-coverage-calculator",
    "tile-calculator",
    "drywall-calculator",
    "project-cost-calculator",
    "construction-project-overrun",
  ],
  "daily-practical": [
    "age-calculator",
    "date-difference-calculator",
    "tip-calculator",
    "shopping-budget-calculator",
    "home-budget-calculator",
    "fuel-travel-calculator",
    "percentage-calculator",
  ],
};

function resolveFreeTrafficItem(slug: string): CatalogItem | null {
  const tool = getFreeTrafficToolBySlug(slug);
  if (!tool) {
    return null;
  }

  return {
    title: tool.title,
    description: tool.description,
    href: getToolHref("free", tool.slug),
    itemKind: "free-calculator",
    meta: tool.relatedPremiumSlug ? "Premium analyzer available" : undefined,
    ctaLabel: "Open calculator →",
  };
}

function resolveRevenueFreeItem(slug: string): CatalogItem | null {
  const tool = getRevenueToolByFreeSlug(slug);
  if (!tool) {
    return null;
  }

  return {
    title: tool.freeTitle,
    description: tool.freeValue,
    href: getToolHref("free", tool.freeSlug),
    itemKind: "free-calculator",
    meta: tool.sector,
    ctaLabel: "Open calculator →",
  };
}

function resolvePremiumItem(ref: string, locale: string): CatalogItem | null {
  const bySchemaId = getPremiumSchemaCatalogItemBySlug(ref, locale);
  if (bySchemaId) {
    return catalogItemFromPremiumSchema(bySchemaId);
  }

  const schema = getPremiumCalculatorSchema(ref);
  if (schema) {
    const item = getPremiumSchemaCatalogItemBySlug(schema.id, locale);
    return item ? catalogItemFromPremiumSchema(item) : null;
  }

  const fromPaid = getPremiumSchemaForPaidSlug(ref);
  if (fromPaid) {
    const item = getPremiumSchemaCatalogItemBySlug(fromPaid.id, locale);
    return item ? catalogItemFromPremiumSchema(item) : null;
  }

  return null;
}

export function resolveFunctionCategoryToolRef(ref: string, locale = "en"): CatalogItem | null {
  return (
    resolveFreeTrafficItem(ref) ??
    resolveRevenueFreeItem(ref) ??
    resolvePremiumItem(ref, locale)
  );
}

export type BuildCalculatorFunctionGroupsOptions = {
  readonly locale?: string;
  readonly resolveGroupCopy: (id: FunctionCategoryId) => {
    readonly label: string;
    readonly description: string;
  };
};

export function buildCalculatorFunctionGroups(
  options: BuildCalculatorFunctionGroupsOptions,
): CatalogGroup[] {
  const locale = options.locale ?? "en";
  const seenHrefs = new Set<string>();

  return FUNCTION_CATEGORY_ORDER.map((id) => {
    const items: CatalogItem[] = [];

    for (const ref of FUNCTION_CATEGORY_TOOL_REFS[id]) {
      const item = resolveFunctionCategoryToolRef(ref, locale);
      if (!item || seenHrefs.has(item.href)) {
        continue;
      }
      seenHrefs.add(item.href);
      items.push(item);
    }

    const copy = options.resolveGroupCopy(id);

    return {
      id,
      label: copy.label,
      description: copy.description,
      items,
    };
  }).filter((group) => group.items.length > 0);
}
