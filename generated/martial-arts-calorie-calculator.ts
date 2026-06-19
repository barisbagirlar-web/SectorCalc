// Auto-generated from martial-arts-calorie-calculator-schema.json
import * as z from 'zod';

export interface Martial_arts_calorie_calculatorInput {
  weight: number;
  duration: number;
  met: number;
  adjustmentFactor: number;
  dataConfidence?: number;
}

export const Martial_arts_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(60),
  met: z.number().default(10),
  adjustmentFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Martial_arts_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.met * input.weight * input.duration / 60) * input.adjustmentFactor; results["totalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.met * input.weight / 60; results["caloriesPerMinute"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  try { const v = input.met * input.weight; results["caloriesPerHour"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesPerHour"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMartial_arts_calorie_calculator(input: Martial_arts_calorie_calculatorInput): Martial_arts_calorie_calculatorOutput {
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


export interface Martial_arts_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
