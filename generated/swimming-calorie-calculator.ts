// Auto-generated from swimming-calorie-calculator-schema.json
import * as z from 'zod';

export interface Swimming_calorie_calculatorInput {
  weight: number;
  durationMinutes: number;
  metValue: number;
  calorieBurnRate: number;
  dataConfidence?: number;
}

export const Swimming_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  durationMinutes: z.number().default(30),
  metValue: z.number().default(8),
  calorieBurnRate: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Swimming_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.metValue * input.weight * (input.durationMinutes / 60) * input.calorieBurnRate; results["totalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = (asFormulaNumber(results["totalCalories"])) / input.durationMinutes; results["caloriesPerMinute"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  try { const v = (asFormulaNumber(results["caloriesPerMinute"])) * 60; results["caloriesPerHour"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesPerHour"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSwimming_calorie_calculator(input: Swimming_calorie_calculatorInput): Swimming_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCalories"]));
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


export interface Swimming_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
