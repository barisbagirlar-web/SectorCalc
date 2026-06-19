// Auto-generated from baby-calorie-calculator-schema.json
import * as z from 'zod';

export interface Baby_calorie_calculatorInput {
  weight: number;
  age: number;
  feedingMultiplier: number;
  solidCalories: number;
  dataConfidence?: number;
}

export const Baby_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(4.5),
  age: z.number().default(2),
  feedingMultiplier: z.number().default(1),
  solidCalories: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Baby_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * input.age * input.feedingMultiplier * input.solidCalories; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.weight * input.age * input.feedingMultiplier * input.solidCalories; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBaby_calorie_calculator(input: Baby_calorie_calculatorInput): Baby_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Baby_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
