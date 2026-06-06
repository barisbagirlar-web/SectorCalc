import { LeadIntentTrigger } from "@/components/leads/LeadIntentTrigger";
import { ProCheckoutButton } from "@/components/subscription/ProCheckoutButton";
import Link from "next/link";
import {
  PLAN_CATALOG,
  type CheckoutPlanId,
} from "@/lib/pricing/plan-catalog";
import type { PricingPlan } from "@/data/pricing-plans";

type PlanCheckoutActionProps = {
  plan: PricingPlan;
  checkoutToolSlug?: string;
  className?: string;
  highlighted?: boolean;
};

export function PlanCheckoutAction({
  plan,
  checkoutToolSlug,
  className = "mt-8 w-full",
  highlighted = false,
}: PlanCheckoutActionProps) {
  const leadButtonClass = highlighted
    ? "bg-cyan text-deep-navy hover:bg-cyan/90"
    : "bg-professional-blue text-white hover:bg-blue-700";

  if (plan.checkoutPlan === "pro" && plan.checkoutReady) {
    return (
      <div className={className}>
        <ProCheckoutButton
          label={plan.primaryCta}
          source="pricing_grid"
          toolSlug={checkoutToolSlug}
        />
      </div>
    );
  }

  if (plan.leadIntent) {
    return (
      <LeadIntentTrigger
        source={plan.leadIntent.source}
        plan={plan.leadIntent.plan}
        toolRequested={plan.leadIntent.toolRequested}
        pagePath="/pricing"
        className={`inline-flex min-h-[44px] w-full items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors ${leadButtonClass} ${className}`}
      >
        {plan.primaryCta}
      </LeadIntentTrigger>
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
  planId: CheckoutPlanId | "free" | "consultant_api";
}) {
  const entry = PLAN_CATALOG[planId];
  if (entry.availability === "live") {
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald">
        Available now
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider text-amber">
      Waitlist
    </span>
  );
}

export function SingleVerdictUpsellButton({
  toolTitle,
  pagePath,
  className = "sc-btn-primary inline-flex w-full sm:w-auto",
}: {
  toolTitle: string;
  pagePath: string;
  className?: string;
}) {
  return (
    <LeadIntentTrigger
      source="premium_unlock"
      plan="single_report"
      toolRequested={`${toolTitle} — Get Full Verdict for $19`}
      pagePath={pagePath}
      className={className}
    >
      Get Full Verdict for $19
    </LeadIntentTrigger>
  );
}
