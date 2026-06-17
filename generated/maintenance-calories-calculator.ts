// Auto-generated from maintenance-calories-calculator-schema.json
import * as z from 'zod';

export interface Maintenance_calories_calculatorInput {
  gender: number;
  age: number;
  weight: number;
  height: number;
  activityLevel: number;
}

export const Maintenance_calories_calculatorInputSchema = z.object({
  gender: z.number().default(1),
  age: z.number().default(30),
  weight: z.number().default(70),
  height: z.number().default(170),
  activityLevel: z.number().default(1.55),
});

function evaluateAllFormulas(input: Maintenance_calories_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 66*input.gender + 655*(1-input.gender) + (13.7*input.gender + 9.6*(1-input.gender))*input.weight + (5*input.gender + 1.8*(1-input.gender))*input.height - (6.8*input.gender + 4.7*(1-input.gender))*input.age; results["BMR"] = Number.isFinite(v) ? v : 0; } catch { results["BMR"] = 0; }
  try { const v = BMR * input.activityLevel; results["TDEE"] = Number.isFinite(v) ? v : 0; } catch { results["TDEE"] = 0; }
  return results;
}


export function calculateMaintenance_calories_calculator(input: Maintenance_calories_calculatorInput): Maintenance_calories_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["TDEE"] ?? 0;
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
