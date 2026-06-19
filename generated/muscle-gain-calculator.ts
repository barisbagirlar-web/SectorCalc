// Auto-generated from muscle-gain-calculator-schema.json
import * as z from 'zod';

export interface Muscle_gain_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityLevel: number;
  calorieSurplus: number;
  proteinIntake: number;
  dataConfidence?: number;
}

export const Muscle_gain_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(175),
  age: z.number().default(25),
  gender: z.number().default(1),
  activityLevel: z.number().default(1.55),
  calorieSurplus: z.number().default(300),
  proteinIntake: z.number().default(160),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Muscle_gain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender * (10*input.weight + 6.25*input.height - 5*input.age + 5) + (1-input.gender) * (10*input.weight + 6.25*input.height - 5*input.age - 161); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (asFormulaNumber(results["bmr"])) * input.activityLevel; results["tdee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMuscle_gain_calculator(input: Muscle_gain_calculatorInput): Muscle_gain_calculatorOutput {
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


export interface Muscle_gain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
