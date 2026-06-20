// Auto-generated from noom-calorie-calculator-schema.json
import * as z from 'zod';

export interface Noom_calorie_calculatorInput {
  weight: number;
  height: number;
  age: number;
  sex: number;
  activityFactor: number;
  deficitPercent: number;
  dataConfidence?: number;
}

export const Noom_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  sex: z.number().default(1),
  activityFactor: z.number().default(1.55),
  deficitPercent: z.number().default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Noom_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sex ? (10 * input.weight + 6.25 * input.height - 5 * input.age + 5) : (10 * input.weight + 6.25 * input.height - 5 * input.age - 161); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bmr"])) * input.activityFactor; results["tdee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tdee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["tdee"])) * (input.deficitPercent / 100); results["deficit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deficit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["tdee"])) - (toNumericFormulaValue(results["deficit"])); results["dailyCalorieBudget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyCalorieBudget"] = Number.NaN; }
  return results;
}


export function calculateNoom_calorie_calculator(input: Noom_calorie_calculatorInput): Noom_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyCalorieBudget"]);
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


export interface Noom_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
