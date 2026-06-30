/**
 * Invariant engine — evaluates declared formula/ontology invariants.
 */

import type { FormulaNode } from "@/lib/features/formula-governance/calculation-ontology/ontology-types";
import type { CalculationValues } from "@/lib/features/formula-governance/runtime-validation/invariant-types";

function parseComparison(invariant: string, values: CalculationValues): boolean {
  const gteMatch = invariant.match(/^(\w+)\s*>=\s*(\w+|\d+(?:\.\d+)?)$/);
  if (gteMatch) {
    const leftKey = gteMatch[1];
    const rightToken = gteMatch[2];
    if (!leftKey || !rightToken) {
      return true;
    }
    const left = values[leftKey];
    const right = rightToken in values ? values[rightToken] : Number(rightToken);
    if (!Number.isFinite(left) || !Number.isFinite(right)) {
      return false;
    }
    return left >= right;
  }

  const ltMatch = invariant.match(/^(\w+)\s*<\s*(\d+(?:\.\d+)?)$/);
  if (ltMatch) {
    const key = ltMatch[1];
    const bound = ltMatch[2];
    if (!key || !bound) {
      return true;
    }
    const value = values[key];
    if (!Number.isFinite(value)) {
      return false;
    }
    return value < Number(bound);
  }

  return true;
}

export function evaluateInvariants(
  formulaNode: FormulaNode,
  values: CalculationValues,
): readonly string[] {
  const violations: string[] = [];

  for (const invariant of formulaNode.invariants) {
    if (!parseComparison(invariant, values)) {
      violations.push(`Invariant failed: ${invariant}`);
    }
  }

  return violations;
}
