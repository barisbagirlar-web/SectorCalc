// Auto-generated from maintenance-calories-calculator-schema.json
import * as z from 'zod';

export interface Maintenance_calories_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityLevel: number;
}

export const Maintenance_calories_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
  activityLevel: z.number().default(1.55),
});

function evaluateAllFormulas(input: Maintenance_calories_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender * (10 * input.weight + 6.25 * input.height - 5 * input.age + 5) + (1 - input.gender) * (10 * input.weight + 6.25 * input.height - 5 * input.age - 161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityLevel; results["maintenance"] = Number.isFinite(v) ? v : 0; } catch { results["maintenance"] = 0; }
  try { const v = input.activityLevel; results["activityLevel"] = Number.isFinite(v) ? v : 0; } catch { results["activityLevel"] = 0; }
  return results;
}


export function calculateMaintenance_calories_calculator(input: Maintenance_calories_calculatorInput): Maintenance_calories_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maintenance"] ?? 0;
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


export interface Maintenance_calories_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
