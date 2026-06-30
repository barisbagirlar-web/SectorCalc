import type {
  RuntimeTrustDecision,
  RuntimeTrustFinding,
} from "@/lib/features/tools/runtime-trust-engine";
import type { RuntimeToolTier } from "@/lib/features/tools/runtime-readiness";

/** ERT-1 — controlled revenue recovery calibration (no fake Formula Gate). */
export const ERT1_CALIBRATION_ID = "ert-1-revenue-recovery";

export function isPremiumPaymentSurfaceTier(tier: RuntimeToolTier): boolean {
  return tier === "premium" || tier === "premium-schema";
}

/**
 * Free / unknown tiers never receive payment or Formula Gate on any surface.
 * Premium tiers keep deterministic trust output when all gates pass.
 */
export function applyErt1PaymentSurfacePolicy(
  decision: RuntimeTrustDecision,
): RuntimeTrustDecision {
  if (isPremiumPaymentSurfaceTier(decision.tier) && !decision.route.startsWith("/tools/free/")) {
    return decision;
  }

  const findings: RuntimeTrustFinding[] = [...decision.findings];
  const realBlockers = findings.filter(
    (finding) => finding !== "formula_gate_not_safe" && finding !== "payment_not_safe",
  );

  if (decision.formulaGateEligible && !findings.includes("formula_gate_not_safe")) {
    findings.push("formula_gate_not_safe");
  }

  if (decision.paymentEligible && !findings.includes("payment_not_safe")) {
    findings.push("payment_not_safe");
  }

  const calculationEligible = true;

  return {
    ...decision,
    formulaGateEligible: false,
    paymentEligible: false,
    calculationEligible,
    findings,
    recommendedAction:
      decision.status === "blocked"
        ? "block_payment"
        : calculationEligible
          ? "safe_review"
          : "manual_review",
  };
}
