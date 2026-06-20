// Auto-generated from body-fat-set-point-calculator-schema.json
import * as z from 'zod';

export interface Body_fat_set_point_calculatorInput {
  currentBodyFat: number;
  desiredBodyFat: number;
  currentWeight: number;
  height: number;
  age: number;
  activityLevel: number;
  dataConfidence?: number;
}

export const Body_fat_set_point_calculatorInputSchema = z.object({
  currentBodyFat: z.number().default(20),
  desiredBodyFat: z.number().default(15),
  currentWeight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  activityLevel: z.number().default(1.55),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Body_fat_set_point_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentWeight * (1 - input.currentBodyFat / 100); results["leanBodyMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leanBodyMass"] = Number.NaN; }
  try { const v = 370 + 21.6 * (toNumericFormulaValue(results["leanBodyMass"])); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bmr"])) * input.activityLevel; results["tdee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tdee"] = Number.NaN; }
  return results;
}


export function calculateBody_fat_set_point_calculator(input: Body_fat_set_point_calculatorInput): Body_fat_set_point_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tdee"]);
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


export interface Body_fat_set_point_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
