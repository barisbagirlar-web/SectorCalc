// Auto-generated from meal-planning-verdict-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MealPlanningVerdictInput {
  mealCostPerDay: number;
  mealPlanDuration: number;
  numberOfPeople: number;
  wastePercentage: number;
  dietaryPreference: 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
  dataConfidence: 'low' | 'medium' | 'high';
}

export const MealPlanningVerdictInputSchema = z.object({
  mealCostPerDay: z.number().min(0).max(100).default(15),
  mealPlanDuration: z.number().min(1).max(365).default(30),
  numberOfPeople: z.number().min(1).max(100).default(1),
  wastePercentage: z.number().min(0).max(100).default(10),
  dietaryPreference: z.enum(['standard', 'vegetarian', 'vegan', 'keto', 'paleo']).default('standard'),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface MealPlanningVerdictOutput {
  verdictScore: number;
  breakdown: {
    totalMealCost: number;
    totalWasteCost: number;
    effectiveMealCost: number;
    costPerPersonPerDay: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MealPlanningVerdictInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalMealCost = ((): number => { try { const __v = input.mealCostPerDay * input.mealPlanDuration * input.numberOfPeople; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWasteCost = ((): number => { try { const __v = results.totalMealCost * (input.wastePercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectiveMealCost = ((): number => { try { const __v = results.totalMealCost - results.totalWasteCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerPersonPerDay = ((): number => { try { const __v = results.effectiveMealCost / (input.numberOfPeople * input.mealPlanDuration); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.verdictScore = ((): number => { try { const __v = results.costPerPersonPerDay <= 10 ? 'excellent' : results.costPerPersonPerDay <= 20 ? 'good' : results.costPerPersonPerDay <= 30 ? 'fair' : 'poor'; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.effectiveMealCost * 1.1 : input.dataConfidence == 'medium' ? results.effectiveMealCost * 1.05 : results.effectiveMealCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMealPlanningVerdict(input: MealPlanningVerdictInput): MealPlanningVerdictOutput {
  const results = evaluateFormulas(input);
  const verdictScore = results.verdictScore ?? 0;
  const breakdown = {
    totalMealCost: results.totalMealCost,
    totalWasteCost: results.totalWasteCost,
    effectiveMealCost: results.effectiveMealCost,
    costPerPersonPerDay: results.costPerPersonPerDay,
  };

  // rule: mealCostPerDay must be >= 0
  // rule: mealPlanDuration must be >= 1
  // rule: numberOfPeople must be >= 1
  // rule: wastePercentage must be between 0 and 100
  // rule: If dietaryPreference is 'vegan' or 'keto', mealCostPerDay may be higher (informational)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste percentage detected; consider waste reduction strategies.
  // threshold skipped (non-JS): Meal cost is above typical budget; review meal plan efficiency.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return verdictScore; } })();

  return {
    verdictScore,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over multiple plans","Comparison with benchmarks","Detailed nutritional report"],
  };
}
