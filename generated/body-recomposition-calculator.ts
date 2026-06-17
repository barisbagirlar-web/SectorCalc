// @ts-nocheck
// Auto-generated from body-recomposition-calculator-schema.json
import * as z from 'zod';

export interface Body_recomposition_calculatorInput {
  weight: number;
  bodyFatPercentage: number;
  height: number;
  age: number;
  activityLevel: number;
}

export const Body_recomposition_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  bodyFatPercentage: z.number().default(20),
  height: z.number().default(170),
  age: z.number().default(30),
  activityLevel: z.number().default(1.55),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Body_recomposition_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weight + input.bodyFatPercentage + input.height; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.weight + input.bodyFatPercentage + input.height; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBody_recomposition_calculator(input: Body_recomposition_calculatorInput): Body_recomposition_calculatorOutput {
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


export interface Body_recomposition_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
