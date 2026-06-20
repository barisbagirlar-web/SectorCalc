// Auto-generated from active-metabolic-rate-calculator-schema.json
import * as z from 'zod';

export interface Active_metabolic_rate_calculatorInput {
  weight: number;
  height: number;
  age: number;
  sex: number;
  activityFactor: number;
  dataConfidence?: number;
}

export const Active_metabolic_rate_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  sex: z.number().default(0),
  activityFactor: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Active_metabolic_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age + (input.sex * 166 - 161); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bmr"])) * input.activityFactor; results["amr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["amr"] = Number.NaN; }
  try { const v = input.activityFactor; results["activityMultiplier"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["activityMultiplier"] = Number.NaN; }
  return results;
}


export function calculateActive_metabolic_rate_calculator(input: Active_metabolic_rate_calculatorInput): Active_metabolic_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["amr"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Active_metabolic_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
