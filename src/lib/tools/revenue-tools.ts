/**
 * Revenue registry — legacy 27-sector specs + premium-slugs.json regeneration baseline.
 */

import type { ToolDefinition, ToolResult } from "@/data/tool-schema";
import type { IndustrySlug } from "@/lib/tools/industry-registry";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";
import { getToolHref } from "@/lib/tools/paths";
import { resolveLegacyPremiumSlug } from "@/lib/tools/legacy-premium-slug-redirects";
import { additionalRevenueTools } from "@/lib/tools/revenue-tools-additional";
import { legacyRevenueToolsCore } from "@/lib/tools/legacy-revenue-tools-core";
import { revenueLegalDisclaimer } from "@/lib/tools/revenue-legal-disclaimer";
import premiumSlugs from "../../../premium-slugs.json";

export type RevenueSector = IndustrySlug;
export type RevenueInputType = "number" | "currency" | "percent" | "select";
export type RevenueSelectOption = { readonly value: string; readonly label: string };
export type RevenueToolInput = {
  key: string;
  label: string;
  type: RevenueInputType;
  unit?: string;
  required: boolean;
  defaultValue?: number | string;
  helperText?: string;
  options?: readonly RevenueSelectOption[];
};
export type FreeRevenueToolSlug = string;
export type PremiumRevenueToolSlug = string;

export type RevenueTool = {
  sector: RevenueSector;
  freeSlug: string;
  paidSlug: string;
  freeTitle: string;
  paidTitle: string;
  painStatement: string;
  freeValue: string;
  paidValue: string;
  freeInputs: RevenueToolInput[];
  paidInputs: RevenueToolInput[];
  freeResultPromise: string;
  paidResultPromise: string;
  verdictLabels: string[];
  legalDisclaimer: string;
  seoKeywords: string[];
  formulaGateEligible?: boolean;
  paymentEligible?: boolean;
  freeCalculatorInputIds: readonly string[];
  freeResultIds: readonly string[];
  freeMissingFactors: readonly string[];
  premiumCtaLabel: string;
  premiumTeaserTitle: string;
  premiumTeaserText: string;
};

export type RevenueToolRegistry = {
  legalDisclaimer: string;
  tools: RevenueTool[];
};

export { revenueLegalDisclaimer } from "@/lib/tools/revenue-legal-disclaimer";

export const sectorCalcProPricing = {
  planName: "SectorCalc Pro",
  priceMonthly: 29,
  currency: "USD",
  headline: "Industrial loss & efficiency decision reports.",
  description:
    "Sector-specific loss detection, measurement, OEE, routing, energy and profitability reports — without ERP pricing.",
  bullets: [
    "Loss detection & tolerance reports",
    "Measurement, scrap, OEE and route analysis",
    "Energy, carbon and yield exposure tools",
    "PDF decision reports you can save",
    "Cancel anytime",
    "Digital product, no refunds",
    "Estimates only; verify before business decisions",
  ],
  legalDisclaimer: revenueLegalDisclaimer,
} as const;

export const FREE_TOOL_PRIVACY_NOTE =
  "Free tool inputs are processed in your browser and are not stored unless you create an account or save a premium report.";

export const PAID_TOOL_SAVE_PRIVACY_NOTE =
  "Premium analyzer results may be saved to your account only when you choose to save a report.";

export const REVENUE_LEGAL_DISCLAIMER = revenueLegalDisclaimer;
export const SECTORCALC_PRO = {
  id: "pro" as const,
  planName: sectorCalcProPricing.planName,
  price: sectorCalcProPricing.priceMonthly,
  priceLabel: `$${sectorCalcProPricing.priceMonthly}/month`,
  headline: sectorCalcProPricing.headline,
  description: sectorCalcProPricing.description,
  bullets: sectorCalcProPricing.bullets,
  legalDisclaimer: sectorCalcProPricing.legalDisclaimer,
} as const;

export const SECTORCALC_PRO_PRICE = sectorCalcProPricing.priceMonthly;
export const SECTORCALC_PRO_PRICE_LABEL = `$${sectorCalcProPricing.priceMonthly}/month`;
export const REVENUE_LEGAL_DISCLAIMER_PAID = `${revenueLegalDisclaimer} Digital product. No refunds.`;

export const FREE_PLAN_PRICING = {
  id: "free" as const,
  name: "Free",
  priceLabel: "$0",
  period: "forever",
  description: "Quick sector checks — limited inputs, directional numbers and early risk signals.",
  features: ["Free calculators", "Risk or preview signals", "No account required"],
} as const;

export const SECTORCALC_PRO_PRICING = {
  id: "pro" as const,
  name: sectorCalcProPricing.planName,
  price: sectorCalcProPricing.priceMonthly,
  priceLabel: SECTORCALC_PRO_PRICE_LABEL,
  tagline: sectorCalcProPricing.headline,
  description: sectorCalcProPricing.description,
  features: sectorCalcProPricing.bullets.slice(0, 5),
  freePlanContrast: ["No safe price or accept/reject verdict", "No decision summaries", "No export"],
  laterRelease: sectorCalcProPricing.bullets.slice(5),
} as const;

function humanizeSlug(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildRegeneratedPremiumSlugTool(slug: string): RevenueTool {
  const title = humanizeSlug(slug);
  const pending = "Regeneration pending.";
  return {
    sector: "cnc-manufacturing",
    freeSlug: slug,
    paidSlug: `${slug}-premium`,
    freeTitle: title,
    paidTitle: title,
    painStatement: pending,
    freeValue: pending,
    paidValue: pending,
    freeInputs: [],
    paidInputs: [],
    freeResultPromise: pending,
    paidResultPromise: pending,
    verdictLabels: [],
    legalDisclaimer: revenueLegalDisclaimer,
    seoKeywords: [slug],
    formulaGateEligible: false,
    paymentEligible: false,
    freeCalculatorInputIds: [],
    freeResultIds: [],
    freeMissingFactors: [],
    premiumCtaLabel: "Unlock premium analyzer",
    premiumTeaserTitle: title,
    premiumTeaserText: pending,
  };
}

const LEGACY_REVENUE_TOOLS: RevenueTool[] = [
  ...legacyRevenueToolsCore,
  ...additionalRevenueTools,
];

const LEGACY_PAID_SLUGS = new Set(LEGACY_REVENUE_TOOLS.map((tool) => tool.paidSlug));

const REGENERATED_REVENUE_TOOLS: RevenueTool[] = (premiumSlugs as readonly string[])
  .map(buildRegeneratedPremiumSlugTool)
  .filter((tool) => !LEGACY_PAID_SLUGS.has(tool.freeSlug) && !LEGACY_PAID_SLUGS.has(tool.paidSlug));

export const REVENUE_TOOLS: RevenueTool[] = [
  ...LEGACY_REVENUE_TOOLS,
  ...REGENERATED_REVENUE_TOOLS,
];

export function getRevenueTools(): readonly RevenueTool[] {
  return REVENUE_TOOLS;
}

export const revenueTools = REVENUE_TOOLS;
export const revenueToolRegistry: RevenueToolRegistry = {
  legalDisclaimer: revenueLegalDisclaimer,
  tools: REVENUE_TOOLS,
};
export const REVENUE_TOOL_REGISTRY = revenueToolRegistry;
export const REVENUE_TOOL_PRODUCT_SPECS = REVENUE_TOOLS;
export const REVENUE_TOOL_PAIRS = REVENUE_TOOLS;
export type RevenueToolProductSpec = RevenueTool;
export type RevenueToolPair = RevenueTool;

export const PREMIUM_REVENUE_SLUGS = premiumSlugs as readonly string[];

export function getRevenueToolByFreeSlug(slug: string): RevenueTool | null {
  return REVENUE_TOOLS.find((t) => t.freeSlug === slug) ?? null;
}

export function getRevenueToolByPaidSlug(slug: string): RevenueTool | null {
  return REVENUE_TOOLS.find((tool) => tool.paidSlug === slug) ?? null;
}

export function getRevenueToolByPremiumRouteSlug(slug: string): RevenueTool | null {
  return getRevenueToolByPaidSlug(slug);
}

export function getPremiumRevenueRouteSlugs(): readonly string[] {
  return REVENUE_TOOLS.map((tool) => tool.paidSlug);
}

export function getRevenueToolByPremiumSlug(slug: string): RevenueTool | null {
  return getRevenueToolByPaidSlug(slug);
}

export function getRevenueToolBySector(sector: RevenueSector): RevenueTool | null {
  return REVENUE_TOOLS.find((tool) => tool.sector === sector) ?? null;
}

export function getAllRevenueToolSpecs(): readonly RevenueTool[] {
  return REVENUE_TOOLS;
}

export function getRevenueToolRegistry(): RevenueToolRegistry {
  return revenueToolRegistry;
}

export function isProSubscriptionActive(
  status: string | undefined,
  currentPeriodEnd: string | undefined,
): boolean {
  if (status !== "active" && status !== "trialing") return false;
  if (!currentPeriodEnd) return true;
  const endMs = Date.parse(currentPeriodEnd);
  return Number.isNaN(endMs) ? true : endMs > Date.now();
}

export function applyRevenueToolDisplay(definition: ToolDefinition): ToolDefinition {
  const revenue =
    definition.tier === "free"
      ? getRevenueToolByFreeSlug(definition.slug)
      : getRevenueToolByPremiumSlug(definition.slug);

  if (!revenue) {
    return definition;
  }

  const title = definition.tier === "free" ? revenue.freeTitle : revenue.paidTitle;

  return {
    ...definition,
    title,
    shortDescription: definition.tier === "free" ? revenue.freeValue : revenue.paidValue,
    longDescription: definition.tier === "free" ? revenue.painStatement : revenue.paidValue,
    premiumTeaser:
      definition.tier === "free"
        ? {
            title: revenue.premiumTeaserTitle,
            text: revenue.premiumTeaserText,
            ctaLabel: revenue.premiumCtaLabel,
            ctaHref: getToolHref("premium", revenue.paidSlug),
          }
        : definition.premiumTeaser,
  };
}

export function getVisibleInputs(definition: ToolDefinition) {
  if (definition.tier !== "free") {
    return definition.inputs;
  }

  const revenue = getRevenueToolByFreeSlug(definition.slug);
  if (!revenue) {
    return definition.inputs;
  }

  const allowed = new Set(revenue.freeCalculatorInputIds);
  return definition.inputs.filter((input) => allowed.has(input.id));
}

export function filterFreeResults(definition: ToolDefinition, results: ToolResult[]) {
  if (definition.tier !== "free") {
    return results;
  }

  const revenue = getRevenueToolByFreeSlug(definition.slug);
  if (!revenue) {
    return results;
  }

  const allowed = new Set(revenue.freeResultIds);
  return results.filter((result) => allowed.has(result.id));
}

export function stripPaidOnlyResults(definition: ToolDefinition, results: ToolResult[]): ToolResult[] {
  if (definition.tier !== "free") {
    return results;
  }

  const blocked = /safe|minimum|verdict|leak|bid risk|do not accept/i;
  return results.filter((result) => !blocked.test(result.label));
}
