// Auto-generated from hiit-calorie-calculator-schema.json
import * as z from 'zod';

export interface Hiit_calorie_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  duration: number;
  met: number;
  dataConfidence?: number;
}

export const Hiit_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  duration: z.number().default(30),
  met: z.number().default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hiit_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 88.362 + (13.397 * input.weight) + (4.799 * input.height) - (5.677 * input.age); results["bmr_male"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr_male"] = Number.NaN; }
  try { const v = 447.593 + (9.247 * input.weight) + (3.098 * input.height) - (4.330 * input.age); results["bmr_female"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr_female"] = Number.NaN; }
  try { const v = ((input.gender === 1 ? (toNumericFormulaValue(results["bmr_male"])) : (toNumericFormulaValue(results["bmr_female"]))) ? 1 : 0); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bmr"])) / 24; results["hourlyBmr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hourlyBmr"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["hourlyBmr"])) * input.met * (input.duration / 60); results["calories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["calories"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["calories"])) / input.duration; results["caloriesPerMinute"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["caloriesPerMinute"] = Number.NaN; }
  return results;
}


export function calculateHiit_calorie_calculator(input: Hiit_calorie_calculatorInput): Hiit_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["calories"]);
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


export interface Hiit_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
