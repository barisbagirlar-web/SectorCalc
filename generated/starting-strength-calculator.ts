// @ts-nocheck
// Auto-generated from starting-strength-calculator-schema.json
import * as z from 'zod';

export interface Starting_strength_calculatorInput {
  weight: number;
  reps: number;
  startingPercentage: number;
  bodyweight: number;
}

export const Starting_strength_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  reps: z.number().default(5),
  startingPercentage: z.number().default(80),
  bodyweight: z.number().default(80),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Starting_strength_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weight * (1 + input.reps/30); results["estimated1RM"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["estimated1RM"] = 0; }
  try { const v = (asFormulaNumber(results["estimated1RM"])) * (input.startingPercentage/100); results["startingWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["startingWeight"] = 0; }
  try { const v = (asFormulaNumber(results["startingWeight"])) / input.bodyweight; results["weightRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["weightRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStarting_strength_calculator(input: Starting_strength_calculatorInput): Starting_strength_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["startingWeight"]);
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


export interface Starting_strength_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
