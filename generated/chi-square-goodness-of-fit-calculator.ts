// Auto-generated from chi-square-goodness-of-fit-calculator-schema.json
import * as z from 'zod';

export interface Chi_square_goodness_of_fit_calculatorInput {
  o1: number;
  e1: number;
  o2: number;
  e2: number;
  o3: number;
  e3: number;
  o4: number;
  e4: number;
  dataConfidence?: number;
}

export const Chi_square_goodness_of_fit_calculatorInputSchema = z.object({
  o1: z.number().default(0),
  e1: z.number().default(0),
  o2: z.number().default(0),
  e2: z.number().default(0),
  o3: z.number().default(0),
  e3: z.number().default(0),
  o4: z.number().default(0),
  e4: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Chi_square_goodness_of_fit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.o1-input.e1)**2/input.e1)+((input.o2-input.e2)**2/input.e2)+((input.o3-input.e3)**2/input.e3); results["chiSq"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["chiSq"] = 0; }
  try { const v = 3-1; results["df"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["df"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateChi_square_goodness_of_fit_calculator(input: Chi_square_goodness_of_fit_calculatorInput): Chi_square_goodness_of_fit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["chiSq"]));
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


export interface Chi_square_goodness_of_fit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
