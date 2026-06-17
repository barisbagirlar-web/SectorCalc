// Auto-generated from reverse-diet-calculator-schema.json
import * as z from 'zod';

export interface Reverse_diet_calculatorInput {
  currentWeight: number;
  goalWeight: number;
  weeks: number;
  activityLevel: number;
}

export const Reverse_diet_calculatorInputSchema = z.object({
  currentWeight: z.number().default(70),
  goalWeight: z.number().default(65),
  weeks: z.number().default(8),
  activityLevel: z.number().default(1.2),
});

function evaluateAllFormulas(input: Reverse_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.currentWeight - input.goalWeight) * 7700; results["totalDeficit"] = Number.isFinite(v) ? v : 0; } catch { results["totalDeficit"] = 0; }
  try { const v = (results["totalDeficit"] ?? 0) / (input.weeks * 7); results["dailyDeficit"] = Number.isFinite(v) ? v : 0; } catch { results["dailyDeficit"] = 0; }
  try { const v = input.currentWeight * 22 * input.activityLevel; results["maintenanceCalories"] = Number.isFinite(v) ? v : 0; } catch { results["maintenanceCalories"] = 0; }
  try { const v = (results["maintenanceCalories"] ?? 0) - (results["dailyDeficit"] ?? 0); results["dailyIntake"] = Number.isFinite(v) ? v : 0; } catch { results["dailyIntake"] = 0; }
  return results;
}


export function calculateReverse_diet_calculator(input: Reverse_diet_calculatorInput): Reverse_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyIntake"] ?? 0;
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


export interface Reverse_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
