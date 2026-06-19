// Auto-generated from dog-calorie-calculator-schema.json
import * as z from 'zod';

export interface Dog_calorie_calculatorInput {
  weightKg: number;
  activityFactor: number;
  bodyConditionScore: number;
  desiredWeightChange: number;
  dataConfidence?: number;
}

export const Dog_calorie_calculatorInputSchema = z.object({
  weightKg: z.number().default(10),
  activityFactor: z.number().default(1.6),
  bodyConditionScore: z.number().default(5),
  desiredWeightChange: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dog_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bodyConditionScore < 4) ? 1.2 : (input.bodyConditionScore > 6) ? 0.8 : 1.0; results["bcsFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bcsFactor"] = 0; }
  try { const v = 1 + (input.desiredWeightChange * 0.1); results["weightChangeFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightChangeFactor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDog_calorie_calculator(input: Dog_calorie_calculatorInput): Dog_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["weightChangeFactor"]));
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


export interface Dog_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
