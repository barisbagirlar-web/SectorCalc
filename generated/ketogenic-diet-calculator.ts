// @ts-nocheck
// Auto-generated from ketogenic-diet-calculator-schema.json
import * as z from 'zod';

export interface Ketogenic_diet_calculatorInput {
  totalCalories: number;
  fatPercentage: number;
  proteinPercentage: number;
  carbPercentage: number;
}

export const Ketogenic_diet_calculatorInputSchema = z.object({
  totalCalories: z.number().default(2000),
  fatPercentage: z.number().default(70),
  proteinPercentage: z.number().default(20),
  carbPercentage: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ketogenic_diet_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.totalCalories * input.fatPercentage / 100) / 9; results["fatGrams"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fatGrams"] = 0; }
  try { const v = (input.totalCalories * input.proteinPercentage / 100) / 4; results["proteinGrams"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["proteinGrams"] = 0; }
  try { const v = (input.totalCalories * input.carbPercentage / 100) / 4; results["carbGrams"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["carbGrams"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateKetogenic_diet_calculator(input: Ketogenic_diet_calculatorInput): Ketogenic_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fatGrams"]);
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


export interface Ketogenic_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
