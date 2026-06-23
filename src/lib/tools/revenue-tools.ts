/**
 * SectorCalc Revenue Flow v1A — Product Spec Lock
 *
 * Canonical free calculator / paid analyzer registry (27 sectors).
 * See docs/revenue-flow-product-spec.md
 *
 * FREE: SEO + trust + pre-check — no safe price, verdict, or PDF.
 * PAID: Decision analyzers (SectorCalc Pro) — PDF export is a later phase.
 *
 * Live URL slugs are defined per tool (e.g. machine-time-calculator).
 */

import type { ToolDefinition, ToolResult } from "@/data/tool-schema";
import { FULL_LOOP_CONTRACT_ALIAS } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import type { IndustrySlug } from "@/lib/tools/industry-registry";
import { additionalRevenueTools } from "@/lib/tools/revenue-tools-additional";
import { getToolHref } from "@/lib/tools/paths";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RevenueSector = IndustrySlug;

export type RevenueInputType = "number" | "currency" | "percent" | "select";

export type RevenueSelectOption = {
 readonly value: string;
 readonly label: string;
};

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

/** v1B free tool route slugs — /tools/free/[slug] */
export type FreeRevenueToolSlug = string;

/** v1C premium analyzer route slugs — /tools/premium/[slug] */
export type PremiumRevenueToolSlug = string;

export type RevenueTool = {
 sector: RevenueSector;
 freeSlug: FreeRevenueToolSlug;
 paidSlug: PremiumRevenueToolSlug;
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
 /** Bridge: IDs on existing free calculator definitions (v1A runtime) */
 freeCalculatorInputIds: readonly string[];
 /** Bridge: result IDs allowed on free tier (v1A runtime) */
 freeResultIds: readonly string[];
 /** Factors withheld from free tier — drives upgrade panel */
 freeMissingFactors: readonly string[];
 premiumCtaLabel: string;
 premiumTeaserTitle: string;
 premiumTeaserText: string;
};

export type RevenueToolRegistry = {
 legalDisclaimer: string;
 tools: RevenueTool[];
};

export type FreeResultType = "quick_check" | "risk_signal";
export type PaidResultType = "decision_verdict";

// ---------------------------------------------------------------------------
// Shared copy & pricing
// ---------------------------------------------------------------------------

export const revenueLegalDisclaimer =
 "This is a technical simulation and decision-support output. It is not financial, legal or engineering advice. Verify all results before making business decisions.";

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

/** @deprecated Use revenueLegalDisclaimer */
export const REVENUE_LEGAL_DISCLAIMER = revenueLegalDisclaimer;

/** @deprecated Use sectorCalcProPricing */
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

export const REVENUE_LEGAL_DISCLAIMER_PAID =
 `${revenueLegalDisclaimer} Digital product. No refunds.`;

export const FREE_PLAN_PRICING = {
 id: "free" as const,
 name: "Free",
 priceLabel: "$0",
 period: "forever",
 description:
 "Quick sector checks — limited inputs, directional numbers and early risk signals.",
 features: [
 "Seventeen industry quick-check calculators",
 "2–3 inputs per tool",
 "Risk or preview signals",
 "No account required",
 ],
} as const;

/** @deprecated Use sectorCalcProPricing */
export const SECTORCALC_PRO_PRICING = {
 id: "pro" as const,
 name: sectorCalcProPricing.planName,
 price: sectorCalcProPricing.priceMonthly,
 priceLabel: SECTORCALC_PRO_PRICE_LABEL,
 tagline: sectorCalcProPricing.headline,
 description: sectorCalcProPricing.description,
 features: sectorCalcProPricing.bullets.slice(0, 5),
 freePlanContrast: [
 "No safe price or accept/reject verdict",
 "No decision summaries",
 "No export",
 ],
 laterRelease: sectorCalcProPricing.bullets.slice(5),
} as const;

// ---------------------------------------------------------------------------
// Core + extended sector product matrix (27 sectors)
// ---------------------------------------------------------------------------

const revenueToolsCore: RevenueTool[] = [];


export const revenueTools: RevenueTool[] = [
 ...revenueToolsCore,
 ...additionalRevenueTools,
];

export const revenueToolRegistry: RevenueToolRegistry = {
 legalDisclaimer: revenueLegalDisclaimer,
 tools: revenueTools,
};

/** @deprecated Use revenueToolRegistry */
export const REVENUE_TOOL_REGISTRY = revenueToolRegistry;

/** @deprecated Use revenueTools */
export const REVENUE_TOOL_PRODUCT_SPECS = revenueTools;

/** @deprecated Use revenueTools */
export const REVENUE_TOOL_PAIRS = revenueTools;

/** @deprecated Use RevenueTool */
export type RevenueToolProductSpec = RevenueTool;

/** @deprecated Use RevenueTool */
export type RevenueToolPair = RevenueTool;

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function getRevenueToolByFreeSlug(slug: string): RevenueTool | null {
 return revenueTools.find((tool) => tool.freeSlug === slug) ?? null;
}

export function getRevenueToolByPaidSlug(slug: string): RevenueTool | null {
 return revenueTools.find((tool) => tool.paidSlug === slug) ?? null;
}

/** Premium route slug — paidSlug or full-loop funnel alias slug. */
export function getRevenueToolByPremiumRouteSlug(slug: string): RevenueTool | null {
 const byPaid = getRevenueToolByPaidSlug(slug);
 if (byPaid) {
 return byPaid;
 }
 if (slug in FULL_LOOP_CONTRACT_ALIAS) {
 return getRevenueToolByFreeSlug(slug);
 }
 return null;
}

export function getPremiumRevenueRouteSlugs(): readonly string[] {
 const funnelSlugs = Object.keys(FULL_LOOP_CONTRACT_ALIAS);
 return [
 ...new Set([
 ...revenueTools.map((tool) => tool.paidSlug),
 ...funnelSlugs,
 ]),
 ];
}

export function getRevenueToolByPremiumSlug(slug: string): RevenueTool | null {
 return getRevenueToolByPaidSlug(slug);
}

export function getRevenueToolBySector(sector: RevenueSector): RevenueTool | null {
 return revenueTools.find((tool) => tool.sector === sector) ?? null;
}

export function getAllRevenueToolSpecs(): readonly RevenueTool[] {
 return revenueTools;
}

export function getRevenueToolRegistry(): RevenueToolRegistry {
 return revenueToolRegistry;
}

// ---------------------------------------------------------------------------
// Subscription guard (existing runtime — not extended in v1A)
// ---------------------------------------------------------------------------

export function isProSubscriptionActive(
 status: string | undefined,
 currentPeriodEnd: string | undefined
): boolean {
 if (status !== "active" && status !== "trialing") {
 return false;
 }

 if (!currentPeriodEnd) {
 return true;
 }

 const endMs = Date.parse(currentPeriodEnd);
 if (Number.isNaN(endMs)) {
 return true;
 }

 return endMs > Date.now();
}

// ---------------------------------------------------------------------------
// Tool display & free/paid runtime guards
// ---------------------------------------------------------------------------

export function applyRevenueToolDisplay(definition: ToolDefinition): ToolDefinition {
 const revenue =
 definition.tier === "free"
 ? getRevenueToolByFreeSlug(definition.slug)
 : getRevenueToolByPremiumSlug(definition.slug);

 if (!revenue) {
 return definition;
 }

 const title =
 definition.tier === "free" ? revenue.freeTitle : revenue.paidTitle;

 return {
 ...definition,
 title,
 shortDescription:
 definition.tier === "free" ? revenue.freeValue : revenue.paidValue,
 longDescription:
 definition.tier === "free" ? revenue.painStatement : revenue.paidValue,
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

export function filterFreeResults(
 definition: ToolDefinition,
 results: ToolResult[]
) {
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

/** Block paid-only result labels from appearing on free tools. */
export function stripPaidOnlyResults(
 definition: ToolDefinition,
 results: ToolResult[]
): ToolResult[] {
 if (definition.tier !== "free") {
 return results;
 }

 const blocked = /safe|minimum|verdict|leak|bid risk|do not accept/i;
 return results.filter((result) => !blocked.test(result.label));
}
