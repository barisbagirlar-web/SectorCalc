import {
  FREE_PLAN_PRICING,
  sectorCalcProPricing,
  SECTORCALC_PRO_PRICE_LABEL,
  SECTORCALC_PRO_PRICING,
} from "@/lib/pricing/sectorcalc-pro";

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
    id: "pro",
    name: sectorCalcProPricing.planName,
    price: `$${sectorCalcProPricing.priceMonthly}`,
    period: "per month",
    description: sectorCalcProPricing.description,
    features: [...sectorCalcProPricing.bullets.slice(0, 5)],
    comingSoonFeatures: [...sectorCalcProPricing.bullets.slice(5)],
    primaryCta: "Unlock Decision Analyzers",
    primaryHref: "/pricing",
    highlighted: true,
    badge: "Decision analyzers",
    checkoutPlan: "pro",
  },
];

export const PRICING_PRO_TAGLINE = sectorCalcProPricing.headline;

export { SECTORCALC_PRO_PRICE_LABEL, sectorCalcProPricing };
