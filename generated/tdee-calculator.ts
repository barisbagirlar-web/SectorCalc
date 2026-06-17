// Auto-generated from tdee-calculator-schema.json
import * as z from 'zod';

export interface Tdee_calculatorInput {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  bodyFatPercent: number;
  isAthlete: boolean;
}

export const Tdee_calculatorInputSchema = z.object({
  age: z.number().min(10).max(120).default(30),
  gender: z.enum(['male', 'female']).default('male'),
  weight: z.number().min(20).max(300).default(70),
  height: z.number().min(50).max(250).default(170),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive']).default('moderate'),
  bodyFatPercent: z.number().min(3).max(60).default(20),
  isAthlete: z.boolean().default(false),
});

function evaluateAllFormulas(_input: Tdee_calculatorInput): Record<string, number> {
  return {};
}


export function calculateTdee_calculator(input: Tdee_calculatorInput): Tdee_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","BMR breakdown chart","Activity factor optimization report"],
  };
}


export interface Tdee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
