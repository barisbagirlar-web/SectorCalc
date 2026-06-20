// Auto-generated from square-miles-to-square-kilometers-calculator-schema.json
import * as z from 'zod';

export interface Square_miles_to_square_kilometers_calculatorInput {
  sm: number;
  cf: number;
  dp: number;
  sf: number;
  cc: number;
  dataConfidence?: number;
}

export const Square_miles_to_square_kilometers_calculatorInputSchema = z.object({
  sm: z.number().default(0),
  cf: z.number().default(2.589988110336),
  dp: z.number().default(4),
  sf: z.number().default(1),
  cc: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Square_miles_to_square_kilometers_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sm * input.cf; results["rawKm2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawKm2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawKm2"])) * input.sf + input.cc; results["scaledKm2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scaledKm2"] = Number.NaN; }
  return results;
}


export function calculateSquare_miles_to_square_kilometers_calculator(input: Square_miles_to_square_kilometers_calculatorInput): Square_miles_to_square_kilometers_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["scaledKm2"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
