/**
 * Dimensional validation — units, periods, percentages, currencies.
 */

import type { AuditFinding, FormulaContract, ValidationRule } from "@/lib/formula-governance/types";

const PERCENT_HINTS = ["percent", "pct", "rate", "margin", "yield", "apr", "interest"];
const TIME_HINTS = ["year", "month", "day", "hour", "minute", "term", "duration"];
const CURRENCY_HINTS = ["price", "cost", "rent", "payment", "budget", "salary", "fee"];

export function auditDimensionalRules(
  contract: FormulaContract,
  implementedInputKeys: readonly string[],
): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const dimensionalRules = contract.validationRules.filter((r) => r.kind === "dimensional");

  if (contract.riskLevel === "critical" && dimensionalRules.length === 0) {
    findings.push({
      code: "DIM_NO_RULES",
      severity: "blocker",
      message: "Critical tool must declare dimensional validation rules.",
    });
  }

  for (const rule of dimensionalRules) {
    findings.push({
      code: `DIM_RULE_${rule.id}`,
      severity: "info",
      message: `Dimensional rule registered: ${rule.description}`,
    });
  }

  for (const key of contract.criticalInputs) {
    const normalized = key.toLowerCase();
    const isPercent = PERCENT_HINTS.some((h) => normalized.includes(h));
    const isTime = TIME_HINTS.some((h) => normalized.includes(h));
    const isCurrency = CURRENCY_HINTS.some((h) => normalized.includes(h));

    if (isPercent && normalized.includes("year") && normalized.includes("rate")) {
      findings.push({
        code: "DIM_PERCENT_PERIOD",
        severity: "info",
        message: `Input "${key}" appears to combine rate and period — verify annualization.`,
      });
    }

    if (!implementedInputKeys.includes(key) && (isPercent || isTime || isCurrency)) {
      findings.push({
        code: "DIM_MISSING_CRITICAL",
        severity: "blocker",
        message: `Dimensional critical input "${key}" is not exposed in the tool UI.`,
      });
    }
  }

  return findings;
}

export function hasDimensionalCoverage(rules: readonly ValidationRule[]): boolean {
  return rules.some((r) => r.kind === "dimensional");
}
