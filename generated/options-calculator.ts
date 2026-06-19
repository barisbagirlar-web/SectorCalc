// Auto-generated from options-calculator-schema.json
import * as z from 'zod';

export interface Options_calculatorInput {
  optionType: number;
  S: number;
  K: number;
  T: number;
  r: number;
  sigma: number;
  dataConfidence?: number;
}

export const Options_calculatorInputSchema = z.object({
  optionType: z.number().default(1),
  S: z.number().default(100),
  K: z.number().default(100),
  T: z.number().default(1),
  r: z.number().default(5),
  sigma: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Options_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.optionType) * (input.S) * (input.K) * (input.T) * (input.r) * (input.sigma); results["r_dec"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["r_dec"] = 0; }
  try { const v = (input.optionType) * (input.S) * (input.K); results["sigma_dec"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sigma_dec"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOptions_calculator(input: Options_calculatorInput): Options_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["sigma_dec"]));
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


export interface Options_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
