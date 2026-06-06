import {
  FREE_PLAN_PRICING,
  SECTORCALC_PRO_PRICE_LABEL,
  SECTORCALC_PRO_PRICING,
} from "@/lib/tools/revenue-tools";

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
    id: FREE_PLAN_PRICING.id,
    name: FREE_PLAN_PRICING.name,
    price: FREE_PLAN_PRICING.priceLabel,
    period: FREE_PLAN_PRICING.period,
    description: FREE_PLAN_PRICING.description,
    features: [...FREE_PLAN_PRICING.features],
    comingSoonFeatures: [...SECTORCALC_PRO_PRICING.freePlanContrast],
    primaryCta: "Start with Free Tools",
    primaryHref: "/free-tools",
  },
  {
    id: SECTORCALC_PRO_PRICING.id,
    name: SECTORCALC_PRO_PRICING.name,
    price: SECTORCALC_PRO_PRICING.priceLabel.replace("/month", ""),
    period: "per month",
    description: SECTORCALC_PRO_PRICING.description,
    features: [...SECTORCALC_PRO_PRICING.features],
    comingSoonFeatures: [...SECTORCALC_PRO_PRICING.laterRelease],
    primaryCta: "Unlock Decision Analyzers",
    primaryHref: "/pricing",
    highlighted: true,
    badge: "Decision analyzers",
    checkoutPlan: "pro",
  },
];

export const PRICING_PRO_TAGLINE = SECTORCALC_PRO_PRICING.tagline;

/** Re-export for components that need the locked price label. */
export { SECTORCALC_PRO_PRICE_LABEL };
