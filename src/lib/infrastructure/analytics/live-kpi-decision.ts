import type { LiveKpiSnapshot } from "@/lib/infrastructure/analytics/live-kpi-model";

export type LiveKpiVerdict =
  | "needs_traffic"
  | "needs_free_tool_ux"
  | "needs_premium_value"
  | "needs_pricing_fix"
  | "needs_checkout_fix"
  | "ready_to_scale";

export type LiveKpiDecision = {
  readonly verdict: LiveKpiVerdict;
  readonly reason: string;
  readonly nextAction: string;
};

const VERDICT_ACTIONS: Record<LiveKpiVerdict, string> = {
  needs_traffic: "Publish, share, and index top campaign cluster landing pages.",
  needs_free_tool_ux: "Fix form clarity and result visibility on high-traffic free tools.",
  needs_premium_value: "Improve premium CTA copy and locked report preview value.",
  needs_pricing_fix: "Clarify pricing plans and strengthen pricing page CTAs.",
  needs_checkout_fix: "Inspect checkout flow, webhook entitlement, and success page.",
  ready_to_scale: "Scale the top-performing campaign cluster and premium analyzer.",
};

const VERDICT_REASONS: Record<LiveKpiVerdict, string> = {
  needs_traffic: "Free tool opens are too low to evaluate conversion quality.",
  needs_free_tool_ux: "Visitors open free tools but rarely complete a calculation.",
  needs_premium_value: "Free calculations happen but premium interest clicks are weak.",
  needs_pricing_fix: "Premium unlock intent exists but pricing CTAs are not converting.",
  needs_checkout_fix: "Checkout sessions start but payments are not completing.",
  ready_to_scale: "Payment or lead signals indicate the funnel is working.",
};

export function getLiveKpiDecision(snapshot: LiveKpiSnapshot): LiveKpiDecision {
  const { traffic, conversion, revenue, leads } = snapshot;

  if (revenue.paymentCompleted > 0 || leads.betaPartnerSubmits >= 2) {
    return buildDecision("ready_to_scale");
  }

  if (revenue.checkoutStarted > 0 && revenue.paymentCompleted === 0) {
    return buildDecision("needs_checkout_fix");
  }

  if (conversion.premiumUnlockClicks > 0 && conversion.pricingCtaClicks === 0) {
    return buildDecision("needs_pricing_fix");
  }

  if (conversion.freeCalculations > 0 && conversion.freeToPremiumClicks === 0) {
    return buildDecision("needs_premium_value");
  }

  if (traffic.freeToolOpens > 0 && conversion.freeCalculations === 0) {
    return buildDecision("needs_free_tool_ux");
  }

  if (traffic.freeToolOpens === 0) {
    return buildDecision("needs_traffic");
  }

  return buildDecision("needs_traffic");
}

function buildDecision(verdict: LiveKpiVerdict): LiveKpiDecision {
  return {
    verdict,
    reason: VERDICT_REASONS[verdict],
    nextAction: VERDICT_ACTIONS[verdict],
  };
}

export function getWeeklyDecision(snapshot: LiveKpiSnapshot): LiveKpiDecision {
  return getLiveKpiDecision(snapshot);
}
