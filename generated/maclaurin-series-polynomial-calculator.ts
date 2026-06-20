// Auto-generated from maclaurin-series-polynomial-calculator-schema.json
import * as z from 'zod';

export interface Maclaurin_series_polynomial_calculatorInput {
  x: number;
  a0: number;
  a1: number;
  a2: number;
  a3: number;
  a4: number;
  a5: number;
  dataConfidence?: number;
}

export const Maclaurin_series_polynomial_calculatorInputSchema = z.object({
  x: z.number().default(0),
  a0: z.number().default(0),
  a1: z.number().default(0),
  a2: z.number().default(0),
  a3: z.number().default(0),
  a4: z.number().default(0),
  a5: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Maclaurin_series_polynomial_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a0 + input.a1*input.x + input.a2*input.x**2 + input.a3*input.x**3 + input.a4*input.x**4 + input.a5*input.x**5; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown"] = Number.NaN; }
  try { const v = input.a0 + input.a1*input.x + input.a2*input.x**2 + input.a3*input.x**3 + input.a4*input.x**4 + input.a5*input.x**5; results["breakdown_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown_aux"] = Number.NaN; }
  return results;
}


export function calculateMaclaurin_series_polynomial_calculator(input: Maclaurin_series_polynomial_calculatorInput): Maclaurin_series_polynomial_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["breakdown_aux"]);
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


export interface Maclaurin_series_polynomial_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
