import { getToolHref } from "@/lib/tools/paths";

export type ToolTier = "free" | "premium";

export type ToolSlug =
  | "project-cost-estimator"
  | "cleaning-cost-estimator"
  | "food-cost-calculator"
  | "product-margin-calculator"
  | "machine-hour-estimator"
  | "change-order-impact-analyzer"
  | "office-cleaning-bid-optimizer"
  | "menu-profit-leak-detector"
  | "return-rate-profit-erosion-tool"
  | "cnc-minimum-safe-quote-analyzer";

export interface Tool {
  slug: ToolSlug;
  name: string;
  shortDescription: string;
  description: string;
  tier: ToolTier;
  industrySlug: string;
  href: string;
  comingSoon?: boolean;
}

export const FREE_TOOLS: Tool[] = [
  {
    slug: "project-cost-estimator",
    name: "Project Cost Estimator",
    shortDescription: "Quick construction project cost estimates.",
    description:
      "Estimates total project cost from materials, labor, equipment, overhead and contingency — a fast directional number before you bid.",
    tier: "free",
    industrySlug: "construction",
    href: getToolHref("free", "project-cost-estimator"),
  },
  {
    slug: "cleaning-cost-estimator",
    name: "Cleaning Cost Estimator",
    shortDescription: "Estimate commercial cleaning service costs.",
    description:
      "Estimates job cost from area, crew size, labor hours, supplies and travel — useful before pricing a contract.",
    tier: "free",
    industrySlug: "cleaning",
    href: getToolHref("free", "cleaning-cost-estimator"),
  },
  {
    slug: "food-cost-calculator",
    name: "Food Cost Calculator",
    shortDescription: "Menu item food cost and margin snapshot.",
    description:
      "Estimates plate cost and food cost % from ingredients, portions, waste and selling price.",
    tier: "free",
    industrySlug: "restaurant",
    href: getToolHref("free", "food-cost-calculator"),
  },
  {
    slug: "product-margin-calculator",
    name: "Product Margin Calculator",
    shortDescription: "SKU margin and markup analysis.",
    description:
      "Estimates SKU margin after COGS, shipping, platform fees, payment processing and returns.",
    tier: "free",
    industrySlug: "ecommerce",
    href: getToolHref("free", "product-margin-calculator"),
  },
  {
    slug: "machine-hour-estimator",
    name: "Machine Hour Estimator",
    shortDescription: "CNC and shop machine-hour cost estimates.",
    description:
      "Estimates hourly machine cost from monthly machine, labor, energy, maintenance and overhead spread across productive hours.",
    tier: "free",
    industrySlug: "cnc-manufacturing",
    href: getToolHref("free", "machine-hour-estimator"),
  },
];

export const PREMIUM_TOOLS: Tool[] = [
  {
    slug: "change-order-impact-analyzer",
    name: "Change Order Impact Analyzer",
    shortDescription: "Analyze schedule and cost impact of change orders.",
    description:
      "Analyzes change order pricing, minimum safe price, margin impact on the full project, scenarios and risk level.",
    tier: "premium",
    industrySlug: "construction",
    href: getToolHref("premium", "change-order-impact-analyzer"),
  },
  {
    slug: "office-cleaning-bid-optimizer",
    name: "Office Cleaning Bid Optimizer",
    shortDescription: "Optimize commercial cleaning bids for profit.",
    description:
      "Optimizes recurring office cleaning bids with minimum safe price, budget gap, margin at budget and risk signals.",
    tier: "premium",
    industrySlug: "cleaning",
    href: getToolHref("premium", "office-cleaning-bid-optimizer"),
  },
  {
    slug: "menu-profit-leak-detector",
    name: "Menu Profit Leak Detector",
    shortDescription: "Find menu items eroding restaurant profit.",
    description:
      "Detects menu profit leaks from labor, waste and delivery commission with scenarios and recommendations.",
    tier: "premium",
    industrySlug: "restaurant",
    href: getToolHref("premium", "menu-profit-leak-detector"),
  },
  {
    slug: "return-rate-profit-erosion-tool",
    name: "Return Rate Profit Erosion Tool",
    shortDescription: "Quantify return-rate impact on catalog profit.",
    description:
      "Quantifies return-rate and ad-cost erosion on catalog margin with scenarios and risk signals.",
    tier: "premium",
    industrySlug: "ecommerce",
    href: getToolHref("premium", "return-rate-profit-erosion-tool"),
  },
  {
    slug: "cnc-minimum-safe-quote-analyzer",
    name: "CNC Minimum Safe Quote Analyzer",
    shortDescription: "Determine minimum safe quotes for CNC jobs.",
    description:
      "Calculates minimum safe CNC quote from setup, cycle, tooling, scrap, material and target margin.",
    tier: "premium",
    industrySlug: "cnc-manufacturing",
    href: getToolHref("premium", "cnc-minimum-safe-quote-analyzer"),
  },
];

export const ALL_TOOLS: Tool[] = [...FREE_TOOLS, ...PREMIUM_TOOLS];

export function getToolBySlug(slug: ToolSlug): Tool | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug);
}

export function getToolsByIndustry(industrySlug: string): Tool[] {
  return ALL_TOOLS.filter((t) => t.industrySlug === industrySlug);
}

export function getFreeToolsByIndustry(industrySlug: string): Tool[] {
  return FREE_TOOLS.filter((t) => t.industrySlug === industrySlug);
}

export function getPremiumToolsByIndustry(industrySlug: string): Tool[] {
  return PREMIUM_TOOLS.filter((t) => t.industrySlug === industrySlug);
}

const FREE_TO_PREMIUM_SLUG: Partial<Record<ToolSlug, ToolSlug>> = {
  "project-cost-estimator": "change-order-impact-analyzer",
  "cleaning-cost-estimator": "office-cleaning-bid-optimizer",
  "food-cost-calculator": "menu-profit-leak-detector",
  "product-margin-calculator": "return-rate-profit-erosion-tool",
  "machine-hour-estimator": "cnc-minimum-safe-quote-analyzer",
};

export function getMatchingPremiumTool(freeSlug: ToolSlug): Tool | undefined {
  const premiumSlug = FREE_TO_PREMIUM_SLUG[freeSlug];
  if (!premiumSlug) return undefined;
  return getToolBySlug(premiumSlug);
}
