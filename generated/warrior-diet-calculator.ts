// Auto-generated from warrior-diet-calculator-schema.json
import * as z from 'zod';

export interface Warrior_diet_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityLevel: number;
}

export const Warrior_diet_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
  activityLevel: z.number().default(1.2),
});

function evaluateAllFormulas(input: Warrior_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age + (input.gender === 1 ? 5 : -161); results["bmrMifflin"] = Number.isFinite(v) ? v : 0; } catch { results["bmrMifflin"] = 0; }
  try { const v = (results["bmrMifflin"] ?? 0) * input.activityLevel; results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (results["tdee"] ?? 0) * 0.8; results["feastCalories"] = Number.isFinite(v) ? v : 0; } catch { results["feastCalories"] = 0; }
  try { const v = (results["tdee"] ?? 0) * 0.2; results["undereatingCalories"] = Number.isFinite(v) ? v : 0; } catch { results["undereatingCalories"] = 0; }
  return results;
}


export function calculateWarrior_diet_calculator(input: Warrior_diet_calculatorInput): Warrior_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["feastCalories"] ?? 0;
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


export interface Warrior_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
