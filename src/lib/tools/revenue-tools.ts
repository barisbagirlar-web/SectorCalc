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

const revenueToolsCore: RevenueTool[] = [
  /** MarginCore pilot — CNC Machine Time Calculator (free) → CNC Quote Risk Analyzer (paid) */
  {
    sector: "cnc-manufacturing",
 freeSlug: "machine-time-calculator",
 paidSlug: "cnc-quote-risk-analyzer",
 freeTitle: "Machine Time Calculator",
 paidTitle: "CNC Audit Engine",
 painStatement:
 "This one-off job may look profitable but setup and tooling can destroy the margin.",
 freeValue: "Estimate visible machine time and direct cost risk.",
 paidValue:
 "Find the minimum safe price and quote verdict before accepting the job.",
 freeInputs: [
 {
 key: "setupTime",
 label: "Setup time",
 type: "number",
 unit: "min",
 required: true,
 },
 {
 key: "cycleTime",
 label: "Cycle time",
 type: "number",
 unit: "min",
 required: true,
 },
 {
 key: "quantity",
 label: "Quantity",
 type: "number",
 required: true,
 defaultValue: 1,
 },
 ],
 paidInputs: [
 {
 key: "setupTime",
 label: "Setup time",
 type: "number",
 unit: "min",
 required: true,
 },
 {
 key: "cycleTime",
 label: "Cycle time",
 type: "number",
 unit: "min",
 required: true,
 },
 {
 key: "quantity",
 label: "Quantity",
 type: "number",
 required: true,
 defaultValue: 1,
 },
 {
 key: "toolCost",
 label: "Tooling and fixture cost",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "materialCost",
 label: "Material cost",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "machineRate",
 label: "Machine rate",
 type: "currency",
 unit: "USD/hr",
 required: true,
 },
 {
 key: "riskMargin",
 label: "Risk margin",
 type: "percent",
 unit: "%",
 required: true,
 defaultValue: 15,
 },
 ],
 freeResultPromise:
 "Shows visible time exposure and warns when setup-heavy jobs may be underpriced.",
 paidResultPromise:
 "Returns a minimum safe price, quote risk verdict and suggested action.",
 verdictLabels: ["DO NOT ACCEPT UNDER", "REPRICE REQUIRED", "SAFE TO QUOTE"],
 legalDisclaimer: revenueLegalDisclaimer,
 seoKeywords: [
 "cnc cost calculator",
 "machine shop quote calculator",
 "cnc quote risk analyzer",
 "minimum safe price cnc job",
 ],
 freeCalculatorInputIds: [
 "monthlyMachineCost",
 "availableHours",
 "utilizationRate",
 ],
 freeResultIds: ["machineHourCost"],
 freeMissingFactors: [
 "Minimum safe quote for one-off / low-volume jobs",
 "Setup, tooling and scrap risk",
 "Do-not-accept-under price floor",
 "Accept / reprice / reject verdict",
 ],
 premiumCtaLabel: "Unlock Safe Price Analyzer",
 premiumTeaserTitle: "Quoting a one-off or low-volume job?",
 premiumTeaserText:
 "Unlock the CNC Quote Risk Analyzer for minimum safe price, key cost drivers and a quote verdict.",
 },
 {
 sector: "construction",
 freeSlug: "project-cost-calculator",
 paidSlug: "change-order-impact-analyzer",
 freeTitle: "Concrete / Project Cost Calculator",
 paidTitle: "Change Order Impact Analyzer",
 painStatement: "Small change orders can quietly erase project margin.",
 freeValue: "Estimate visible cost exposure from project changes.",
 paidValue:
 "Measure delay, crew cost and margin impact before accepting the change.",
 freeInputs: [
 {
 key: "originalBudget",
 label: "Original budget",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "changeEstimate",
 label: "Change cost estimate",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "deadlinePressure",
 label: "Deadline pressure",
 type: "select",
 required: true,
 options: [
 { value: "low", label: "Low" },
 { value: "medium", label: "Medium" },
 { value: "high", label: "High" },
 ],
 },
 ],
 paidInputs: [
 {
 key: "originalBudget",
 label: "Original budget",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "changeEstimate",
 label: "Change cost estimate",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "delayDays",
 label: "Delay days",
 type: "number",
 unit: "days",
 required: true,
 },
 {
 key: "crewCostPerDay",
 label: "Crew cost per day",
 type: "currency",
 unit: "USD/day",
 required: true,
 },
 {
 key: "marginTarget",
 label: "Target margin",
 type: "percent",
 unit: "%",
 required: true,
 },
 ],
 freeResultPromise:
 "Shows whether the visible change cost may become a margin risk.",
 paidResultPromise:
 "Returns change impact, margin risk and accept/renegotiate verdict.",
 verdictLabels: [
 "ACCEPT",
 "RENEGOTIATE",
 "DO NOT ACCEPT WITHOUT PRICE ADJUSTMENT",
 ],
 legalDisclaimer: revenueLegalDisclaimer,
 seoKeywords: [
 "construction cost calculator",
 "change order impact analyzer",
 "project margin risk calculator",
 ],
 freeCalculatorInputIds: ["materialCost", "laborHours", "laborHourlyRate"],
 freeResultIds: ["estimatedProjectCost"],
 freeMissingFactors: [
 "Minimum safe change-order price",
 "Delay and overhead impact on full project margin",
 "Accept / renegotiate / reject verdict",
 "Scenario comparison at target margins",
 ],
 premiumCtaLabel: "Unlock Change Order Analyzer",
 premiumTeaserTitle: "Need a change-order decision?",
 premiumTeaserText:
 "Unlock the Change Order Impact Analyzer for margin impact, delay cost and a clear verdict.",
 },
 {
 sector: "cleaning",
 freeSlug: "cleaning-cost-calculator",
 paidSlug: "office-cleaning-bid-optimizer",
 freeTitle: "Cleaning Cost Calculator",
 paidTitle: "Office Cleaning Bid Optimizer",
 painStatement:
 "A cleaning contract can look easy and still lose money every month.",
 freeValue: "Estimate basic labor and visit cost.",
 paidValue:
 "Find the minimum monthly bid with labor, supplies, frequency and target margin.",
 freeInputs: [
 {
 key: "areaSize",
 label: "Area size",
 type: "number",
 unit: "sq ft",
 required: true,
 },
 {
 key: "staffCount",
 label: "Staff count",
 type: "number",
 required: true,
 },
 {
 key: "visitFrequency",
 label: "Visits per month",
 type: "number",
 required: true,
 },
 ],
 paidInputs: [
 {
 key: "areaSize",
 label: "Area size",
 type: "number",
 unit: "sq ft",
 required: true,
 },
 {
 key: "laborRate",
 label: "Labor rate",
 type: "currency",
 unit: "USD/hr",
 required: true,
 },
 {
 key: "hoursPerVisit",
 label: "Hours per visit",
 type: "number",
 unit: "hr",
 required: true,
 },
 {
 key: "supplyCost",
 label: "Supply cost",
 type: "currency",
 unit: "USD/month",
 required: true,
 },
 {
 key: "visitFrequency",
 label: "Visits per month",
 type: "number",
 required: true,
 },
 {
 key: "targetMargin",
 label: "Target margin",
 type: "percent",
 unit: "%",
 required: true,
 },
 ],
 freeResultPromise:
 "Shows basic workload exposure and warns when visit frequency may underprice labor.",
 paidResultPromise:
 "Returns minimum monthly bid, margin risk and pricing verdict.",
 verdictLabels: ["SAFE BID", "LOW MARGIN", "UNDERPRICED"],
 legalDisclaimer: revenueLegalDisclaimer,
 seoKeywords: [
 "cleaning cost calculator",
 "office cleaning bid calculator",
 "cleaning contract pricing tool",
 ],
 freeCalculatorInputIds: ["area", "estimatedHours", "laborHourlyCost"],
 freeResultIds: ["totalCost"],
 freeMissingFactors: [
 "Minimum safe monthly bid",
 "Crew load vs. contract budget gap",
 "Supply, travel and overhead allocation",
 "Underpriced / safe bid verdict",
 ],
 premiumCtaLabel: "Unlock Bid Optimizer",
 premiumTeaserTitle: "Pricing a recurring office contract?",
 premiumTeaserText:
 "Unlock the Office Cleaning Bid Optimizer for minimum monthly bid and margin at budget.",
 },
 {
 sector: "restaurant",
 freeSlug: "food-cost-calculator",
 paidSlug: "menu-profit-leak-detector",
 freeTitle: "Food Cost Calculator",
 paidTitle: "Menu Profit Leak Detector",
 painStatement:
 "A popular menu item can still leak profit after waste, labor and commission.",
 freeValue: "Check basic food cost ratio.",
 paidValue:
 "Detect real margin after waste, delivery fees and labor cost.",
 freeInputs: [
 {
 key: "menuPrice",
 label: "Menu price",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "foodCost",
 label: "Food cost",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "deliveryCommission",
 label: "Delivery commission",
 type: "percent",
 unit: "%",
 required: false,
 },
 ],
 paidInputs: [
 {
 key: "menuPrice",
 label: "Menu price",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "ingredientCost",
 label: "Ingredient cost",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "wasteRate",
 label: "Waste rate",
 type: "percent",
 unit: "%",
 required: true,
 },
 {
 key: "deliveryCommission",
 label: "Delivery commission",
 type: "percent",
 unit: "%",
 required: true,
 },
 {
 key: "laborCostPerItem",
 label: "Labor cost per item",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "targetMargin",
 label: "Target margin",
 type: "percent",
 unit: "%",
 required: true,
 },
 ],
 freeResultPromise:
 "Shows basic food cost pressure before hidden operating costs.",
 paidResultPromise:
 "Returns real margin, profit leak and reprice/remove verdict.",
 verdictLabels: ["PROFITABLE", "LEAKING PROFIT", "REMOVE OR REPRICE"],
 legalDisclaimer: revenueLegalDisclaimer,
 seoKeywords: [
 "food cost calculator",
 "menu profit calculator",
 "restaurant margin leak detector",
 ],
 freeCalculatorInputIds: ["ingredientCost", "sellingPrice", "portions"],
 freeResultIds: ["foodCostPercentage"],
 freeMissingFactors: [
 "Waste, commission and labor-adjusted true profit",
 "Menu item leak amount",
 "Remove / reprice / keep verdict",
 "Suggested action plan",
 ],
 premiumCtaLabel: "Unlock Profit Leak Analyzer",
 premiumTeaserTitle: "Is this menu item actually profitable?",
 premiumTeaserText:
 "Unlock the Menu Profit Leak Detector for waste, commission and labor-adjusted profit.",
 },
 {
 sector: "ecommerce",
 freeSlug: "product-margin-calculator",
 paidSlug: "return-profit-erosion-tool",
 freeTitle: "Product Margin Calculator",
 paidTitle: "Return Profit Erosion Tool",
 painStatement:
 "Sales can grow while returns, ads and fees erase the profit.",
 freeValue: "Check basic gross margin.",
 paidValue:
 "Measure net profit after returns, shipping, payment fees and ad cost.",
 freeInputs: [
 {
 key: "productPrice",
 label: "Product price",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "productCost",
 label: "Product cost",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "returnRate",
 label: "Return rate",
 type: "percent",
 unit: "%",
 required: false,
 },
 ],
 paidInputs: [
 {
 key: "productPrice",
 label: "Product price",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "productCost",
 label: "Product cost",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "shippingCost",
 label: "Shipping cost",
 type: "currency",
 unit: "USD",
 required: true,
 },
 {
 key: "returnRate",
 label: "Return rate",
 type: "percent",
 unit: "%",
 required: true,
 },
 {
 key: "paymentFeeRate",
 label: "Payment fee",
 type: "percent",
 unit: "%",
 required: true,
 },
 {
 key: "adCostPerSale",
 label: "Ad cost per sale",
 type: "currency",
 unit: "USD",
 required: true,
 },
 ],
 freeResultPromise:
 "Shows basic gross margin before returns, ads and payment fees.",
 paidResultPromise:
 "Returns net profit after returns, break point and scaling verdict.",
 verdictLabels: ["SCALABLE", "FRAGILE", "LOSS AFTER RETURNS"],
 legalDisclaimer: revenueLegalDisclaimer,
 seoKeywords: [
 "product margin calculator",
 "return rate profit calculator",
 "ecommerce profit erosion tool",
 ],
 freeCalculatorInputIds: ["sellingPrice", "productCost", "returnRate"],
 freeResultIds: ["margin"],
 freeMissingFactors: [
 "Net profit after returns, fees and ad spend",
 "Return-rate erosion amount",
 "Scalable vs. fragile vs. loss verdict",
 "Key SKU risk drivers",
 ],
 premiumCtaLabel: "Unlock Return Risk Analyzer",
 premiumTeaserTitle: "Can this SKU scale after returns?",
 premiumTeaserText:
 "Unlock the Return Profit Erosion Tool for post-return net profit and a scale-or-stop verdict.",
 },
];

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
 return [...new Set([...revenueTools.map((tool) => tool.paidSlug), ...funnelSlugs])];
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
