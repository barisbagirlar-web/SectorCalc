// Auto-generated from calorie-deficit-calculator-schema.json
import * as z from 'zod';

export interface Calorie_deficit_calculatorInput {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  goalRate: string;
  bodyFatPercent: number;
  isPregnant: boolean;
  isLactating: boolean;
}

export const Calorie_deficit_calculatorInputSchema = z.object({
  age: z.number().min(10).max(120).default(30),
  gender: z.enum(['male', 'female']).default('male'),
  weight: z.number().min(20).max(500).default(70),
  height: z.number().min(50).max(300).default(170),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very active']).default('moderate'),
  goalRate: z.enum(['slow', 'moderate', 'aggressive']).default('moderate'),
  bodyFatPercent: z.number().min(3).max(70).default(20),
  isPregnant: z.boolean().default(false),
  isLactating: z.boolean().default(false),
});

function evaluateAllFormulas(_input: Calorie_deficit_calculatorInput): Record<string, number> {
  return {};
}


export function calculateCalorie_deficit_calculator(input: Calorie_deficit_calculatorInput): Calorie_deficit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["0"] ?? 0;
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Calorie_deficit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
