/**
 * SectorCalc Revenue Flow v1A — Product Spec Lock
 *
 * Canonical registry for free calculator / paid analyzer pairs across five sectors.
 * See docs/revenue-flow-product-spec.md for product rules and extension guide.
 *
 * FREE: SEO + trust + pre-check. No safe price, verdict, PDF, or saved analysis.
 * PAID: Decision analyzers (SectorCalc Pro). PDF export is a later phase.
 *
 * Out of scope for v1A: Stripe, webhooks, PDF, new subscription guards, Cloud Functions.
 */

import type { IndustrySlug } from "@/data/industries";
import type { ToolDefinition, ToolResult } from "@/data/tool-schema";
import type { ToolSlug } from "@/data/tools";
import {
  FREE_PLAN_PRICING,
  REVENUE_LEGAL_DISCLAIMER,
  REVENUE_LEGAL_DISCLAIMER_PAID,
  SECTORCALC_PRO,
  SECTORCALC_PRO_PRICE,
  SECTORCALC_PRO_PRICE_LABEL,
  SECTORCALC_PRO_PRICING,
} from "@/lib/pricing/sectorcalc-pro";
import { getToolHref } from "@/lib/tools/paths";

// Re-export pricing for existing consumers
export {
  FREE_PLAN_PRICING,
  REVENUE_LEGAL_DISCLAIMER,
  REVENUE_LEGAL_DISCLAIMER_PAID,
  SECTORCALC_PRO,
  SECTORCALC_PRO_PRICE,
  SECTORCALC_PRO_PRICE_LABEL,
  SECTORCALC_PRO_PRICING,
};

export const FREE_TOOL_PRIVACY_NOTE =
  "Inputs stay in your browser for this session. SectorCalc does not store free tool inputs unless you create an account and save an analysis.";

// ---------------------------------------------------------------------------
// Product spec types (v1A lock)
// ---------------------------------------------------------------------------

/** One of the five revenue sectors — aligned with IndustrySlug. */
export type RevenueSector = IndustrySlug;

/** Reference to a calculator input field by ID (matches tool-definition inputs). */
export interface RevenueToolInput {
  readonly id: string;
}

export type FreeResultType = "quick_check" | "risk_signal";
export type PaidResultType = "decision_verdict";

/**
 * Locked product metadata for one sector's free calculator + paid analyzer pair.
 * Formulas stay minimal in v1A — this registry defines what each tool promises.
 */
export interface RevenueTool {
  sector: RevenueSector;
  freeSlug: ToolSlug;
  paidSlug: ToolSlug;
  freeTitle: string;
  paidTitle: string;
  painStatement: string;
  freeValue: string;
  paidValue: string;
  freeInputs: readonly RevenueToolInput[];
  paidInputs: readonly RevenueToolInput[];
  freeResultPromise: string;
  paidResultPromise: string;
  verdictLabels: readonly string[];
  legalDisclaimer: string;
  seoKeywords: readonly string[];
  /** Runtime: result IDs allowed on free tier. */
  freeResultIds: readonly string[];
  /** Runtime: factors withheld from free tier (upgrade panel). */
  freeMissingFactors: readonly string[];
  /** Runtime: CTA on free tool → paid analyzer. */
  premiumCtaLabel: string;
  freeResultType: FreeResultType;
  paidResultType: PaidResultType;
  premiumTeaserTitle: string;
  premiumTeaserText: string;
}

export interface RevenueToolRegistry {
  readonly legalDisclaimer: string;
  readonly tools: readonly RevenueTool[];
}

/** @deprecated Use RevenueTool */
export type RevenueToolProductSpec = RevenueTool;

/** @deprecated Use RevenueTool */
export type RevenueToolPair = RevenueTool;

// ---------------------------------------------------------------------------
// Input helpers
// ---------------------------------------------------------------------------

function inputs(...ids: string[]): readonly RevenueToolInput[] {
  return ids.map((id) => ({ id }));
}

function inputIds(spec: RevenueTool, tier: "free" | "paid"): readonly string[] {
  const list = tier === "free" ? spec.freeInputs : spec.paidInputs;
  return list.map((input) => input.id);
}

// ---------------------------------------------------------------------------
// Five-sector product matrix (canonical)
// ---------------------------------------------------------------------------

const REVENUE_TOOLS: readonly RevenueTool[] = [
  {
    sector: "cnc-manufacturing",
    freeSlug: "machine-hour-estimator",
    paidSlug: "cnc-minimum-safe-quote-analyzer",
    freeTitle: "Machine Time Calculator",
    paidTitle: "CNC Quote Risk Analyzer",
    painStatement:
      "This one-off job may look profitable but setup and tooling can destroy the margin.",
    freeValue: "Estimate visible machine time and direct cost risk.",
    paidValue:
      "Find the minimum safe price and quote verdict before accepting the job.",
    freeInputs: inputs(
      "monthlyMachineCost",
      "availableHours",
      "utilizationRate"
    ),
    paidInputs: inputs(
      "quantity",
      "materialCostPerPart",
      "setupMinutes",
      "cycleMinutesPerPart",
      "machineHourlyCost",
      "operatorHourlyCost",
      "toolingCost",
      "scrapRate",
      "overheadCost",
      "targetMargin"
    ),
    freeResultPromise:
      "Estimated machine-hour cost — visible time and direct cost exposure only.",
    paidResultPromise:
      "Minimum safe price, setup/tooling drivers and quote accept/reprice/reject verdict.",
    verdictLabels: [
      "DO NOT ACCEPT UNDER",
      "REPRICE REQUIRED",
      "SAFE TO QUOTE",
    ],
    legalDisclaimer: REVENUE_LEGAL_DISCLAIMER,
    seoKeywords: [
      "cnc machine time calculator",
      "cnc hourly rate estimator",
      "manufacturing cost calculator",
      "cnc quote risk analyzer",
      "minimum safe cnc quote",
    ],
    freeResultIds: ["machineHourCost"],
    freeMissingFactors: [
      "Minimum safe quote for one-off / low-volume jobs",
      "Setup, tooling and scrap risk",
      "Do-not-accept-under price floor",
      "Accept / reprice / reject verdict",
    ],
    premiumCtaLabel: "Unlock Safe Price Analyzer",
    freeResultType: "risk_signal",
    paidResultType: "decision_verdict",
    premiumTeaserTitle: "Quoting a one-off or low-volume job?",
    premiumTeaserText:
      "Unlock the CNC Quote Risk Analyzer for minimum safe price, key cost drivers and a quote verdict.",
  },
  {
    sector: "construction",
    freeSlug: "project-cost-estimator",
    paidSlug: "change-order-impact-analyzer",
    freeTitle: "Concrete / Project Cost Calculator",
    paidTitle: "Change Order Impact Analyzer",
    painStatement: "Small change orders can quietly erase project margin.",
    freeValue: "Estimate visible cost exposure from project changes.",
    paidValue:
      "Measure delay, crew cost and margin impact before accepting the change.",
    freeInputs: inputs("materialCost", "laborHours", "laborHourlyRate"),
    paidInputs: inputs(
      "originalContractValue",
      "originalEstimatedCost",
      "extraLaborHours",
      "laborHourlyRate",
      "extraMaterialCost",
      "extraEquipmentCost",
      "delayDays",
      "dailyOverheadCost",
      "targetChangeMargin",
      "customerOfferedPrice"
    ),
    freeResultPromise:
      "Estimated direct project cost — visible exposure, not a change-order verdict.",
    paidResultPromise:
      "Minimum safe change price, margin delta, delay cost and accept/renegotiate verdict.",
    verdictLabels: [
      "ACCEPT",
      "RENEGOTIATE",
      "DO NOT ACCEPT WITHOUT PRICE ADJUSTMENT",
    ],
    legalDisclaimer: REVENUE_LEGAL_DISCLAIMER,
    seoKeywords: [
      "project cost calculator",
      "concrete cost estimator",
      "construction cost calculator",
      "change order impact analyzer",
      "construction margin calculator",
    ],
    freeResultIds: ["estimatedProjectCost"],
    freeMissingFactors: [
      "Minimum safe change-order price",
      "Delay and overhead impact on full project margin",
      "Accept / renegotiate / reject verdict",
      "Scenario comparison at target margins",
    ],
    premiumCtaLabel: "Unlock Change Order Analyzer",
    freeResultType: "risk_signal",
    paidResultType: "decision_verdict",
    premiumTeaserTitle: "Need a change-order decision?",
    premiumTeaserText:
      "Unlock the Change Order Impact Analyzer for margin impact, delay cost and a clear verdict.",
  },
  {
    sector: "cleaning",
    freeSlug: "cleaning-cost-estimator",
    paidSlug: "office-cleaning-bid-optimizer",
    freeTitle: "Cleaning Cost Calculator",
    paidTitle: "Office Cleaning Bid Optimizer",
    painStatement:
      "A cleaning contract can look easy and still lose money every month.",
    freeValue: "Estimate basic labor and visit cost.",
    paidValue:
      "Find the minimum monthly bid with labor, supplies, frequency and target margin.",
    freeInputs: inputs("area", "estimatedHours", "laborHourlyCost"),
    paidInputs: inputs(
      "area",
      "frequencyPerMonth",
      "hoursPerVisit",
      "crewSize",
      "laborHourlyCost",
      "suppliesCostPerVisit",
      "travelCostPerVisit",
      "monthlyOverhead",
      "targetMargin",
      "customerBudget"
    ),
    freeResultPromise:
      "Estimated job cost from area, hours and labor — not a contract bid verdict.",
    paidResultPromise:
      "Minimum safe monthly bid, margin at customer budget and underpriced / safe bid verdict.",
    verdictLabels: ["SAFE BID", "LOW MARGIN", "UNDERPRICED"],
    legalDisclaimer: REVENUE_LEGAL_DISCLAIMER,
    seoKeywords: [
      "cleaning cost calculator",
      "office cleaning bid calculator",
      "janitorial pricing estimator",
      "cleaning bid optimizer",
      "commercial cleaning margin",
    ],
    freeResultIds: ["totalCost"],
    freeMissingFactors: [
      "Minimum safe monthly bid",
      "Crew load vs. contract budget gap",
      "Supply, travel and overhead allocation",
      "Underpriced / safe bid verdict",
    ],
    premiumCtaLabel: "Unlock Bid Optimizer",
    freeResultType: "risk_signal",
    paidResultType: "decision_verdict",
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
    freeInputs: inputs("ingredientCost", "sellingPrice", "portions"),
    paidInputs: inputs(
      "sellingPrice",
      "ingredientCost",
      "wasteRate",
      "packagingCost",
      "laborCostPerItem",
      "deliveryCommissionRate",
      "targetMargin",
      "monthlyUnitsSold"
    ),
    freeResultPromise:
      "Food cost percentage per portion — basic ratio, not a profit leak verdict.",
    paidResultPromise:
      "True margin after waste and fees, monthly leak amount and remove / reprice / keep verdict.",
    verdictLabels: ["PROFITABLE", "LEAKING PROFIT", "REMOVE OR REPRICE"],
    legalDisclaimer: REVENUE_LEGAL_DISCLAIMER,
    seoKeywords: [
      "food cost calculator",
      "restaurant food cost percentage",
      "menu profit calculator",
      "menu profit leak detector",
      "restaurant margin analyzer",
    ],
    freeResultIds: ["foodCostPercentage"],
    freeMissingFactors: [
      "Waste, commission and labor-adjusted true profit",
      "Menu item leak amount",
      "Remove / reprice / keep verdict",
      "Suggested action plan",
    ],
    premiumCtaLabel: "Unlock Profit Leak Analyzer",
    freeResultType: "risk_signal",
    paidResultType: "decision_verdict",
    premiumTeaserTitle: "Is this menu item actually profitable?",
    premiumTeaserText:
      "Unlock the Menu Profit Leak Detector for waste, commission and labor-adjusted profit.",
  },
  {
    sector: "ecommerce",
    freeSlug: "product-margin-calculator",
    paidSlug: "return-rate-profit-erosion-tool",
    freeTitle: "Product Margin Calculator",
    paidTitle: "Return Profit Erosion Tool",
    painStatement:
      "Sales can grow while returns, ads and fees erase the profit.",
    freeValue: "Check basic gross margin.",
    paidValue:
      "Measure net profit after returns, shipping, payment fees and ad cost.",
    freeInputs: inputs("sellingPrice", "productCost", "returnRate"),
    paidInputs: inputs(
      "sellingPrice",
      "productCost",
      "shippingCost",
      "platformFeeRate",
      "paymentFeeRate",
      "returnRate",
      "returnHandlingCost",
      "adCostPerOrder",
      "targetMargin"
    ),
    freeResultPromise:
      "Headline gross margin from price, cost and return rate — not net profit after fees.",
    paidResultPromise:
      "Net profit after returns and ad spend, erosion amount and scalable vs. fragile vs. loss verdict.",
    verdictLabels: ["SCALABLE", "FRAGILE", "LOSS AFTER RETURNS"],
    legalDisclaimer: REVENUE_LEGAL_DISCLAIMER,
    seoKeywords: [
      "product margin calculator",
      "ecommerce margin calculator",
      "return rate profit calculator",
      "sku profit erosion",
      "ecommerce net margin analyzer",
    ],
    freeResultIds: ["margin"],
    freeMissingFactors: [
      "Net profit after returns, fees and ad spend",
      "Return-rate erosion amount",
      "Scalable vs. fragile vs. loss verdict",
      "Key SKU risk drivers",
    ],
    premiumCtaLabel: "Unlock Return Risk Analyzer",
    freeResultType: "risk_signal",
    paidResultType: "decision_verdict",
    premiumTeaserTitle: "Can this SKU scale after returns?",
    premiumTeaserText:
      "Unlock the Return Profit Erosion Tool for post-return net profit and a scale-or-stop verdict.",
  },
] as const;

export const REVENUE_TOOL_REGISTRY: RevenueToolRegistry = {
  legalDisclaimer: REVENUE_LEGAL_DISCLAIMER,
  tools: REVENUE_TOOLS,
};

/** @deprecated Use REVENUE_TOOL_REGISTRY.tools */
export const REVENUE_TOOL_PRODUCT_SPECS = REVENUE_TOOL_REGISTRY.tools;

/** @deprecated Use REVENUE_TOOL_REGISTRY.tools */
export const REVENUE_TOOL_PAIRS = REVENUE_TOOL_REGISTRY.tools;

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

const byFreeSlug = new Map(
  REVENUE_TOOL_REGISTRY.tools.map((tool) => [tool.freeSlug, tool] as const)
);

const byPaidSlug = new Map(
  REVENUE_TOOL_REGISTRY.tools.map((tool) => [tool.paidSlug, tool] as const)
);

export function getRevenueToolByFreeSlug(slug: string): RevenueTool | undefined {
  return byFreeSlug.get(slug as ToolSlug);
}

export function getRevenueToolByPremiumSlug(slug: string): RevenueTool | undefined {
  return byPaidSlug.get(slug as ToolSlug);
}

export function getRevenueToolByPaidSlug(slug: string): RevenueTool | undefined {
  return getRevenueToolByPremiumSlug(slug);
}

export function getRevenueToolBySector(sector: RevenueSector): RevenueTool | undefined {
  return REVENUE_TOOL_REGISTRY.tools.find((tool) => tool.sector === sector);
}

export function getAllRevenueToolSpecs(): readonly RevenueTool[] {
  return REVENUE_TOOL_REGISTRY.tools;
}

export function getRevenueToolRegistry(): RevenueToolRegistry {
  return REVENUE_TOOL_REGISTRY;
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

  const allowed = new Set(inputIds(revenue, "free"));
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
