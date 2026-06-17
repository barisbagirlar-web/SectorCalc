// @ts-nocheck
// Auto-generated from kitten-weight-predictor-calculator-schema.json
import * as z from 'zod';

export interface Kitten_weight_predictor_calculatorInput {
  ageInWeeks: number;
  currentWeight: number;
  birthWeight: number;
  breedSizeFactor: number;
  sexFactor: number;
  dailyCalories: number;
}

export const Kitten_weight_predictor_calculatorInputSchema = z.object({
  ageInWeeks: z.number().default(12),
  currentWeight: z.number().default(1000),
  birthWeight: z.number().default(100),
  breedSizeFactor: z.number().default(1),
  sexFactor: z.number().default(1),
  dailyCalories: z.number().default(250),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kitten_weight_predictor_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.ageInWeeks + input.currentWeight + input.birthWeight; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.ageInWeeks + input.currentWeight + input.birthWeight; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateKitten_weight_predictor_calculator(input: Kitten_weight_predictor_calculatorInput): Kitten_weight_predictor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Kitten_weight_predictor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
