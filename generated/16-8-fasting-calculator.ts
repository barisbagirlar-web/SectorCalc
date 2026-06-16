// Auto-generated from 16-8-fasting-calculator-schema.json
import * as z from 'zod';

export interface _16_8_fasting_calculatorInput {
  weight: number;
  height: number;
  age: number;
  sex: number;
  fastingHours: number;
}

export const _16_8_fasting_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  sex: z.number().default(1),
  fastingHours: z.number().default(16),
});

function evaluateAllFormulas(input: _16_8_fasting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sex ? (66.47 + 13.75 * input.weight + 5.003 * input.height - 6.755 * input.age) : (655.1 + 9.563 * input.weight + 1.85 * input.height - 4.676 * input.age); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = ((results["bmr"] ?? 0) / 24) * input.fastingHours; results["caloriesBurned"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  try { const v = (results["caloriesBurned"] ?? 0) / 7700; results["estimatedFatLoss"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedFatLoss"] = 0; }
  return results;
}


export function calculate_16_8_fasting_calculator(input: _16_8_fasting_calculatorInput): _16_8_fasting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimatedFatLoss"] ?? 0;
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


export interface _16_8_fasting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
