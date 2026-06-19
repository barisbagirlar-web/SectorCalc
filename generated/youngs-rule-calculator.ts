// Auto-generated from youngs-rule-calculator-schema.json
import * as z from 'zod';

export interface Youngs_rule_calculatorInput {
  age: number;
  adultDose: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Youngs_rule_calculatorInputSchema = z.object({
  age: z.number().default(2),
  adultDose: z.number().default(500),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Youngs_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.adultDose * input.age / (input.age + 12); results["childDose"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["childDose"] = 0; }
  try { const v = input.adultDose * input.age / (input.age + 12); results["childDose___adultDose___age____age___12_"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["childDose___adultDose___age____age___12_"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateYoungs_rule_calculator(input: Youngs_rule_calculatorInput): Youngs_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["childDose"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Youngs_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
