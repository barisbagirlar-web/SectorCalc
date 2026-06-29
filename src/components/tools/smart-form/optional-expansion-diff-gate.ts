/**
 * Optional field expansion diff gate — Phase 5H-G-I (readiness report only; no payload expansion).
 */

export type OptionalFieldExpansionStatus = "blocked" | "ready";

export type EvaluateOptionalFieldExpansionReadinessParams = {
  readonly slug: string;
  readonly fieldKey: string;
  readonly hasPayloadEquivalenceTest: boolean;
  readonly hasOutputDiffTest: boolean;
  readonly productionMapped: boolean;
  readonly analyticsCovered: boolean;
};

export type OptionalFieldExpansionReadinessResult = {
  readonly slug: string;
  readonly fieldKey: string;
  readonly status: OptionalFieldExpansionStatus;
  readonly blockedReasons: readonly string[];
  readonly ready: boolean;
};

export const OPTIONAL_EXPANSION_BLOCKED_FIELD_EXAMPLES = [
  "failedPrintRate",
  "diagnosticHours",
  "laborRate",
  "hardwareCost",
] as const;

function collectBlockedReasons(
  params: EvaluateOptionalFieldExpansionReadinessParams,
): string[] {
  const reasons: string[] = [];

  if (!params.hasPayloadEquivalenceTest) {
    reasons.push("payload equivalence test missing");
  }
  if (!params.hasOutputDiffTest) {
    reasons.push("output diff test missing");
  }
  if (!params.productionMapped) {
    reasons.push("field is not production-mapped");
  }
  if (!params.analyticsCovered) {
    reasons.push("analytics coverage missing");
  }

  reasons.push("optional expansion remains disabled in Phase 5H-G-I");

  return reasons;
}

export function evaluateOptionalFieldExpansionReadiness(
  params: EvaluateOptionalFieldExpansionReadinessParams,
): OptionalFieldExpansionReadinessResult {
  const blockedReasons = collectBlockedReasons(params);
  const allConditionsMet =
    params.hasPayloadEquivalenceTest &&
    params.hasOutputDiffTest &&
    params.productionMapped &&
    params.analyticsCovered;

  const status: OptionalFieldExpansionStatus =
    allConditionsMet && blockedReasons.length === 0 ? "ready" : "blocked";

  return {
    slug: params.slug,
    fieldKey: params.fieldKey,
    status: "blocked",
    blockedReasons,
    ready: false,
  };
}

export function isOptionalFieldExpansionBlocked(
  params: EvaluateOptionalFieldExpansionReadinessParams,
): boolean {
  return evaluateOptionalFieldExpansionReadiness(params).status === "blocked";
}

export function evaluatePilotOptionalFieldsExpansion(
  slug: string,
  fieldKeys: readonly string[],
): readonly OptionalFieldExpansionReadinessResult[] {
  return fieldKeys.map((fieldKey) =>
    evaluateOptionalFieldExpansionReadiness({
      slug,
      fieldKey,
      hasPayloadEquivalenceTest: false,
      hasOutputDiffTest: false,
      productionMapped: false,
      analyticsCovered: true,
    }),
  );
}
