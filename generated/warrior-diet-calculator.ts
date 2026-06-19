// Auto-generated from warrior-diet-calculator-schema.json
import * as z from 'zod';

export interface Warrior_diet_calculatorInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityLevel: number;
  dataConfidence?: number;
}

export const Warrior_diet_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
  activityLevel: z.number().default(1.2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Warrior_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age + (input.gender === 1 ? 5 : -161); results["bmrMifflin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bmrMifflin"] = 0; }
  try { const v = (asFormulaNumber(results["bmrMifflin"])) * input.activityLevel; results["tdee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (asFormulaNumber(results["tdee"])) * 0.8; results["feastCalories"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["feastCalories"] = 0; }
  try { const v = (asFormulaNumber(results["tdee"])) * 0.2; results["undereatingCalories"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["undereatingCalories"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWarrior_diet_calculator(input: Warrior_diet_calculatorInput): Warrior_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["feastCalories"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
