// Auto-generated from skiing-calorie-calculator-schema.json
import * as z from 'zod';

export interface Skiing_calorie_calculatorInput {
  weight: number;
  duration: number;
  met: number;
  dataConfidence?: number;
}

export const Skiing_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(60),
  met: z.number().default(7),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Skiing_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (input.duration / 60) * input.met; results["totalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCalories"] = Number.NaN; }
  try { const v = input.weight * input.met / 60; results["caloriesPerMinute"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["caloriesPerMinute"] = Number.NaN; }
  try { const v = input.weight * input.met; results["caloriesPerHour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["caloriesPerHour"] = Number.NaN; }
  return results;
}


export function calculateSkiing_calorie_calculator(input: Skiing_calorie_calculatorInput): Skiing_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCalories"]);
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


export interface Skiing_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
