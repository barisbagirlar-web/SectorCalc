// SectorCalc SuperV4 V5.3 — Physical Bounds Guard
// Enforces physical hard bounds on normalized inputs before formula execution.

import type { PhysicalHardBounds, Severity } from "../pro-form/contract-types";

export interface BoundsCheckResult {
  passed: boolean;
  violations: Array<{
    inputId: string;
    value: number;
    bound: PhysicalHardBounds;
    severity: Severity;
    message: string;
  }>;
}

export function checkPhysicalBounds(
  inputs: Array<{
    id: string;
    physical_hard_bounds?: PhysicalHardBounds;
  }>,
  values: Record<string, number>,
): BoundsCheckResult {
  const violations: BoundsCheckResult["violations"] = [];

  for (const inp of inputs) {
    const hb = inp.physical_hard_bounds;
    if (!hb) continue;

    const value = values[inp.id];
    if (value === undefined || value === null) continue;

    if (!Number.isFinite(value)) {
      violations.push({
        inputId: inp.id,
        value,
        bound: hb,
        severity: "BLOCKED",
        message: `Non-finite value ${value} for input ${inp.id}`,
      });
      continue;
    }

    if (hb.min !== null && value < hb.min) {
      violations.push({
        inputId: inp.id,
        value,
        bound: hb,
        severity: hb.violation_behavior === "BLOCK" ? "BLOCKED" : hb.violation_behavior === "REVIEW" ? "REVIEW" : "WARNING",
        message: hb.semantic_error_message || `Input ${inp.id} value ${value} is below physical minimum ${hb.min} ${hb.unit}`,
      });
    }

    if (hb.max !== null && value > hb.max) {
      violations.push({
        inputId: inp.id,
        value,
        bound: hb,
        severity: hb.violation_behavior === "BLOCK" ? "BLOCKED" : hb.violation_behavior === "REVIEW" ? "REVIEW" : "WARNING",
        message: hb.semantic_error_message || `Input ${inp.id} value ${value} exceeds physical maximum ${hb.max} ${hb.unit}`,
      });
    }
  }

  return {
    passed: violations.filter((v) => v.severity === "BLOCKED").length === 0,
    violations,
  };
}

export function hasBlockingViolation(result: BoundsCheckResult): boolean {
  return result.violations.some((v) => v.severity === "BLOCKED");
}
