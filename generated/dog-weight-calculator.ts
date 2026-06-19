// Auto-generated from dog-weight-calculator-schema.json
import * as z from 'zod';

export interface Dog_weight_calculatorInput {
  age: number;
  currentWeight: number;
  growthRate: number;
  bcs: number;
  dataConfidence?: number;
}

export const Dog_weight_calculatorInputSchema = z.object({
  age: z.number().default(6),
  currentWeight: z.number().default(10),
  growthRate: z.number().default(0.2),
  bcs: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dog_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentWeight * (1 - (input.bcs - 5) * 0.1); results["idealWeightBasedOnBCS"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["idealWeightBasedOnBCS"] = 0; }
  try { const v = input.currentWeight * (1 - (input.bcs - 5) * 0.1); results["idealWeightBasedOnBCS_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["idealWeightBasedOnBCS_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDog_weight_calculator(input: Dog_weight_calculatorInput): Dog_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["idealWeightBasedOnBCS_aux"]));
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


export interface Dog_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
