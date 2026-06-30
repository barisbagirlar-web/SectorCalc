/**
 * Phase 5D — classified warning policy for critical FormulaContracts.
 * Replaces blind CRIT_UNRESOLVED_WARNINGS on all missingParameterWarnings.
 */

import type {
  AuditFinding,
  FormulaContract,
  FormulaWarningPolicy,
  WarningPolicySummary,
} from "@/lib/features/formula-governance/types";

export const EMPTY_WARNING_POLICY: FormulaWarningPolicy = {
  acceptedAssumptions: [],
  modelLimitations: [],
  futureExtensions: [],
  hardFailWarnings: [],
};

export function createWarningPolicy(
  policy: Partial<FormulaWarningPolicy>,
): FormulaWarningPolicy {
  return {
    acceptedAssumptions: policy.acceptedAssumptions ?? [],
    modelLimitations: policy.modelLimitations ?? [],
    futureExtensions: policy.futureExtensions ?? [],
    hardFailWarnings: policy.hardFailWarnings ?? [],
  };
}

function allClassifiedMessages(policy: FormulaWarningPolicy): readonly string[] {
  return [
    ...policy.acceptedAssumptions,
    ...policy.modelLimitations,
    ...policy.futureExtensions,
    ...policy.hardFailWarnings,
  ];
}

export function resolveEffectiveWarningPolicy(contract: FormulaContract): {
  readonly policy: FormulaWarningPolicy;
  readonly unclassified: readonly string[];
} {
  const policy = contract.warningPolicy ?? EMPTY_WARNING_POLICY;
  const classified = new Set(allClassifiedMessages(policy));
  const unclassified = contract.missingParameterWarnings.filter((msg) => !classified.has(msg));

  return { policy, unclassified };
}

export function summarizeWarningPolicy(
  contract: FormulaContract,
): WarningPolicySummary {
  const { policy, unclassified } = resolveEffectiveWarningPolicy(contract);

  const summary: WarningPolicySummary = {
    acceptedAssumptionsCount: policy.acceptedAssumptions.length,
    modelLimitationsCount: policy.modelLimitations.length,
    futureExtensionsCount: policy.futureExtensions.length,
    hardFailWarningsCount: policy.hardFailWarnings.length,
    unclassifiedWarningsCount: unclassified.length,
  };

  const statusChangeReason = buildStatusChangeReason(summary);
  return statusChangeReason ? { ...summary, statusChangeReason } : summary;
}

function buildStatusChangeReason(summary: WarningPolicySummary): string | undefined {
  const parts: string[] = [];

  if (summary.hardFailWarningsCount > 0) {
    parts.push(`${summary.hardFailWarningsCount} hard-fail warning(s)`);
  }
  if (summary.unclassifiedWarningsCount > 0) {
    parts.push(`${summary.unclassifiedWarningsCount} unclassified warning(s)`);
  }
  if (summary.modelLimitationsCount > 0) {
    parts.push(`${summary.modelLimitationsCount} model limitation(s)`);
  }
  if (summary.futureExtensionsCount > 0) {
    parts.push(`${summary.futureExtensionsCount} future extension(s)`);
  }
  if (summary.acceptedAssumptionsCount > 0) {
    parts.push(`${summary.acceptedAssumptionsCount} accepted assumption(s)`);
  }

  if (parts.length === 0) {
    return undefined;
  }

  return parts.join("; ");
}

export function evaluateWarningPolicy(contract: FormulaContract): {
  readonly findings: readonly AuditFinding[];
  readonly summary: WarningPolicySummary;
  readonly statusChangeReason?: string;
} {
  const findings: AuditFinding[] = [];
  const { policy, unclassified } = resolveEffectiveWarningPolicy(contract);
  const summary = summarizeWarningPolicy(contract);

  if (policy.hardFailWarnings.length > 0) {
    findings.push({
      code: "CRIT_HARD_FAIL_WARNINGS",
      severity: "blocker",
      message: `Hard-fail missing-parameter warnings: ${policy.hardFailWarnings.join("; ")}`,
    });
  }

  if (unclassified.length > 0) {
    findings.push({
      code: "CRIT_UNRESOLVED_WARNINGS",
      severity: "blocker",
      message: `Unclassified missing-parameter warnings (assign to warningPolicy): ${unclassified.join("; ")}`,
    });
  } else if (
    !contract.warningPolicy &&
    contract.missingParameterWarnings.length > 0
  ) {
    findings.push({
      code: "CRIT_UNRESOLVED_WARNINGS",
      severity: "blocker",
      message: `Unresolved missing-parameter warnings: ${contract.missingParameterWarnings.join("; ")}`,
    });
  }

  if (policy.modelLimitations.length > 0) {
    findings.push({
      code: "WARN_MODEL_LIMITATIONS",
      severity: "warning",
      message: `Model limitations (${policy.modelLimitations.length}): ${policy.modelLimitations.join("; ")}`,
    });
  }

  if (policy.futureExtensions.length > 0) {
    findings.push({
      code: "WARN_FUTURE_EXTENSIONS",
      severity: "warning",
      message: `Required future extensions (${policy.futureExtensions.length}): ${policy.futureExtensions.join("; ")}`,
    });
  }

  if (policy.acceptedAssumptions.length > 0) {
    findings.push({
      code: "INFO_ACCEPTED_ASSUMPTIONS",
      severity: "info",
      message: `Accepted assumptions (${policy.acceptedAssumptions.length}): ${policy.acceptedAssumptions.join("; ")}`,
    });
  }

  const statusChangeReason = summary.statusChangeReason;

  return {
    findings,
    summary,
    statusChangeReason,
  };
}
