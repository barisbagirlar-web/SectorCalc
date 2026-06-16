// Auto-generated from calorie-burn-calculator-schema.json
import * as z from 'zod';

export interface Calorie_burn_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  duration: number;
  met: number;
}

export const Calorie_burn_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(1),
  duration: z.number().default(30),
  met: z.number().default(7),
});

function evaluateAllFormulas(input: Calorie_burn_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.met * 3.5 * input.weight / 200 * input.duration; results["activityCal"] = Number.isFinite(v) ? v : 0; } catch { results["activityCal"] = 0; }
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age + (input.gender * 166 - 161); results["bmrKcalPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["bmrKcalPerDay"] = 0; }
  return results;
}


export function calculateCalorie_burn_calculator(input: Calorie_burn_calculatorInput): Calorie_burn_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Calorie_burn_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
