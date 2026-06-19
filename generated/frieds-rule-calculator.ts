// Auto-generated from frieds-rule-calculator-schema.json
import * as z from 'zod';

export interface Frieds_rule_calculatorInput {
  age: number;
  adultDose: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Frieds_rule_calculatorInputSchema = z.object({
  age: z.number().default(12),
  adultDose: z.number().default(500),
  auto_input_3: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Frieds_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.adultDose * (input.age / 150); results["childDose"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["childDose"] = 0; }
  try { const v = input.adultDose * (input.age / 150); results["childDose___adultDose____age___150_"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["childDose___adultDose____age___150_"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFrieds_rule_calculator(input: Frieds_rule_calculatorInput): Frieds_rule_calculatorOutput {
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


export interface Frieds_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
