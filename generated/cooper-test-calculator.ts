// @ts-nocheck
// Auto-generated from cooper-test-calculator-schema.json
import * as z from 'zod';

export interface Cooper_test_calculatorInput {
  distance_m: number;
  age_years: number;
  gender: number;
  weight_kg: number;
}

export const Cooper_test_calculatorInputSchema = z.object({
  distance_m: z.number().default(2400),
  age_years: z.number().default(30),
  gender: z.number().default(0),
  weight_kg: z.number().default(70),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cooper_test_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.distance_m - 504.9) / 44.73; results["vo2max"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vo2max"] = 0; }
  try { const v = input.weight_kg * (input.distance_m / 1000) * 0.97; results["calories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["calories"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCooper_test_calculator(input: Cooper_test_calculatorInput): Cooper_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vo2max"]);
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


export interface Cooper_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
