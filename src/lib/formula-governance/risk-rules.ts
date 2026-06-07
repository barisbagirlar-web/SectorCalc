/**
 * Risk classification heuristics and critical PASS policy.
 */

import type { AuditFinding, AuditStatus, FormulaContract, RiskLevel } from "@/lib/formula-governance/types";

export {
  CRITICAL_KEYWORDS,
  HIGH_KEYWORDS,
  buildRiskBlob,
  detectRiskFlags,
  hasVisibleDecisionWording,
  matchesKeyword,
  missingCriticalContractReason,
  normalizeRiskText,
  suggestDecisionImpact,
  suggestRiskLevel,
} from "@/lib/formula-governance/risk-scoring";

export function isCriticalRisk(level: RiskLevel): boolean {
  return level === "critical";
}

export function evaluateCriticalPassPolicy(input: {
  contract: FormulaContract;
  findings: AuditFinding[];
  implementedInputKeys: readonly string[];
  oraclePresent: boolean;
  disclaimerPresent: boolean;
}): AuditFinding[] {
  const extra: AuditFinding[] = [];
  const { contract } = input;

  if (!contract.purpose.trim()) {
    extra.push({
      code: "CRIT_NO_PURPOSE",
      severity: "blocker",
      message: "Critical tool must declare a clear business purpose.",
    });
  }

  const missingCritical = contract.criticalInputs.filter(
    (key) => !input.implementedInputKeys.includes(key),
  );
  if (missingCritical.length > 0) {
    extra.push({
      code: "CRIT_MISSING_INPUTS",
      severity: "blocker",
      message: `Missing critical parameters in implementation: ${missingCritical.join(", ")}`,
    });
  }

  const presentScenarios = contract.scenarioTests.filter((s) => s.present).length;
  if (presentScenarios < 5) {
    extra.push({
      code: "CRIT_SCENARIO_TESTS",
      severity: "blocker",
      message: `Critical tool requires at least 5 registered scenario tests (found ${presentScenarios}).`,
    });
  }

  if (!contract.propertyTestsRegistered) {
    extra.push({
      code: "CRIT_PROPERTY_TESTS",
      severity: "blocker",
      message: "Critical tool requires property-based tests (Phase 3 gate).",
    });
  }

  if (contract.oracleRequired && !input.oraclePresent) {
    extra.push({
      code: "CRIT_ORACLE_MISSING",
      severity: "blocker",
      message: "Oracle baseline required but not registered for this tool.",
    });
  }

  if (contract.monotonicityRules.length === 0) {
    extra.push({
      code: "CRIT_MONOTONICITY",
      severity: "blocker",
      message: "Critical tool must declare monotonicity rules.",
    });
  }

  if (!input.disclaimerPresent) {
    extra.push({
      code: "CRIT_DISCLAIMER",
      severity: "blocker",
      message: "Critical tool must include decision-language disclaimer rules.",
    });
  }

  if (contract.missingParameterWarnings.length > 0) {
    extra.push({
      code: "CRIT_UNRESOLVED_WARNINGS",
      severity: "blocker",
      message: `Unresolved missing-parameter warnings: ${contract.missingParameterWarnings.join("; ")}`,
    });
  }

  return extra;
}

export function resolveAuditStatus(findings: AuditFinding[]): AuditStatus {
  if (findings.some((f) => f.severity === "blocker" && f.code.startsWith("DISABLE"))) {
    return "DISABLE_OR_SOFTEN";
  }
  if (findings.some((f) => f.severity === "blocker")) {
    return "FAIL";
  }
  if (findings.some((f) => f.severity === "warning")) {
    return "NEEDS_REVIEW";
  }
  return "PASS";
}
