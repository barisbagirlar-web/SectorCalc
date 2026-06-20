// Auto-generated from snowboarding-calorie-calculator-schema.json
import * as z from 'zod';

export interface Snowboarding_calorie_calculatorInput {
  weight: number;
  duration: number;
  intensity: number;
  altitude: number;
  correctionFactor: number;
  dataConfidence?: number;
}

export const Snowboarding_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(60),
  intensity: z.number().default(5),
  altitude: z.number().default(0),
  correctionFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Snowboarding_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 4.0 + input.intensity * 0.4; results["met"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["met"] = Number.NaN; }
  try { const v = 1 + input.altitude * 0.00002; results["altFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["altFactor"] = Number.NaN; }
  try { const v = input.weight * (toNumericFormulaValue(results["met"])) * (input.duration / 60); results["baseCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseCalories"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseCalories"])) * (toNumericFormulaValue(results["altFactor"])) * input.correctionFactor; results["caloriesBurned"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["caloriesBurned"] = Number.NaN; }
  return results;
}


export function calculateSnowboarding_calorie_calculator(input: Snowboarding_calorie_calculatorInput): Snowboarding_calorie_calculatorOutput {
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


export interface Snowboarding_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
