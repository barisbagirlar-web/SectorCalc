import {
  evaluateRuntimeReadiness,
  type RuntimeReadinessFinding,
} from "@/lib/tools/runtime-readiness";
import { isToolBackingActivationEligible, P8_SAFETY_BLOCKED_SLUGS } from "@/lib/tools/tool-backing-detector";
import { ERT_PROBLEM_SLUG } from "@/lib/tools/runtime-trust-engine";

const FORM_BLOCKING_FINDINGS: ReadonlySet<RuntimeReadinessFinding> = new Set([
  "missing_active_route",
  "missing_form_schema",
  "missing_formula_contract",
  "missing_result_renderer",
  "placeholder_only_result",
]);

export function isHardLockedToolSlug(slug: string): boolean {
  return slug.trim() === ERT_PROBLEM_SLUG;
}

export type ToolFormPresenceInput = {
  readonly slug: string;
  readonly locale?: string;
  readonly surface?: "free" | "premium";
};

/** Whether the calculator input shell should render (independent of payment / Formula Gate). */
export function resolveToolFormPresence(input: ToolFormPresenceInput): boolean {
  const slug = input.slug.trim();
  if (!slug || isHardLockedToolSlug(slug) || P8_SAFETY_BLOCKED_SLUGS.has(slug)) {
    return false;
  }

  if (isToolBackingActivationEligible(slug)) {
    return true;
  }

  const readiness = evaluateRuntimeReadiness(input);
  if (readiness.status === "blocked") {
    return false;
  }

  if (readiness.findings.some((finding) => FORM_BLOCKING_FINDINGS.has(finding))) {
    return false;
  }

  return true;
}

/** Free tools calculate in-browser; premium keeps payment/trust gating on submit. */
export function resolveToolCalculationAllowed(
  input: ToolFormPresenceInput & {
    readonly calculationEligible: boolean;
    readonly tier: string;
  },
): boolean {
  if (!resolveToolFormPresence(input)) {
    return false;
  }
  if (input.tier === "free") {
    return true;
  }
  return input.calculationEligible;
}
