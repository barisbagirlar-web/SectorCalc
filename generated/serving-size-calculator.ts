// Auto-generated from serving-size-calculator-schema.json
import * as z from 'zod';

export interface Serving_size_calculatorInput {
  totalWeight: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  servings: number;
}

export const Serving_size_calculatorInputSchema = z.object({
  totalWeight: z.number().default(500),
  totalCalories: z.number().default(2000),
  totalProtein: z.number().default(50),
  totalCarbs: z.number().default(200),
  totalFat: z.number().default(70),
  servings: z.number().default(4),
});

function evaluateAllFormulas(input: Serving_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWeight / input.servings; results["servingWeight"] = Number.isFinite(v) ? v : 0; } catch { results["servingWeight"] = 0; }
  try { const v = input.totalCalories / input.servings; results["servingCalories"] = Number.isFinite(v) ? v : 0; } catch { results["servingCalories"] = 0; }
  try { const v = input.totalProtein / input.servings; results["servingProtein"] = Number.isFinite(v) ? v : 0; } catch { results["servingProtein"] = 0; }
  try { const v = input.totalCarbs / input.servings; results["servingCarbs"] = Number.isFinite(v) ? v : 0; } catch { results["servingCarbs"] = 0; }
  try { const v = input.totalFat / input.servings; results["servingFat"] = Number.isFinite(v) ? v : 0; } catch { results["servingFat"] = 0; }
  return results;
}


export function calculateServing_size_calculator(input: Serving_size_calculatorInput): Serving_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Per"] ?? 0;
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


export interface Serving_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
