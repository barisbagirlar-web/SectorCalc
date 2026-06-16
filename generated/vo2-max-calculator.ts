// Auto-generated from vo2-max-calculator-schema.json
import * as z from 'zod';

export interface Vo2_max_calculatorInput {
  weight: number;
  age: number;
  gender: number;
  time: number;
  heartRate: number;
}

export const Vo2_max_calculatorInputSchema = z.object({
  weight: z.number().default(150),
  age: z.number().default(30),
  gender: z.number().default(1),
  time: z.number().default(15),
  heartRate: z.number().default(130),
});

function evaluateAllFormulas(input: Vo2_max_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 132.853 - (0.0769 * input.weight) - (0.3877 * input.age) + (6.315 * input.gender) - (3.2649 * input.time) - (0.1565 * input.heartRate); results["vo2MaxRelative"] = Number.isFinite(v) ? v : 0; } catch { results["vo2MaxRelative"] = 0; }
  try { const v = input.weight / 2.20462; results["weightKg"] = Number.isFinite(v) ? v : 0; } catch { results["weightKg"] = 0; }
  try { const v = (results["vo2MaxRelative"] ?? 0) * (results["weightKg"] ?? 0) / 1000; results["vo2MaxAbsolute"] = Number.isFinite(v) ? v : 0; } catch { results["vo2MaxAbsolute"] = 0; }
  return results;
}


export function calculateVo2_max_calculator(input: Vo2_max_calculatorInput): Vo2_max_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["vo2MaxRelative"] ?? 0;
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


export interface Vo2_max_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
