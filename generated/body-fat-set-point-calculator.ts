// Auto-generated from body-fat-set-point-calculator-schema.json
import * as z from 'zod';

export interface Body_fat_set_point_calculatorInput {
  currentBodyFat: number;
  desiredBodyFat: number;
  currentWeight: number;
  height: number;
  age: number;
  activityLevel: number;
}

export const Body_fat_set_point_calculatorInputSchema = z.object({
  currentBodyFat: z.number().default(20),
  desiredBodyFat: z.number().default(15),
  currentWeight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  activityLevel: z.number().default(1.55),
});

function evaluateAllFormulas(input: Body_fat_set_point_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentWeight * (1 - input.currentBodyFat / 100); results["leanBodyMass"] = Number.isFinite(v) ? v : 0; } catch { results["leanBodyMass"] = 0; }
  try { const v = 22 * Math.pow(input.height / 100, 2); results["idealWeight"] = Number.isFinite(v) ? v : 0; } catch { results["idealWeight"] = 0; }
  try { const v = 0.14 * (1 + (input.currentWeight - (results["idealWeight"] ?? 0)) / (results["idealWeight"] ?? 0)) * (1 - (input.age - 30) * 0.005); results["adjustmentFactor"] = Number.isFinite(v) ? v : 0; } catch { results["adjustmentFactor"] = 0; }
  try { const v = 370 + 21.6 * (results["leanBodyMass"] ?? 0); results["bmr"] = Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (results["bmr"] ?? 0) * input.activityLevel; results["tdee"] = Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = input.currentBodyFat + (input.desiredBodyFat - input.currentBodyFat) * (results["adjustmentFactor"] ?? 0); results["bodyFatSetPoint"] = Number.isFinite(v) ? v : 0; } catch { results["bodyFatSetPoint"] = 0; }
  return results;
}


export function calculateBody_fat_set_point_calculator(input: Body_fat_set_point_calculatorInput): Body_fat_set_point_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bodyFatSetPoint"] ?? 0;
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


export interface Body_fat_set_point_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
