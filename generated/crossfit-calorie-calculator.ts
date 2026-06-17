// @ts-nocheck
// Auto-generated from crossfit-calorie-calculator-schema.json
import * as z from 'zod';

export interface Crossfit_calorie_calculatorInput {
  weight: number;
  duration: number;
  metValue: number;
  genderFactor: number;
}

export const Crossfit_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  metValue: z.number().default(8),
  genderFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Crossfit_calorie_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.genderFactor * input.metValue * input.weight * (input.duration / 60); results["totalCalories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = input.genderFactor * input.metValue * input.weight / 60; results["caloriesPerMinute"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  try { const v = input.genderFactor * input.metValue * input.weight; results["caloriesPerHour"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["caloriesPerHour"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCrossfit_calorie_calculator(input: Crossfit_calorie_calculatorInput): Crossfit_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCalories"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Crossfit_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
