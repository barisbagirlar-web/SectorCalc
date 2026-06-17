// Auto-generated from keto-calculator-schema.json
import * as z from 'zod';

export interface Keto_calculatorInput {
  weight: number;
  bodyFat: number;
  gender: number;
  activityLevel: number;
  deficitPercent: number;
}

export const Keto_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  bodyFat: z.number().default(25),
  gender: z.number().default(1),
  activityLevel: z.number().default(1.55),
  deficitPercent: z.number().default(20),
});

function evaluateAllFormulas(input: Keto_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 - input.bodyFat / 100); results["leanBodyMass"] = Number.isFinite(v) ? v : 0; } catch { results["leanBodyMass"] = 0; }
  try { const v = 370 + 21.6 * (results["leanBodyMass"] ?? 0); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityLevel; results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (results["tdee"] ?? 0) * (1 - input.deficitPercent / 100); results["dailyCalories"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCalories"] = 0; }
  try { const v = (results["leanBodyMass"] ?? 0) * 1.6; results["proteinGrams"] = Number.isFinite(v) ? v : 0; } catch { results["proteinGrams"] = 0; }
  try { const v = 20; results["netCarbs"] = Number.isFinite(v) ? v : 0; } catch { results["netCarbs"] = 0; }
  try { const v = (results["proteinGrams"] ?? 0) * 4; results["proteinCalories"] = Number.isFinite(v) ? v : 0; } catch { results["proteinCalories"] = 0; }
  try { const v = (results["netCarbs"] ?? 0) * 4; results["carbsCalories"] = Number.isFinite(v) ? v : 0; } catch { results["carbsCalories"] = 0; }
  try { const v = Math.max(0, (results["dailyCalories"] ?? 0) - (results["proteinCalories"] ?? 0) - (results["carbsCalories"] ?? 0)); results["fatCalories"] = Number.isFinite(v) ? v : 0; } catch { results["fatCalories"] = 0; }
  try { const v = (results["fatCalories"] ?? 0) / 9; results["fatGrams"] = Number.isFinite(v) ? v : 0; } catch { results["fatGrams"] = 0; }
  return results;
}


export function calculateKeto_calculator(input: Keto_calculatorInput): Keto_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyCalories"] ?? 0;
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


export interface Keto_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
