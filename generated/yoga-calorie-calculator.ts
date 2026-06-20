// Auto-generated from yoga-calorie-calculator-schema.json
import * as z from 'zod';

export interface Yoga_calorie_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  duration: number;
  met: number;
  dataConfidence?: number;
}

export const Yoga_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
  duration: z.number().default(60),
  met: z.number().default(3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yoga_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender === 0 ? (10 * input.weight + 6.25 * input.height - 5 * input.age + 5) : (10 * input.weight + 6.25 * input.height - 5 * input.age - 161); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr"] = Number.NaN; }
  try { const v = input.met * input.weight * (input.duration / 60); results["totalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCalories"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bmr"])) * (input.duration / 1440); results["restingDuring"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["restingDuring"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCalories"])) - (toNumericFormulaValue(results["restingDuring"])); results["netCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netCalories"] = Number.NaN; }
  return results;
}


export function calculateYoga_calorie_calculator(input: Yoga_calorie_calculatorInput): Yoga_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netCalories"]);
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


export interface Yoga_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
