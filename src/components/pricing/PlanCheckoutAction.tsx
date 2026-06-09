"use client";

import { StripePlanCheckoutButton } from "@/components/subscription/ProCheckoutButton";
import { SingleVerdictCheckoutButton } from "@/components/subscription/SingleVerdictCheckoutButton";
import { Link } from "@/i18n/routing";
import {
 PLAN_CATALOG,
 type CheckoutPlanId,
} from "@/lib/pricing/plan-catalog";
import type { PricingPlan } from "@/data/pricing-plans";
import { useTranslations } from "next-intl";

type PlanCheckoutActionProps = {
 plan: PricingPlan;
 checkoutToolSlug?: string;
 className?: string;
 highlighted?: boolean;
};

const SUBSCRIPTION_CHECKOUT_PLANS = ["pro", "pro_annual", "team"] as const;

type SubscriptionCheckoutPlan = (typeof SUBSCRIPTION_CHECKOUT_PLANS)[number];

function isSubscriptionCheckoutPlan(
 plan: CheckoutPlanId
): plan is SubscriptionCheckoutPlan {
 return (SUBSCRIPTION_CHECKOUT_PLANS as readonly string[]).includes(plan);
}

export function PlanCheckoutAction({
 plan,
 checkoutToolSlug,
 className = "mt-8 w-full",
}: PlanCheckoutActionProps) {
 if (plan.checkoutPlan && plan.checkoutReady && isSubscriptionCheckoutPlan(plan.checkoutPlan)) {
 return (
 <StripePlanCheckoutButton
 plan={plan.checkoutPlan}
 label={plan.primaryCta}
 className={className}
 source="pricing_grid"
 toolSlug={checkoutToolSlug}
    ctaId={plan.id === "team" ? "pricing_team_start" : plan.id === "pro" ? "pricing_pro_start" : "pricing_single_start"}
 hideWhenProActive={plan.checkoutPlan === "pro" || plan.checkoutPlan === "pro_annual"}
 />
 );
 }

 if (plan.checkoutPlan === "single_verdict" && plan.checkoutReady) {
 return (
 <div className={className}>
 <SingleVerdictCheckoutButton
 toolSlug={checkoutToolSlug}
 returnPath="/pricing"
 label={plan.primaryCta}
 source="pricing_grid"
 />
 </div>
 );
 }

 if (plan.primaryHref) {
 return (
 <Link href={plan.primaryHref} className={`sc-btn-primary inline-flex ${className}`}>
 {plan.primaryCta}
 </Link>
 );
 }

 return null;
}

export function PlanAvailabilityBadge({
 planId,
}: {
 planId: CheckoutPlanId | "free";
}) {
 const t = useTranslations("pricing");
 const entry = PLAN_CATALOG[planId];
 if (entry.availability === "live") {
 return (
 <span className="text-[10px] font-bold uppercase tracking-wider text-deep-navy">
 {t("availableNow")}
 </span>
 );
 }
 return (
 <span className="text-[10px] font-bold uppercase tracking-wider text-amber">
 {t("waitlist")}
 </span>
 );
}

export { SingleVerdictUpsellButton } from "@/components/subscription/SingleVerdictCheckoutButton";
