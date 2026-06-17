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

function evaluateAllFormulas(input: Chi_square_goodness_of_fit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.o1; results["chiSq"] = Number.isFinite(v) ? v : 0; } catch { results["chiSq"] = 0; }
  try { const v = input.o1; results["df"] = Number.isFinite(v) ? v : 0; } catch { results["df"] = 0; }
  return results;
}


export function calculateChi_square_goodness_of_fit_calculator(input: Chi_square_goodness_of_fit_calculatorInput): Chi_square_goodness_of_fit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["chiSq"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
