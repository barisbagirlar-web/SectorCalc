/**
 * Shared heuristics for input design audit scoring (Phase 5H-C).
 */

import type { ToolInputDesign } from "@/lib/formula-governance/requirement-engine/input-design-bridge";
import type { FormulaContract } from "@/lib/formula-governance/types";

const COST_DRIVER_PATTERN =
  /cost|material|labor|rate|hour|fee|price|setup|machine|tooling|overhead|wage|salary|rent|expense/i;
const RISK_DRIVER_PATTERN =
  /risk|buffer|delay|scrap|waste|margin|weather|contingency|uncertainty|volatility/i;

export function isPremiumContract(contract: FormulaContract): boolean {
  return (
    contract.toolId.includes("revenue-premium") ||
    contract.toolId.includes("premium-schema") ||
    (contract.toolId.includes("premium") && !contract.toolId.includes("revenue-free"))
  );
}

export function isFreeQuickCheckContract(contract: FormulaContract): boolean {
  return contract.toolId.includes("free-traffic") || contract.toolId.includes("revenue-free");
}

export function identifyCostDrivers(contract: FormulaContract): readonly string[] {
  const inputs = [...new Set([...contract.criticalInputs, ...contract.requiredInputs])];
  return inputs.filter((id) => COST_DRIVER_PATTERN.test(id));
}

export function identifyRiskDrivers(contract: FormulaContract): readonly string[] {
  const inputs = [...new Set([...contract.criticalInputs, ...contract.requiredInputs])];
  return inputs.filter((id) => RISK_DRIVER_PATTERN.test(id));
}

export function collectDeclaredInputIds(contract: FormulaContract): Set<string> {
  return new Set([...contract.requiredInputs, ...contract.criticalInputs]);
}

export function collectCoveredInputIds(
  requirementMissing: readonly string[],
  inputDesign?: ToolInputDesign,
): Set<string> {
  const covered = new Set<string>();
  if (inputDesign) {
    for (const field of [
      ...inputDesign.requiredFields,
      ...inputDesign.optionalFields,
      ...inputDesign.advancedFields,
      ...inputDesign.defaultedFields,
    ]) {
      covered.add(field.variableId);
    }
  }
  for (const id of requirementMissing) {
    covered.add(id);
  }
  return covered;
}

export function clampScore(value: number, max = 100): number {
  return Math.max(0, Math.min(max, Math.round(value)));
}
