// Auto-generated from stairmaster-calorie-calculator-schema.json
import * as z from 'zod';

export interface Stairmaster_calorie_calculatorInput {
  weight: number;
  duration: number;
  met: number;
  stepHeight: number;
  stepsPerMinute: number;
  dataConfidence?: number;
}

export const Stairmaster_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  met: z.number().default(5.5),
  stepHeight: z.number().default(0.17),
  stepsPerMinute: z.number().default(60),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stairmaster_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.met * input.weight * (input.duration / 60); results["totalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.met * input.weight / 60; results["caloriesPerMinute"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  try { const v = (input.weight * 9.81 * input.stepHeight * input.stepsPerMinute * input.duration) / 4184; results["mechanicalWorkCalories"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mechanicalWorkCalories"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStairmaster_calorie_calculator(input: Stairmaster_calorie_calculatorInput): Stairmaster_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCalories"]));
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


export interface Stairmaster_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
