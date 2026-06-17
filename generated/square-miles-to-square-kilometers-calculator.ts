// @ts-nocheck
// Auto-generated from square-miles-to-square-kilometers-calculator-schema.json
import * as z from 'zod';

export interface Square_miles_to_square_kilometers_calculatorInput {
  sm: number;
  cf: number;
  dp: number;
  sf: number;
  cc: number;
}

export const Square_miles_to_square_kilometers_calculatorInputSchema = z.object({
  sm: z.number().default(0),
  cf: z.number().default(2.589988110336),
  dp: z.number().default(4),
  sf: z.number().default(1),
  cc: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Square_miles_to_square_kilometers_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.sm * input.cf; results["rawKm2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawKm2"] = 0; }
  try { const v = (asFormulaNumber(results["rawKm2"])) * input.sf + input.cc; results["scaledKm2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["scaledKm2"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSquare_miles_to_square_kilometers_calculator(input: Square_miles_to_square_kilometers_calculatorInput): Square_miles_to_square_kilometers_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["scaledKm2"]);
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


export interface Square_miles_to_square_kilometers_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
