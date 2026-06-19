// Auto-generated from lose-it-app-calculator-schema.json
import * as z from 'zod';

export interface Lose_it_app_calculatorInput {
  age: number;
  height: number;
  weight: number;
  gender: number;
  activityLevel: number;
  weightGoal: number;
  dataConfidence?: number;
}

export const Lose_it_app_calculatorInputSchema = z.object({
  age: z.number().default(30),
  height: z.number().default(170),
  weight: z.number().default(70),
  gender: z.number().default(0),
  activityLevel: z.number().default(1.2),
  weightGoal: z.number().default(-0.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lose_it_app_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age + (input.gender === 0 ? 5 : -161); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (asFormulaNumber(results["bmr"])) * input.activityLevel; results["tdee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (input.weightGoal * 7700) / 7; results["dailyAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyAdjustment"] = 0; }
  try { const v = (asFormulaNumber(results["tdee"])) + (asFormulaNumber(results["dailyAdjustment"])); results["calorieBudget"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["calorieBudget"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLose_it_app_calculator(input: Lose_it_app_calculatorInput): Lose_it_app_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["calorieBudget"]);
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


export interface Lose_it_app_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
