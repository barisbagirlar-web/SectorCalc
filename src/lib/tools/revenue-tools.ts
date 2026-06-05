import type { IndustrySlug } from "@/data/industries";
import type { ToolDefinition, ToolResult } from "@/data/tool-schema";
import type { ToolSlug } from "@/data/tools";
import { getToolHref } from "@/lib/tools/paths";

export const REVENUE_LEGAL_DISCLAIMER =
  "Estimates only. Not financial, legal or engineering advice. Verify before business decisions. Digital product. No refunds.";

export const SECTORCALC_PRO_PRICE = 29;
export const SECTORCALC_PRO_PRICE_LABEL = "$29/month";

export type FreeResultType = "quick_check" | "risk_signal";
export type PaidResultType = "decision_verdict";

export interface RevenueToolPair {
  sector: IndustrySlug;
  freeSlug: ToolSlug;
  premiumSlug: ToolSlug;
  freeTitle: string;
  premiumTitle: string;
  freeInputIds: readonly string[];
  freeResultIds: readonly string[];
  freeResultType: FreeResultType;
  paidResultType: PaidResultType;
  verdictLabels: readonly string[];
  painStatement: string;
  paidValueStatement: string;
  freeRiskHint: string;
  premiumTeaserTitle: string;
  premiumTeaserText: string;
}

export const REVENUE_TOOL_PAIRS: readonly RevenueToolPair[] = [
  {
    sector: "construction",
    freeSlug: "project-cost-estimator",
    premiumSlug: "change-order-impact-analyzer",
    freeTitle: "Project Cost Quick Check",
    premiumTitle: "Change Order Impact Analyzer",
    freeInputIds: ["materialCost", "laborHours", "laborHourlyRate"],
    freeResultIds: ["estimatedProjectCost"],
    freeResultType: "risk_signal",
    paidResultType: "decision_verdict",
    verdictLabels: [
      "ACCEPT",
      "RENEGOTIATE",
      "DO NOT ACCEPT WITHOUT PRICE ADJUSTMENT",
    ],
    painStatement:
      "Change orders often move forward without a clear view of margin, delay cost and extra workload.",
    paidValueStatement:
      "Calculates how a change order affects margin, delay cost and added workload on the full project.",
    freeRiskHint:
      "Directional project cost only — no safe price or accept/reject verdict.",
    premiumTeaserTitle: "Need a change-order decision?",
    premiumTeaserText:
      "Unlock the Change Order Impact Analyzer for minimum safe change price, margin impact, delay cost and an accept/renegotiate verdict.",
  },
  {
    sector: "cleaning",
    freeSlug: "cleaning-cost-estimator",
    premiumSlug: "office-cleaning-bid-optimizer",
    freeTitle: "Cleaning Cost Quick Estimate",
    premiumTitle: "Office Cleaning Bid Optimizer",
    freeInputIds: ["area", "estimatedHours", "laborHourlyCost"],
    freeResultIds: ["totalCost"],
    freeResultType: "risk_signal",
    paidResultType: "decision_verdict",
    verdictLabels: ["SAFE BID", "LOW MARGIN", "UNDERPRICED"],
    painStatement:
      "Recurring office contracts are often priced before crew load, supplies and target margin are visible.",
    paidValueStatement:
      "Calculates minimum monthly bid, labor load, supply cost and target margin for recurring office work.",
    freeRiskHint:
      "Quick job cost range only — no minimum monthly bid or margin verdict.",
    premiumTeaserTitle: "Pricing a recurring office contract?",
    premiumTeaserText:
      "Unlock the Office Cleaning Bid Optimizer for minimum safe monthly bid, margin at budget and underpriced risk signals.",
  },
  {
    sector: "restaurant",
    freeSlug: "food-cost-calculator",
    premiumSlug: "menu-profit-leak-detector",
    freeTitle: "Food Cost Quick Calculator",
    premiumTitle: "Menu Profit Leak Detector",
    freeInputIds: ["ingredientCost", "sellingPrice", "portions"],
    freeResultIds: ["foodCostPercentage"],
    freeResultType: "risk_signal",
    paidResultType: "decision_verdict",
    verdictLabels: ["PROFITABLE", "LEAKING PROFIT", "REMOVE OR REPRICE"],
    painStatement:
      "Popular menu items can hide waste, commission and labor drag after the plate cost looks fine.",
    paidValueStatement:
      "Shows true profit after waste, commission, labor and portion cost — with a keep, fix or drop verdict.",
    freeRiskHint:
      "Plate-level food cost % only — no full profit leak or menu verdict.",
    premiumTeaserTitle: "Is this menu item actually profitable?",
    premiumTeaserText:
      "Unlock the Menu Profit Leak Detector for waste, commission and labor-adjusted profit with a repricing verdict.",
  },
  {
    sector: "ecommerce",
    freeSlug: "product-margin-calculator",
    premiumSlug: "return-rate-profit-erosion-tool",
    freeTitle: "Product Margin Quick Check",
    premiumTitle: "Return Rate Profit Erosion Tool",
    freeInputIds: ["sellingPrice", "productCost", "returnRate"],
    freeResultIds: ["margin"],
    freeResultType: "risk_signal",
    paidResultType: "decision_verdict",
    verdictLabels: ["SCALABLE", "FRAGILE", "LOSS AFTER RETURNS"],
    painStatement:
      "Returns, fees and ad spend can erode SKU profit even when headline margin looks healthy.",
    paidValueStatement:
      "Calculates net profit after returns, shipping, payment fees and ad spend with a scale-or-stop verdict.",
    freeRiskHint:
      "Directional margin % only — no return-adjusted net profit verdict.",
    premiumTeaserTitle: "Can this SKU scale after returns?",
    premiumTeaserText:
      "Unlock the Return Rate Profit Erosion Tool for post-return net profit, ad impact and a scalable vs fragile verdict.",
  },
  {
    sector: "cnc-manufacturing",
    freeSlug: "machine-hour-estimator",
    premiumSlug: "cnc-minimum-safe-quote-analyzer",
    freeTitle: "Machine Hour Quick Estimate",
    premiumTitle: "One-Off Job Death Line",
    freeInputIds: ["monthlyMachineCost", "availableHours", "utilizationRate"],
    freeResultIds: ["machineHourCost"],
    freeResultType: "risk_signal",
    paidResultType: "decision_verdict",
    verdictLabels: ["DO NOT ACCEPT UNDER $X"],
    painStatement:
      "Low-quantity and one-off jobs often get quoted without a true minimum safe price floor.",
    paidValueStatement:
      "Finds the minimum safe price for one-off or low-volume work so a single job cannot silently lose money.",
    freeRiskHint:
      "Machine-hour benchmark only — no minimum safe quote or do-not-accept floor.",
    premiumTeaserTitle: "Quoting a one-off or low-volume job?",
    premiumTeaserText:
      "Unlock One-Off Job Death Line for the minimum safe price and a do-not-accept-under verdict.",
  },
] as const;

const byFreeSlug = new Map(
  REVENUE_TOOL_PAIRS.map((pair) => [pair.freeSlug, pair] as const)
);

const byPremiumSlug = new Map(
  REVENUE_TOOL_PAIRS.map((pair) => [pair.premiumSlug, pair] as const)
);

export function getRevenueToolByFreeSlug(
  slug: string
): RevenueToolPair | undefined {
  return byFreeSlug.get(slug as ToolSlug);
}

export function getRevenueToolByPremiumSlug(
  slug: string
): RevenueToolPair | undefined {
  return byPremiumSlug.get(slug as ToolSlug);
}

export function getRevenueToolBySector(
  sector: IndustrySlug
): RevenueToolPair | undefined {
  return REVENUE_TOOL_PAIRS.find((pair) => pair.sector === sector);
}

export function isProSubscriptionActive(
  status: string | undefined,
  currentPeriodEnd: string | undefined
): boolean {
  if (status !== "active") {
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

export function applyRevenueToolDisplay(definition: ToolDefinition): ToolDefinition {
  const revenue =
    definition.tier === "free"
      ? getRevenueToolByFreeSlug(definition.slug)
      : getRevenueToolByPremiumSlug(definition.slug);

  if (!revenue) {
    return definition;
  }

  const title =
    definition.tier === "free" ? revenue.freeTitle : revenue.premiumTitle;

  return {
    ...definition,
    title,
    shortDescription:
      definition.tier === "free" ? revenue.freeRiskHint : revenue.paidValueStatement,
    longDescription:
      definition.tier === "free" ? revenue.painStatement : revenue.paidValueStatement,
    premiumTeaser:
      definition.tier === "free"
        ? {
            title: revenue.premiumTeaserTitle,
            text: revenue.premiumTeaserText,
            ctaLabel: "Unlock the decision tool",
            ctaHref: getToolHref("premium", revenue.premiumSlug),
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

  const allowed = new Set(revenue.freeInputIds);
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

