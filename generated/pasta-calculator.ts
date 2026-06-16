// Auto-generated from pasta-calculator-schema.json
import * as z from 'zod';

export interface Pasta_calculatorInput {
  servings: number;
  portionWeight: number;
  waterRatio: number;
  saltConcentration: number;
  cookingTimeLoss: number;
  caloriesPer100g: number;
}

export const Pasta_calculatorInputSchema = z.object({
  servings: z.number().default(4),
  portionWeight: z.number().default(100),
  waterRatio: z.number().default(10),
  saltConcentration: z.number().default(10),
  cookingTimeLoss: z.number().default(1.8),
  caloriesPer100g: z.number().default(371),
});

function evaluateAllFormulas(input: Pasta_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.servings * input.portionWeight; results["totalDryWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalDryWeight"] = 0; }
  try { const v = ((results["totalDryWeight"] ?? 0) / 1000) * input.waterRatio; results["totalWater"] = Number.isFinite(v) ? v : 0; } catch { results["totalWater"] = 0; }
  try { const v = (results["totalWater"] ?? 0) * input.saltConcentration; results["totalSalt"] = Number.isFinite(v) ? v : 0; } catch { results["totalSalt"] = 0; }
  try { const v = (results["totalDryWeight"] ?? 0) * input.cookingTimeLoss; results["cookedWeight"] = Number.isFinite(v) ? v : 0; } catch { results["cookedWeight"] = 0; }
  try { const v = ((results["totalDryWeight"] ?? 0) / 100) * input.caloriesPer100g; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  return results;
}


export function calculatePasta_calculator(input: Pasta_calculatorInput): Pasta_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCookedPasta"] ?? 0;
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


export interface Pasta_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
