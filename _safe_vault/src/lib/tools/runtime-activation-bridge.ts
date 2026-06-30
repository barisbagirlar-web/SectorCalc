import type {
  RuntimeReadinessFinding,
  RuntimeReadinessResult,
  RuntimeReadinessStatus,
} from "@/lib/tools/runtime-readiness";
import {
  checkToolBacking,
  isToolBackingActivationEligible,
  resolveRuntimeTierFromBacking,
} from "@/lib/tools/tool-backing-detector";
import type {
  RuntimeTrustDecision,
  RuntimeTrustFinding,
  RuntimeTrustRecommendedAction,
  RuntimeTrustStatus,
} from "@/lib/tools/runtime-trust-engine";

const CALC_BLOCKING_FINDINGS: ReadonlySet<RuntimeReadinessFinding> = new Set([
  "missing_active_route",
  "missing_form_schema",
  "missing_formula_contract",
  "missing_result_renderer",
  "placeholder_only_result",
]);

const STALE_AUDIT_FINDING: RuntimeReadinessFinding = "audit_status_not_pass";

function stripStaleAuditFinding<T extends RuntimeReadinessFinding | RuntimeTrustFinding>(
  findings: readonly T[],
): T[] {
  return findings.filter((finding) => finding !== STALE_AUDIT_FINDING);
}

function deriveBridgedReadinessStatus(
  findings: readonly RuntimeReadinessFinding[],
): RuntimeReadinessStatus {
  if (findings.some((finding) => CALC_BLOCKING_FINDINGS.has(finding))) {
    return "blocked";
  }
  if (findings.length > 0) {
    return "review";
  }
  return "ready";
}

/** P8 — sync stale P24 audit findings when deterministic backing is complete. */
export function applyReadinessActivationBridge(
  result: RuntimeReadinessResult,
): RuntimeReadinessResult {
  if (!isToolBackingActivationEligible(result.slug)) {
    return result;
  }

  const findings = stripStaleAuditFinding(result.findings);

  return {
    ...result,
    tier: resolveRuntimeTierFromBacking(result.slug, result.tier),
    status: deriveBridgedReadinessStatus(findings),
    findings,
  };
}

function deriveBridgedRecommendedAction(
  status: RuntimeTrustStatus,
  calculationEligible: boolean,
): RuntimeTrustRecommendedAction {
  if (status === "blocked") {
    return "block_payment";
  }
  if (calculationEligible && status === "ready") {
    return "allow";
  }
  return "safe_review";
}

/** P8 — enable live calculation for backed tools without widening payment / Formula Gate. */
export function applyRuntimeTrustActivationBridge(
  decision: RuntimeTrustDecision,
): RuntimeTrustDecision {
  const backing = checkToolBacking(decision.slug);
  if (!backing.isComplete) {
    return decision;
  }

  const findings = stripStaleAuditFinding(decision.findings);
  const hasCalcBlockers = findings.some((finding) =>
    CALC_BLOCKING_FINDINGS.has(finding as RuntimeReadinessFinding),
  );
  const status: RuntimeTrustStatus = hasCalcBlockers ? decision.status : "ready";

  return {
    ...decision,
    status,
    calculationEligible: !hasCalcBlockers,
    findings,
    recommendedAction: deriveBridgedRecommendedAction(status, !hasCalcBlockers),
  };
}
