export type RuntimeReadinessStatus = "ready" | "review" | "blocked";

export type RuntimeReadinessFinding =
  | "missing_active_route"
  | "missing_form_schema"
  | "missing_required_inputs"
  | "generic_input_labels"
  | "mixed_locale_labels"
  | "missing_formula_contract"
  | "missing_validation"
  | "missing_submit_handler"
  | "missing_result_renderer"
  | "tier_copy_mismatch"
  | "audit_status_not_pass"
  | "placeholder_only_result";

export type RuntimeToolTier =
  | "free"
  | "premium"
  | "premium-schema"
  | "legacy"
  | "unknown";

export type RuntimeReadinessInput = {
  readonly slug: string;
  readonly locale?: string;
  readonly surface?: "free" | "premium";
  readonly premiumSurfaceUsesFreeCopy?: boolean;
};

export type RuntimeReadinessResult = {
  readonly slug: string;
  readonly tier: RuntimeToolTier;
  readonly status: RuntimeReadinessStatus;
  readonly formulaGateEligible: boolean;
  readonly paymentEligible: boolean;
  readonly findings: readonly RuntimeReadinessFinding[];
};

export function evaluateRuntimeReadiness(input: RuntimeReadinessInput): RuntimeReadinessResult {
  return {
    slug: input.slug,
    tier: "unknown",
    status: "review",
    formulaGateEligible: false,
    paymentEligible: false,
    findings: ["missing_active_route"],
  };
}

export function isFormulaGateEligible(
  slug: string,
  locale?: string,
  surface?: "free" | "premium",
): boolean {
  return false;
}
