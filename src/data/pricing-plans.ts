export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  comingSoonFeatures?: string[];
  primaryCta: string;
  primaryHref: string;
  highlighted?: boolean;
  badge?: string;
  checkoutPlan?: "pro";
}

/** Prefilled tool/report field when opening lead modal from a pricing plan CTA */
export function getPricingLeadToolLabel(planName: string): string {
  return `${planName} (pricing inquiry)`;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description:
      "Quick sector checks — limited inputs, directional numbers and early risk signals.",
    features: [
      "Five industry quick-check tools",
      "2–3 inputs per tool",
      "Risk or preview signals",
      "No account required",
    ],
    comingSoonFeatures: [
      "No safe price or accept/reject verdict",
      "No decision summaries",
      "No export",
    ],
    primaryCta: "Start with Free Tools",
    primaryHref: "/free-tools",
  },
  {
    id: "pro",
    name: "SectorCalc Pro",
    price: "$29",
    period: "per month",
    description:
      "Premium decision tools for sector-specific pricing, cost and margin risk.",
    features: [
      "All premium decision tools across five sectors",
      "Minimum safe price verdicts",
      "Margin leak detection",
      "Bid risk analysis",
      "Sector-specific decision summaries",
      "Cancel anytime",
    ],
    comingSoonFeatures: [
      "PDF export in a later release",
      "Estimates only; verify before business decisions",
      "Digital product; no refunds",
    ],
    primaryCta: "Unlock Decision Tools",
    primaryHref: "/pricing",
    highlighted: true,
    badge: "Decision tools",
    checkoutPlan: "pro",
  },
];

export const PRICING_PRO_TAGLINE =
  "Unlock sector-specific decision tools that help prevent underpriced jobs, margin leaks and bad bids.";
