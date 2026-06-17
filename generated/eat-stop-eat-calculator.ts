// Auto-generated from eat-stop-eat-calculator-schema.json
import * as z from 'zod';

export interface Eat_stop_eat_calculatorInput {
  currentWeight: number;
  goalWeight: number;
  dailyCaloriesNonFasting: number;
  fastingDaysPerWeek: number;
}

export const Eat_stop_eat_calculatorInputSchema = z.object({
  currentWeight: z.number().default(75),
  goalWeight: z.number().default(65),
  dailyCaloriesNonFasting: z.number().default(2000),
  fastingDaysPerWeek: z.number().default(2),
});

function evaluateAllFormulas(input: Eat_stop_eat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyCaloriesNonFasting * input.fastingDaysPerWeek; results["weeklyCaloricDeficit"] = Number.isFinite(v) ? v : 0; } catch { results["weeklyCaloricDeficit"] = 0; }
  try { const v = (results["weeklyCaloricDeficit"] ?? 0) / 7700; results["weeklyWeightLossKg"] = Number.isFinite(v) ? v : 0; } catch { results["weeklyWeightLossKg"] = 0; }
  try { const v = (input.currentWeight - input.goalWeight) / (results["weeklyWeightLossKg"] ?? 0); results["weeksToGoal"] = Number.isFinite(v) ? v : 0; } catch { results["weeksToGoal"] = 0; }
  return results;
}


export function calculateEat_stop_eat_calculator(input: Eat_stop_eat_calculatorInput): Eat_stop_eat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weeksToGoal"] ?? 0;
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


export interface Eat_stop_eat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
