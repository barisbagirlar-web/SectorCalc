/**
 * SectorCalc Revenue Flow v1A — Product Spec Lock
 *
 * Canonical registry for free calculator / paid analyzer pairs across five sectors.
 * See docs/revenue-flow-product-spec.md for product rules and extension guide.
 *
 * FREE tools: SEO + quick value + missing risk factors. No verdict, safe price, PDF, or saved analysis.
 * PAID tools: Decision analyzers (SectorCalc Pro). PDF is export of paid output only — not the product.
 */

import type { IndustrySlug } from "@/data/industries";
import type { ToolDefinition, ToolResult } from "@/data/tool-schema";
import type { ToolSlug } from "@/data/tools";
import { getToolHref } from "@/lib/tools/paths";

// ---------------------------------------------------------------------------
// Shared copy & pricing (v1A lock — no Stripe/PDF implementation here)
// ---------------------------------------------------------------------------

export const REVENUE_LEGAL_DISCLAIMER =
  "This is a technical simulation, not financial, legal or engineering advice. Verify before business decisions.";

export const REVENUE_LEGAL_DISCLAIMER_PAID =
  `${REVENUE_LEGAL_DISCLAIMER} Digital product. No refunds.`;

export const FREE_TOOL_PRIVACY_NOTE =
  "Inputs stay in your browser for this session. SectorCalc does not store free tool inputs unless you create an account and save an analysis.";

export const SECTORCALC_PRO_PRICE = 29;
export const SECTORCALC_PRO_PRICE_LABEL = "$29/month";

export const SECTORCALC_PRO_PRICING = {
  id: "pro" as const,
  name: "SectorCalc Pro",
  price: SECTORCALC_PRO_PRICE,
  priceLabel: SECTORCALC_PRO_PRICE_LABEL,
  tagline:
    "Free calculators for quick checks. Pro unlocks analyzers with safe price verdicts, margin leak detection and bid risk decisions.",
  description:
    "Premium decision analyzers across five sectors — minimum safe prices, margin leak detection and accept/reject verdicts.",
  features: [
    "All premium decision analyzers across five sectors",
    "Minimum safe price and bid floor verdicts",
    "Margin leak and profit erosion detection",
    "Key risk drivers and suggested actions",
    "Cancel anytime",
  ],
  freePlanContrast: [
    "No safe price or accept/reject verdict",
    "No decision summaries",
    "No export",
  ],
  laterRelease: [
    "PDF export of decision summaries (later release)",
    "Estimates only; verify before business decisions",
    "Digital product; no refunds",
  ],
} as const;

export const FREE_PLAN_PRICING = {
  id: "free" as const,
  name: "Free",
  priceLabel: "$0",
  period: "forever",
  description:
    "Quick sector checks — limited inputs, directional numbers and early risk signals.",
  features: [
    "Five industry quick-check calculators",
    "2–3 inputs per tool",
    "Risk or preview signals",
    "No account required",
  ],
} as const;

// ---------------------------------------------------------------------------
// Product spec types
// ---------------------------------------------------------------------------

export type FreeResultType = "quick_check" | "risk_signal";
export type PaidResultType = "decision_verdict";

/**
 * Locked product metadata for one sector's free/paid tool pair.
 * Formulas stay minimal in v1A — this file defines what each tool promises.
 */
export interface RevenueToolProductSpec {
  sector: IndustrySlug;
  freeSlug: ToolSlug;
  paidSlug: ToolSlug;
  freeTitle: string;
  paidTitle: string;
  painStatement: string;
  /** What the free calculator gives — trust + pre-check, not a final decision. */
  freeValue: string;
  /** What the paid analyzer gives — verdict + safe price + action. */
  paidValue: string;
  /** Input field IDs shown on the free tool (subset of full calculator). */
  freeInputs: readonly string[];
  /** Input field IDs on the paid analyzer (full decision model). */
  paidInputs: readonly string[];
  /** User-facing promise for free result screen. */
  freeResultPromise: string;
  /** User-facing promise for paid result screen. */
  paidResultPromise: string;
  verdictLabels: readonly string[];
  legalDisclaimer: string;
  /** Runtime: result IDs allowed on free tier (implementation guard). */
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

/** @deprecated Use RevenueToolProductSpec — kept for gradual migration. */
export type RevenueToolPair = RevenueToolProductSpec;

// ---------------------------------------------------------------------------
// Five-sector product matrix (canonical)
// ---------------------------------------------------------------------------

export const REVENUE_TOOL_PRODUCT_SPECS: readonly RevenueToolProductSpec[] = [
  {
    sector: "cnc-manufacturing",
    freeSlug: "machine-hour-estimator",
    paidSlug: "cnc-minimum-safe-quote-analyzer",
    freeTitle: "Machine Time Calculator",
    paidTitle: "Quote Risk Analyzer",
    painStatement:
      "Low-quantity jobs often get quoted from machine-hour averages without a true loss-prevention floor.",
    freeValue:
      "Machine-hour benchmark only — not a minimum safe quote or bid verdict.",
    paidValue:
      "Finds the minimum safe price for one-off or low-volume CNC work and flags quotes that will lose money.",
    freeInputs: ["monthlyMachineCost", "availableHours", "utilizationRate"],
    paidInputs: [
      "quantity",
      "materialCostPerPart",
      "setupMinutes",
      "cycleMinutesPerPart",
      "machineHourlyCost",
      "operatorHourlyCost",
      "toolingCost",
      "scrapRate",
      "overheadCost",
      "targetMargin",
    ],
    freeResultPromise:
      "Estimated machine-hour cost — a directional benchmark for capacity planning.",
    paidResultPromise:
      "Minimum safe quote, safe unit price, setup/scrap drivers and a do-not-accept-under verdict.",
    verdictLabels: ["DO NOT ACCEPT UNDER $X"],
    legalDisclaimer: REVENUE_LEGAL_DISCLAIMER,
    freeResultIds: ["machineHourCost"],
    freeMissingFactors: [
      "Minimum safe quote for one-off / low-volume jobs",
      "Setup, tooling and scrap risk",
      "Do-not-accept-under price floor",
      "Accept / reject verdict",
    ],
    premiumCtaLabel: "Unlock Safe Price Analyzer",
    freeResultType: "risk_signal",
    paidResultType: "decision_verdict",
    premiumTeaserTitle: "Quoting a one-off or low-volume job?",
    premiumTeaserText:
      "Unlock the Quote Risk Analyzer for minimum safe price, key cost drivers and a do-not-accept-under verdict.",
  },
  {
    sector: "construction",
    freeSlug: "project-cost-estimator",
    paidSlug: "change-order-impact-analyzer",
    freeTitle: "Project Cost Calculator",
    paidTitle: "Change Order Impact Analyzer",
    painStatement:
      "Change orders often move forward without a clear view of margin, delay cost and extra workload.",
    freeValue:
      "Directional project cost only — no safe change price or accept/reject verdict.",
    paidValue:
      "Calculates how a change order affects margin, delay cost and added workload — with an accept/renegotiate verdict.",
    freeInputs: ["materialCost", "laborHours", "laborHourlyRate"],
    paidInputs: [
      "originalContractValue",
      "originalEstimatedCost",
      "extraLaborHours",
      "laborHourlyRate",
      "extraMaterialCost",
      "extraEquipmentCost",
      "delayDays",
      "dailyOverheadCost",
      "targetChangeMargin",
      "customerOfferedPrice",
    ],
    freeResultPromise:
      "Estimated direct project cost from materials and labor — a starting point, not a bid decision.",
    paidResultPromise:
      "Minimum safe change price, margin delta, delay cost and accept / renegotiate / reject verdict.",
    verdictLabels: [
      "ACCEPT",
      "RENEGOTIATE",
      "DO NOT ACCEPT WITHOUT PRICE ADJUSTMENT",
    ],
    legalDisclaimer: REVENUE_LEGAL_DISCLAIMER,
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
      "Unlock the Change Order Impact Analyzer for minimum safe change price, margin impact and a clear verdict.",
  },
  {
    sector: "cleaning",
    freeSlug: "cleaning-cost-estimator",
    paidSlug: "office-cleaning-bid-optimizer",
    freeTitle: "Cleaning Cost Calculator",
    paidTitle: "Bid Optimizer",
    painStatement:
      "Recurring office contracts are often priced before crew load, supplies and target margin are visible.",
    freeValue:
      "Quick job cost estimate — no minimum monthly bid or margin verdict.",
    paidValue:
      "Calculates minimum monthly bid, labor load, supply cost and target margin for recurring office work.",
    freeInputs: ["area", "estimatedHours", "laborHourlyCost"],
    paidInputs: [
      "area",
      "frequencyPerMonth",
      "hoursPerVisit",
      "crewSize",
      "laborHourlyCost",
      "suppliesCostPerVisit",
      "travelCostPerVisit",
      "monthlyOverhead",
      "targetMargin",
      "customerBudget",
    ],
    freeResultPromise:
      "Estimated job cost from area, hours and labor rate — not a contract bid verdict.",
    paidResultPromise:
      "Minimum safe monthly bid, margin at customer budget and underpriced / safe bid verdict.",
    verdictLabels: ["SAFE BID", "LOW MARGIN", "UNDERPRICED"],
    legalDisclaimer: REVENUE_LEGAL_DISCLAIMER,
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
      "Unlock the Bid Optimizer for minimum safe monthly bid, margin at budget and underpriced risk signals.",
  },
  {
    sector: "restaurant",
    freeSlug: "food-cost-calculator",
    paidSlug: "menu-profit-leak-detector",
    freeTitle: "Food Cost Calculator",
    paidTitle: "Menu Profit Leak Detector",
    painStatement:
      "Popular menu items can hide waste, commission and labor drag after the plate cost looks fine.",
    freeValue:
      "Plate-level food cost % only — no full profit leak or menu verdict.",
    paidValue:
      "Shows true profit after waste, commission and labor — with a keep, fix or drop verdict.",
    freeInputs: ["ingredientCost", "sellingPrice", "portions"],
    paidInputs: [
      "sellingPrice",
      "ingredientCost",
      "wasteRate",
      "packagingCost",
      "laborCostPerItem",
      "deliveryCommissionRate",
      "targetMargin",
      "monthlyUnitsSold",
    ],
    freeResultPromise:
      "Food cost percentage per portion — useful for menu costing, not a profit leak verdict.",
    paidResultPromise:
      "True margin after waste and fees, monthly leak amount and remove / reprice / keep verdict.",
    verdictLabels: ["PROFITABLE", "LEAKING PROFIT", "REMOVE OR REPRICE"],
    legalDisclaimer: REVENUE_LEGAL_DISCLAIMER,
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
      "Unlock the Menu Profit Leak Detector for waste, commission and labor-adjusted profit with a repricing verdict.",
  },
  {
    sector: "ecommerce",
    freeSlug: "product-margin-calculator",
    paidSlug: "return-rate-profit-erosion-tool",
    freeTitle: "Product Margin Calculator",
    paidTitle: "Return Profit Erosion Tool",
    painStatement:
      "Returns, fees and ad spend can erode SKU profit even when headline margin looks healthy.",
    freeValue:
      "Directional margin % only — no return-adjusted net profit or scale verdict.",
    paidValue:
      "Calculates net profit after returns, shipping, payment fees and ad spend with a scale-or-stop verdict.",
    freeInputs: ["sellingPrice", "productCost", "returnRate"],
    paidInputs: [
      "sellingPrice",
      "productCost",
      "shippingCost",
      "platformFeeRate",
      "paymentFeeRate",
      "returnRate",
      "returnHandlingCost",
      "adCostPerOrder",
      "targetMargin",
    ],
    freeResultPromise:
      "Headline margin from price, cost and return rate — not post-fee net profit.",
    paidResultPromise:
      "Net profit after returns and ad spend, erosion amount and scalable vs. fragile vs. loss verdict.",
    verdictLabels: ["SCALABLE", "FRAGILE", "LOSS AFTER RETURNS"],
    legalDisclaimer: REVENUE_LEGAL_DISCLAIMER,
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
      "Unlock the Return Profit Erosion Tool for post-return net profit, ad impact and a scalable vs. fragile verdict.",
  },
] as const;

/** @deprecated Use REVENUE_TOOL_PRODUCT_SPECS */
export const REVENUE_TOOL_PAIRS = REVENUE_TOOL_PRODUCT_SPECS;

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

const byFreeSlug = new Map(
  REVENUE_TOOL_PRODUCT_SPECS.map((spec) => [spec.freeSlug, spec] as const)
);

const byPaidSlug = new Map(
  REVENUE_TOOL_PRODUCT_SPECS.map((spec) => [spec.paidSlug, spec] as const)
);

export function getRevenueToolByFreeSlug(
  slug: string
): RevenueToolProductSpec | undefined {
  return byFreeSlug.get(slug as ToolSlug);
}

export function getRevenueToolByPremiumSlug(
  slug: string
): RevenueToolProductSpec | undefined {
  return byPaidSlug.get(slug as ToolSlug);
}

/** Alias aligned with paidSlug naming in product spec. */
export function getRevenueToolByPaidSlug(
  slug: string
): RevenueToolProductSpec | undefined {
  return getRevenueToolByPremiumSlug(slug);
}

export function getRevenueToolBySector(
  sector: IndustrySlug
): RevenueToolProductSpec | undefined {
  return REVENUE_TOOL_PRODUCT_SPECS.find((spec) => spec.sector === sector);
}

export function getAllRevenueToolSpecs(): readonly RevenueToolProductSpec[] {
  return REVENUE_TOOL_PRODUCT_SPECS;
}

// ---------------------------------------------------------------------------
// Subscription guard (runtime — unchanged from v1)
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

  const allowed = new Set(revenue.freeInputs);
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
