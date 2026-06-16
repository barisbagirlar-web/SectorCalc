// Auto-generated from atkins-calculator-schema.json
import * as z from 'zod';

export interface Atkins_calculatorInput {
  totalCarbohydrates: number;
  dietaryFiber: number;
  sugarAlcohols: number;
  protein: number;
  fat: number;
}

export const Atkins_calculatorInputSchema = z.object({
  totalCarbohydrates: z.number().default(0),
  dietaryFiber: z.number().default(0),
  sugarAlcohols: z.number().default(0),
  protein: z.number().default(0),
  fat: z.number().default(0),
});

function evaluateAllFormulas(input: Atkins_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCarbohydrates - input.dietaryFiber - (input.sugarAlcohols / 2); results["netCarbs"] = Number.isFinite(v) ? v : 0; } catch { results["netCarbs"] = 0; }
  try { const v = input.protein * 4; results["proteinCalories"] = Number.isFinite(v) ? v : 0; } catch { results["proteinCalories"] = 0; }
  try { const v = input.fat * 9; results["fatCalories"] = Number.isFinite(v) ? v : 0; } catch { results["fatCalories"] = 0; }
  try { const v = (results["netCarbs"] ?? 0) * 4; results["carbCalories"] = Number.isFinite(v) ? v : 0; } catch { results["carbCalories"] = 0; }
  try { const v = (results["proteinCalories"] ?? 0) + (results["fatCalories"] ?? 0) + (results["carbCalories"] ?? 0); results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  return results;
}


export function calculateAtkins_calculator(input: Atkins_calculatorInput): Atkins_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netCarbs"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Atkins_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
