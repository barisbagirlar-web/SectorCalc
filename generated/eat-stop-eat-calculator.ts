// Auto-generated from eat-stop-eat-calculator-schema.json
import * as z from 'zod';

export interface Eat_stop_eat_calculatorInput {
  currentWeight: number;
  goalWeight: number;
  dailyCaloriesNonFasting: number;
  fastingDaysPerWeek: number;
  dataConfidence?: number;
}

export const Eat_stop_eat_calculatorInputSchema = z.object({
  currentWeight: z.number().default(75),
  goalWeight: z.number().default(65),
  dailyCaloriesNonFasting: z.number().default(2000),
  fastingDaysPerWeek: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Eat_stop_eat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyCaloriesNonFasting * input.fastingDaysPerWeek; results["weeklyCaloricDeficit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weeklyCaloricDeficit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["weeklyCaloricDeficit"])) / 7700; results["weeklyWeightLossKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weeklyWeightLossKg"] = Number.NaN; }
  try { const v = (input.currentWeight - input.goalWeight) / (toNumericFormulaValue(results["weeklyWeightLossKg"])); results["weeksToGoal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weeksToGoal"] = Number.NaN; }
  return results;
}


export function calculateEat_stop_eat_calculator(input: Eat_stop_eat_calculatorInput): Eat_stop_eat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["weeksToGoal"]);
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


export interface Eat_stop_eat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
