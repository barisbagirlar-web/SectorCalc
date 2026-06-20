// Auto-generated from fitbit-calorie-calculator-schema.json
import * as z from 'zod';

export interface Fitbit_calorie_calculatorInput {
  age: number;
  gender: number;
  weight: number;
  height: number;
  activityFactor: number;
  dataConfidence?: number;
}

export const Fitbit_calorie_calculatorInputSchema = z.object({
  age: z.number().default(30),
  gender: z.number().default(0),
  weight: z.number().default(70),
  height: z.number().default(170),
  activityFactor: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fitbit_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.gender === 1 ? (10*input.weight + 6.25*input.height - 5*input.age + 5) : (10*input.weight + 6.25*input.height - 5*input.age - 161)); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bmr"])) * input.activityFactor; results["tdee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tdee"] = Number.NaN; }
  try { const v = input.activityFactor; results["activityFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["activityFactor"] = Number.NaN; }
  return results;
}


export function calculateFitbit_calorie_calculator(input: Fitbit_calorie_calculatorInput): Fitbit_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tdee"]);
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


export interface Fitbit_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
