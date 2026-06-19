// Auto-generated from mph-to-knots-calculator-schema.json
import * as z from 'zod';

export interface Mph_to_knots_calculatorInput {
  mph: number;
  conversionFactor: number;
  decimals: number;
  knownKnots: number;
  tolerance: number;
  dataConfidence?: number;
}

export const Mph_to_knots_calculatorInputSchema = z.object({
  mph: z.number().default(60),
  conversionFactor: z.number().default(0.868976),
  decimals: z.number().default(1),
  knownKnots: z.number().default(0),
  tolerance: z.number().default(0.01),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mph_to_knots_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.mph) * (input.conversionFactor) * (input.decimals) * (input.knownKnots) * (input.tolerance); results["exactKnots"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["exactKnots"] = 0; }
  try { const v = (input.mph) * (input.conversionFactor) * (input.decimals); results["exactKnots_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["exactKnots_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMph_to_knots_calculator(input: Mph_to_knots_calculatorInput): Mph_to_knots_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["exactKnots_aux"]));
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


export interface Mph_to_knots_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
