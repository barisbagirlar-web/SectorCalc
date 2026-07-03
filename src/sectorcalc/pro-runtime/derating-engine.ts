// SectorCalc SuperV4 V5.3 — Derating Engine (stub)
// Applies cross-field derating rules. Server-owned execution only.

import type { Severity } from "../pro-form/contract-types";

export interface DeratingRule {
  id: string;
  description: string;
  trigger_inputs: string[];
  condition: string;
  derating_factor: number;
  affected_output: string;
}

export interface DeratingResult {
  applied_rules: Array<{
    rule_id: string;
    description: string;
    derating_factor: number;
    applied: boolean;
  }>;
  warnings: Array<{
    severity: Severity;
    message: string;
  }>;
}

export interface SchemaDeratingContract {
  rules?: DeratingRule[];
}

export function applyDerating(
  rules: DeratingRule[] | undefined,
  _inputs: Record<string, number>,
): DeratingResult {
  if (!rules || rules.length === 0) {
    return { applied_rules: [], warnings: [] };
  }

  const applied_rules: DeratingResult["applied_rules"] = [];
  const warnings: DeratingResult["warnings"] = [];

  for (const rule of rules) {
    // Stub: rules are applied server-side in production
    // Real implementation evaluates condition expressions against normalized inputs
    applied_rules.push({
      rule_id: rule.id,
      description: rule.description,
      derating_factor: 1.0, // stub: no derating applied
      applied: false,
    });
  }

  return { applied_rules, warnings };
}

export function validateDeratingContract(contract: SchemaDeratingContract): string[] {
  const errors: string[] = [];
  if (!contract.rules) return errors;

  for (const rule of contract.rules) {
    if (!rule.id) errors.push("Derating rule missing id");
    if (!Array.isArray(rule.trigger_inputs) || rule.trigger_inputs.length === 0) {
      errors.push(`Derating rule ${rule.id || "(unnamed)"} missing trigger_inputs`);
    }
    if (typeof rule.derating_factor !== "number" || rule.derating_factor <= 0) {
      errors.push(`Derating rule ${rule.id} has invalid derating_factor: ${rule.derating_factor}`);
    }
  }

  return errors;
}
