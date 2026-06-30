import type { CheckoutPlanId } from "@/lib/pricing/plan-catalog";

/** Translation-key driven plan definition — single global USD price list. */
export type GlobalPricingPlanDef = {
 id: string;
 planId: CheckoutPlanId | "free";
 nameKey: string;
 priceDisplayKey: string;
 periodKey?: string;
 descriptionKey: string;
 featuresKey: string;
 ctaKey: string;
 badgeKey?: string;
 highlighted?: boolean;
 checkoutPlan?: CheckoutPlanId;
 checkoutReady?: boolean;
 primaryHref?: string;
};

export const GLOBAL_PRICING_PLAN_DEFS: GlobalPricingPlanDef[] = [
 {
 id: "free",
 planId: "free",
 nameKey: "pricing.free",
 priceDisplayKey: "pricing.freePrice",
 periodKey: "pricing.freePeriod",
 descriptionKey: "pricing.freeDescription",
 featuresKey: "pricing.freeFeatures",
 ctaKey: "pricing.freeCta",
 primaryHref: "/free-tools",
 },
 {
 id: "single-verdict",
 planId: "single_verdict",
 nameKey: "pricing.single",
 priceDisplayKey: "pricing.singlePrice",
 periodKey: "pricing.singlePeriod",
 descriptionKey: "pricing.singleDescription",
 featuresKey: "pricing.singleFeatures",
 ctaKey: "pricing.singleCta",
 checkoutPlan: "single_verdict",
 checkoutReady: true,
 },
 {
 id: "pro",
 planId: "pro",
 nameKey: "pricing.pro",
 priceDisplayKey: "pricing.proPrice",
 periodKey: "pricing.proPeriod",
 descriptionKey: "pricing.proDescription",
 featuresKey: "pricing.proFeatures",
 ctaKey: "pricing.proCta",
 badgeKey: "pricing.proBadge",
 highlighted: true,
 checkoutPlan: "pro",
 checkoutReady: true,
 },
 {
 id: "pro-annual",
 planId: "pro_annual",
 nameKey: "pricing.proAnnual",
 priceDisplayKey: "pricing.proAnnualPrice",
 periodKey: "pricing.proAnnualPeriod",
 descriptionKey: "pricing.proAnnualDescription",
 featuresKey: "pricing.proAnnualFeatures",
 ctaKey: "pricing.proAnnualCta",
 checkoutPlan: "pro_annual",
 checkoutReady: true,
 },
 {
 id: "team",
 planId: "team",
 nameKey: "pricing.team",
 priceDisplayKey: "pricing.teamPrice",
 periodKey: "pricing.teamPeriod",
 descriptionKey: "pricing.teamDescription",
 featuresKey: "pricing.teamFeatures",
 ctaKey: "pricing.teamCta",
 checkoutPlan: "team",
 checkoutReady: true,
 },
];

export type PricingPlan = {
 id: string;
 planId: CheckoutPlanId | "free";
 name: string;
 price: string;
 period?: string;
 description: string;
 features: string[];
 primaryCta: string;
 primaryHref?: string;
 highlighted?: boolean;
 badge?: string;
 checkoutPlan?: CheckoutPlanId;
 checkoutReady?: boolean;
};

type PricingTranslator = {
 (key: string): string;
 raw(key: string): unknown;
};

export function buildPricingPlans(t: PricingTranslator): PricingPlan[] {
 return GLOBAL_PRICING_PLAN_DEFS.map((def) => {
 const featuresRaw = t.raw(def.featuresKey);
 const features =
 typeof featuresRaw === "string"
 ? featuresRaw.split("|").map((item) => item.trim()).filter(Boolean)
 : [];

 return {
 id: def.id,
 planId: def.planId,
 name: t(def.nameKey),
 price: t(def.priceDisplayKey),
 period: def.periodKey ? t(def.periodKey) : undefined,
 description: t(def.descriptionKey),
 features,
 primaryCta: t(def.ctaKey),
 primaryHref: def.primaryHref,
 highlighted: def.highlighted,
 badge: def.badgeKey ? t(def.badgeKey) : undefined,
 checkoutPlan: def.checkoutPlan,
 checkoutReady: def.checkoutReady,
 };
 });
}

/** @deprecated Use buildPricingPlans(t) in client/server components with next-intl */
export const PRICING_PLANS: PricingPlan[] = [];

export const PRICING_ROI_COPY = "One avoided bad quote can pay for a full year of Pro.";
export const PRICING_PAGE_H1 = "Choose how you protect your margin.";

export { sectorCalcProPricing } from "@/lib/pricing/sectorcalc-pro";
export const PRICING_PRO_TAGLINE = "Pro verdict analyzers turn free risk signals into minimum safe prices.";
