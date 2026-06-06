import type { LeadPlan, LeadSource } from "@/lib/leads/types";
import {
  FREE_PLAN_PRICING,
  sectorCalcProPricing,
} from "@/lib/pricing/sectorcalc-pro";
import type { CheckoutPlanId } from "@/lib/pricing/plan-catalog";

export interface PricingPlan {
  id: string;
  planId?: CheckoutPlanId | "free" | "consultant_api";
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  comingSoonFeatures?: string[];
  primaryCta: string;
  primaryHref?: string;
  highlighted?: boolean;
  badge?: string;
  /** Live Stripe checkout — only Pro monthly today */
  checkoutPlan?: CheckoutPlanId;
  checkoutReady?: boolean;
  leadIntent?: {
    source: LeadSource;
    plan: LeadPlan;
    toolRequested: string;
  };
}

export const PRICING_ROI_COPY =
  "One avoided bad quote can pay for a full year of Pro.";

export const PRICING_PAGE_H1 = "Choose how you protect your margin.";

/** Prefilled tool/report field when opening lead modal from a pricing plan CTA */
export function getPricingLeadToolLabel(planName: string): string {
  return `${planName} (pricing inquiry)`;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    planId: "free",
    name: "Free Check",
    price: "$0",
    period: "forever",
    description: FREE_PLAN_PRICING.description,
    features: [...FREE_PLAN_PRICING.features],
    comingSoonFeatures: ["No minimum safe price", "No verdict or PDF export"],
    primaryCta: "Run a Free Margin Check",
    primaryHref: "/free-tools",
    checkoutReady: false,
  },
  {
    id: "single-verdict",
    planId: "single_verdict",
    name: "Single Verdict",
    price: "$19",
    period: "one report",
    description:
      "One premium analyzer run with full verdict output — ideal for a single high-stakes quote decision.",
    features: [
      "One premium analyzer verdict",
      "Minimum safe price where applicable",
      "Margin leak breakdown",
      "PDF-ready report for that run",
    ],
    primaryCta: "Get Full Verdict for $19",
    checkoutReady: false,
    leadIntent: {
      source: "pricing",
      plan: "single_report",
      toolRequested: "Single Verdict ($19)",
    },
  },
  {
    id: "pro",
    planId: "pro",
    name: "Pro Monthly",
    price: "$29",
    period: "per month",
    description: sectorCalcProPricing.description,
    features: [...sectorCalcProPricing.bullets],
    primaryCta: "Start SectorCalc Pro",
    highlighted: true,
    badge: "Most popular",
    checkoutPlan: "pro",
    checkoutReady: true,
  },
  {
    id: "pro-annual",
    planId: "pro_annual",
    name: "Pro Annual",
    price: "$249",
    period: "per year",
    description:
      "Full SectorCalc Pro access billed annually — best value for teams quoting weekly.",
    features: [
      "All premium analyzers",
      "Saved verdict reports",
      "PDF export",
      "Priority onboarding when available",
    ],
    primaryCta: "Join Annual Pro Waitlist",
    checkoutReady: false,
    leadIntent: {
      source: "pricing",
      plan: "pro",
      toolRequested: "Pro Annual ($249/year)",
    },
  },
  {
    id: "team",
    planId: "team",
    name: "Team",
    price: "$99",
    period: "per month",
    description:
      "Multi-seat access for estimators, ops leads and field managers — rollout waitlist open.",
    features: [
      "Shared sector analyzer access",
      "Team report history",
      "Admin seat controls (planned)",
      "Volume pricing review",
    ],
    primaryCta: "Join Team Waitlist",
    checkoutReady: false,
    leadIntent: {
      source: "pricing",
      plan: "sector_pass",
      toolRequested: "Team plan ($99/month)",
    },
  },
  {
    id: "consultant-api",
    planId: "consultant_api",
    name: "Consultant / API",
    price: "Waitlist",
    period: "custom",
    description:
      "White-label verdict workflows and API access for consultants and integrators.",
    features: [
      "Consultant workflow interest list",
      "API access preview",
      "Custom sector packs (roadmap)",
      "No self-serve checkout yet",
    ],
    primaryCta: "Join Consultant Waitlist",
    checkoutReady: false,
    leadIntent: {
      source: "pricing",
      plan: "unknown",
      toolRequested: "Consultant / API waitlist",
    },
  },
];

export const PRICING_PRO_TAGLINE = sectorCalcProPricing.headline;

export { sectorCalcProPricing };
