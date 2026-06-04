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
    description: "Quick sector estimators for directional cost, margin and capacity numbers.",
    features: [
      "Five industry quick estimators",
      "Immediate results and interpretation notes",
      "No account required",
    ],
    comingSoonFeatures: [
      "No full decision report",
      "No saved calculations",
      "No export package",
    ],
    primaryCta: "Start with Free Tools",
    primaryHref: "/free-tools",
  },
  {
    id: "single-report",
    name: "Single Report",
    price: "Coming soon",
    description: "One premium decision report for a single high-stakes calculation.",
    features: [
      "One premium decision report request",
      "Scenario analysis and risk signals",
      "Report structure preview in MVP",
    ],
    comingSoonFeatures: ["Payment and export coming soon"],
    primaryCta: "Request a Decision Report",
    primaryHref: "/industries",
    badge: "Pay per report",
  },
  {
    id: "sector-pass",
    name: "Sector Pass",
    price: "Coming soon",
    description: "For operators who repeatedly analyze one sector’s margin, pricing and risk.",
    features: [
      "Access one sector’s premium analyzers",
      "Multiple report requests (coming soon)",
      "Scenario and risk analysis",
    ],
    comingSoonFeatures: ["Saved calculations coming soon"],
    primaryCta: "Request Sector Access",
    primaryHref: "/industries",
    highlighted: true,
    badge: "Best for operators",
  },
  {
    id: "pro",
    name: "Pro",
    price: "Coming soon",
    description: "For consultants or teams working across multiple sectors and client engagements.",
    features: [
      "All sectors and premium analyzers",
      "Advanced decision report requests",
      "Priority access to new sector packs",
    ],
    comingSoonFeatures: [
      "Export and calculation history coming soon",
      "White-label flows not live yet",
    ],
    primaryCta: "Request Pro Access",
    primaryHref: "/pricing",
    badge: "Best for consultants",
  },
];
