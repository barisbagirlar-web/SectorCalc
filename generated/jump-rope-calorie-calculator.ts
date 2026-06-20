// Auto-generated from jump-rope-calorie-calculator-schema.json
import * as z from 'zod';

export interface Jump_rope_calorie_calculatorInput {
  weight: number;
  duration: number;
  jumpsPerMinute: number;
  efficiencyFactor: number;
  dataConfidence?: number;
}

export const Jump_rope_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  jumpsPerMinute: z.number().default(120),
  efficiencyFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Jump_rope_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.jumpsPerMinute / 13.636; results["met"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["met"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["met"])) * input.weight * 3.5 / 200 * input.efficiencyFactor; results["caloriesPerMinute"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["caloriesPerMinute"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["caloriesPerMinute"])) * input.duration; results["caloriesBurned"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["caloriesBurned"] = Number.NaN; }
  return results;
}


export function calculateJump_rope_calorie_calculator(input: Jump_rope_calorie_calculatorInput): Jump_rope_calorie_calculatorOutput {
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


export interface Jump_rope_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
