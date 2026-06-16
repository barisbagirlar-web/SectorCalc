// Auto-generated from bmr-calculator-schema.json
import * as z from 'zod';

export interface Bmr_calculatorInput {
  weight: number;
  height: number;
  age: number;
  isMale: number;
}

export const Bmr_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  isMale: z.number().default(1),
});

function evaluateAllFormulas(input: Bmr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.isMale === 1 ? (10 * input.weight + 6.25 * input.height - 5 * input.age + 5) : (10 * input.weight + 6.25 * input.height - 5 * input.age - 161); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age + 5; results["maleBmr"] = Number.isFinite(v) ? v : 0; } catch { results["maleBmr"] = 0; }
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age - 161; results["femaleBmr"] = Number.isFinite(v) ? v : 0; } catch { results["femaleBmr"] = 0; }
  return results;
}


export function calculateBmr_calculator(input: Bmr_calculatorInput): Bmr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bmr"] ?? 0;
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


export interface Bmr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
