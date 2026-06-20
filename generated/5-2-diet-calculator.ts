// Auto-generated from 5-2-diet-calculator-schema.json
import * as z from 'zod';

export interface _5_2_diet_calculatorInput {
  normalKcal: number;
  fastKcal: number;
  weeks: number;
  maintenanceKcal: number;
  dataConfidence?: number;
}

export const _5_2_diet_calculatorInputSchema = z.object({
  normalKcal: z.number().default(2000),
  fastKcal: z.number().default(500),
  weeks: z.number().default(4),
  maintenanceKcal: z.number().default(2500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _5_2_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 5 * input.normalKcal + 2 * input.fastKcal; results["totalWeeklyCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeeklyCalories"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWeeklyCalories"])) / 7; results["averageDailyCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averageDailyCalories"] = Number.NaN; }
  try { const v = 7 * input.maintenanceKcal - (toNumericFormulaValue(results["totalWeeklyCalories"])); results["weeklyCalorieDeficit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weeklyCalorieDeficit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["weeklyCalorieDeficit"])) / 7700; results["weeklyWeightLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weeklyWeightLoss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["weeklyWeightLoss"])) * input.weeks; results["estimatedTotalWeightLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["estimatedTotalWeightLoss"] = Number.NaN; }
  return results;
}


export function calculate_5_2_diet_calculator(input: _5_2_diet_calculatorInput): _5_2_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["estimatedTotalWeightLoss"]);
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


export interface _5_2_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
