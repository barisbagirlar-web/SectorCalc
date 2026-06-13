import { hasFormulaSourceAudit } from "@/lib/formula-governance/formula-source-audit-registry";
import {
  evaluateRuntimeReadiness,
  type RuntimeReadinessFinding,
  type RuntimeReadinessInput,
  type RuntimeToolTier,
} from "@/lib/tools/runtime-readiness";
import { isP24TrustPassForSlug } from "@/lib/tools/runtime-readiness-p24-verdicts";
import {
  mergeRuntimeHealthWithDecision,
  readRuntimeToolHealth,
} from "@/lib/tools/runtime-health-store";
import { normalizeLocale } from "@/lib/format/localization";
import type { SupportedLocale } from "@/lib/i18n/locale-config";

export type RuntimeTrustStatus = "ready" | "review" | "blocked";

export type RuntimeTrustFinding =
  | RuntimeReadinessFinding
  | "payment_not_safe"
  | "formula_gate_not_safe";

export type RuntimeTrustRecommendedAction =
  | "allow"
  | "safe_review"
  | "block_payment"
  | "manual_review";

export type RuntimeTrustInput = RuntimeReadinessInput & {
  readonly route?: string;
  readonly healthSlug?: string;
};

export type RuntimeTrustDecision = {
  readonly slug: string;
  readonly route: string;
  readonly tier: RuntimeToolTier;
  readonly locale: string;
  readonly status: RuntimeTrustStatus;
  readonly formulaGateEligible: boolean;
  readonly paymentEligible: boolean;
  readonly calculationEligible: boolean;
  readonly findings: readonly RuntimeTrustFinding[];
  readonly recommendedAction: RuntimeTrustRecommendedAction;
};

function resolveRoute(slug: string, surface: "free" | "premium" | undefined): string {
  if (surface === "free") {
    return `/tools/free/${slug}`;
  }
  return `/tools/premium/${slug}`;
}

function deriveRecommendedAction(
  decision: Pick<
    RuntimeTrustDecision,
    "status" | "formulaGateEligible" | "findings" | "recommendedAction"
  >,
): RuntimeTrustRecommendedAction {
  if (decision.formulaGateEligible && decision.status === "ready") {
    return "allow";
  }
  if (decision.status === "blocked") {
    return "block_payment";
  }
  if (
    decision.findings.includes("audit_status_not_pass") ||
    decision.findings.includes("mixed_locale_labels") ||
    decision.findings.includes("generic_input_labels")
  ) {
    return "manual_review";
  }
  return "safe_review";
}

function applyTrustPolicy(
  slug: string,
  locale: SupportedLocale,
  surface: "free" | "premium" | undefined,
  premiumSurfaceUsesFreeCopy: boolean | undefined,
): RuntimeTrustDecision {
  const readiness = evaluateRuntimeReadiness({
    slug,
    locale,
    surface,
    premiumSurfaceUsesFreeCopy,
  });

  const findings: RuntimeTrustFinding[] = [...readiness.findings];
  let status: RuntimeTrustStatus = readiness.status;

  if (!isP24TrustPassForSlug(slug) && !findings.includes("audit_status_not_pass")) {
    findings.push("audit_status_not_pass");
    if (status === "ready") {
      status = "review";
    }
  }

  const registryAudit = hasFormulaSourceAudit(slug);
  let formulaGateEligible =
    registryAudit &&
    readiness.status === "ready" &&
    isP24TrustPassForSlug(slug) &&
    !findings.includes("audit_status_not_pass") &&
    !findings.includes("generic_input_labels") &&
    !findings.includes("mixed_locale_labels") &&
    !findings.includes("tier_copy_mismatch") &&
    !findings.includes("missing_validation") &&
    !findings.includes("missing_formula_contract");

  if (!formulaGateEligible) {
    if (!findings.includes("formula_gate_not_safe")) {
      findings.push("formula_gate_not_safe");
    }
  }

  let paymentEligible = formulaGateEligible && status === "ready";
  let calculationEligible = paymentEligible;

  if (!paymentEligible && !findings.includes("payment_not_safe")) {
    findings.push("payment_not_safe");
  }

  if (status === "blocked") {
    formulaGateEligible = false;
    paymentEligible = false;
    calculationEligible = false;
  }

  const route = resolveRoute(slug, surface);
  const draft: RuntimeTrustDecision = {
    slug,
    route,
    tier: readiness.tier,
    locale,
    status,
    formulaGateEligible,
    paymentEligible,
    calculationEligible,
    findings,
    recommendedAction: "safe_review",
  };

  return {
    ...draft,
    recommendedAction: deriveRecommendedAction(draft),
  };
}

export function evaluateRuntimeTrust(input: RuntimeTrustInput): RuntimeTrustDecision {
  const slug = input.slug.trim();
  const locale = normalizeLocale(input.locale ?? "en") as SupportedLocale;
  const surface = input.surface ?? "premium";
  const healthSlug = input.healthSlug?.trim() || slug;

  const decision = applyTrustPolicy(
    slug,
    locale,
    surface,
    input.premiumSurfaceUsesFreeCopy,
  );

  const withRoute =
    input.route && input.route.trim()
      ? { ...decision, route: input.route.trim() }
      : decision;

  return mergeRuntimeHealthWithDecision(withRoute, readRuntimeToolHealth(healthSlug));
}

export function isFormulaGateTrustEligible(
  slug: string,
  locale?: string,
  surface?: "free" | "premium",
): boolean {
  return evaluateRuntimeTrust({ slug, locale, surface }).formulaGateEligible;
}

export function isPaymentTrustEligible(
  slug: string,
  locale?: string,
  surface?: "free" | "premium",
): boolean {
  return evaluateRuntimeTrust({ slug, locale, surface }).paymentEligible;
}

export function isCalculationTrustEligible(
  slug: string,
  locale?: string,
  surface?: "free" | "premium",
): boolean {
  return evaluateRuntimeTrust({ slug, locale, surface }).calculationEligible;
}

/** Problem slug fixture for ERT-0 regression tests. */
export const ERT_PROBLEM_SLUG = "abonelik-yazilim-cloud-yillik-maliyet-hesabi";
