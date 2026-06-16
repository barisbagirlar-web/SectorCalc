// Auto-generated from eat-stop-eat-calculator-schema.json
import * as z from 'zod';

export interface Eat_stop_eat_calculatorInput {
  currentWeight: number;
  targetWeight: number;
  maintenanceCalories: number;
  fastingDaysPerWeek: number;
  fastingDuration: number;
  caloricDeficitPerKg: number;
}

export const Eat_stop_eat_calculatorInputSchema = z.object({
  currentWeight: z.number().default(70),
  targetWeight: z.number().default(65),
  maintenanceCalories: z.number().default(2000),
  fastingDaysPerWeek: z.number().default(2),
  fastingDuration: z.number().default(24),
  caloricDeficitPerKg: z.number().default(7700),
});

function evaluateAllFormulas(input: Eat_stop_eat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maintenanceCalories * (input.fastingDuration / 24); results["caloriesSavedPerFastingDay"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesSavedPerFastingDay"] = 0; }
  try { const v = input.fastingDaysPerWeek * (results["caloriesSavedPerFastingDay"] ?? 0); results["weeklyCaloricDeficit"] = Number.isFinite(v) ? v : 0; } catch { results["weeklyCaloricDeficit"] = 0; }
  try { const v = (results["weeklyCaloricDeficit"] ?? 0) / input.caloricDeficitPerKg; results["totalWeightLossPerWeek"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeightLossPerWeek"] = 0; }
  try { const v = (input.currentWeight - input.targetWeight) / (results["totalWeightLossPerWeek"] ?? 0); results["weeksToTarget"] = Number.isFinite(v) ? v : 0; } catch { results["weeksToTarget"] = 0; }
  return results;
}


export function calculateEat_stop_eat_calculator(input: Eat_stop_eat_calculatorInput): Eat_stop_eat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weeksToTarget"] ?? 0;
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
