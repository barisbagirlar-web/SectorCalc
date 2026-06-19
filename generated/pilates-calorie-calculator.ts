// Auto-generated from pilates-calorie-calculator-schema.json
import * as z from 'zod';

export interface Pilates_calorie_calculatorInput {
  weight: number;
  warmupDuration: number;
  mainDuration: number;
  cooldownDuration: number;
  difficultyFactor: number;
  dataConfidence?: number;
}

export const Pilates_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  warmupDuration: z.number().default(5),
  mainDuration: z.number().default(30),
  cooldownDuration: z.number().default(5),
  difficultyFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pilates_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (2.5 * input.warmupDuration / 60 + 3.5 * input.mainDuration / 60 + 2.0 * input.cooldownDuration / 60) * input.difficultyFactor; results["caloriesBurned"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  try { const v = (asFormulaNumber(results["caloriesBurned"])) / (input.warmupDuration + input.mainDuration + input.cooldownDuration); results["caloriesPerMinute"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  try { const v = input.warmupDuration + input.mainDuration + input.cooldownDuration; results["totalDuration"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDuration"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePilates_calorie_calculator(input: Pilates_calorie_calculatorInput): Pilates_calorie_calculatorOutput {
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


export interface Pilates_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
