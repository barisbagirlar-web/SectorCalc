// Auto-generated from dirty-bulk-calculator-schema.json
import * as z from 'zod';

export interface Dirty_bulk_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityFactor: number;
  surplusPercent: number;
}

export const Dirty_bulk_calculatorInputSchema = z.object({
  weight: z.number().default(80),
  height: z.number().default(175),
  age: z.number().default(25),
  gender: z.number().default(1),
  activityFactor: z.number().default(1.55),
  surplusPercent: z.number().default(25),
});

function evaluateAllFormulas(input: Dirty_bulk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender ? (10 * input.weight + 6.25 * input.height - 5 * input.age + 5) : (10 * input.weight + 6.25 * input.height - 5 * input.age - 161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityFactor; results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (results["tdee"] ?? 0) * (1 + input.surplusPercent / 100); results["targetCalories"] = Number.isFinite(v) ? v : 0; } catch { results["targetCalories"] = 0; }
  try { const v = input.weight * 2; results["proteinGrams"] = Number.isFinite(v) ? v : 0; } catch { results["proteinGrams"] = 0; }
  try { const v = input.weight * 0.8; results["fatGrams"] = Number.isFinite(v) ? v : 0; } catch { results["fatGrams"] = 0; }
  try { const v = ((results["targetCalories"] ?? 0) - ((results["proteinGrams"] ?? 0) * 4 + (results["fatGrams"] ?? 0) * 9)) / 4; results["carbGrams"] = Number.isFinite(v) ? v : 0; } catch { results["carbGrams"] = 0; }
  return results;
}


export function calculateDirty_bulk_calculator(input: Dirty_bulk_calculatorInput): Dirty_bulk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["targetCalories"] ?? 0;
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


export interface Dirty_bulk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
