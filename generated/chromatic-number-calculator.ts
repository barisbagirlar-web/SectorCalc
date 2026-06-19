// Auto-generated from chromatic-number-calculator-schema.json
import * as z from 'zod';

export interface Chromatic_number_calculatorInput {
  n_d: number;
  n_F: number;
  n_C: number;
  lambda_d: number;
  dataConfidence?: number;
}

export const Chromatic_number_calculatorInputSchema = z.object({
  n_d: z.number().default(1.523),
  n_F: z.number().default(1.529),
  n_C: z.number().default(1.52),
  lambda_d: z.number().default(589.3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Chromatic_number_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.n_d - 1) / (input.n_F - input.n_C); results["abbeNumber"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["abbeNumber"] = 0; }
  try { const v = input.n_F - input.n_C; results["dispersion"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dispersion"] = 0; }
  try { const v = input.n_d - 1; results["refractivity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["refractivity"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateChromatic_number_calculator(input: Chromatic_number_calculatorInput): Chromatic_number_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["abbeNumber"]));
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


export interface Chromatic_number_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
