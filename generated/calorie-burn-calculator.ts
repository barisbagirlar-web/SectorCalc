// Auto-generated from calorie-burn-calculator-schema.json
import * as z from 'zod';

export interface Calorie_burn_calculatorInput {
  weight: number;
  duration: number;
  met: number;
  dataConfidence?: number;
}

export const Calorie_burn_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  met: z.number().default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Calorie_burn_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.met * input.weight * (input.duration / 60); results["caloriesBurned"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["caloriesBurned"] = Number.NaN; }
  try { const v = input.met * input.duration; results["metMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["metMinutes"] = Number.NaN; }
  try { const v = input.duration / 60; results["durationHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["durationHours"] = Number.NaN; }
  return results;
}


export function calculateCalorie_burn_calculator(input: Calorie_burn_calculatorInput): Calorie_burn_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["caloriesBurned"]);
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


export interface Calorie_burn_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
