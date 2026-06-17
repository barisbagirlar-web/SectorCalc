// Auto-generated from column-design-calculator-schema.json
import * as z from 'zod';

export interface Column_design_calculatorInput {
  P: number;
  L: number;
  E: number;
  I: number;
  A: number;
  Fy: number;
  SF: number;
}

export const Column_design_calculatorInputSchema = z.object({
  P: z.number().default(100),
  L: z.number().default(3),
  E: z.number().default(200),
  I: z.number().default(1000),
  A: z.number().default(50),
  Fy: z.number().default(250),
  SF: z.number().default(2),
});

function evaluateAllFormulas(input: Column_design_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(Math.PI ** 2 * input.E * input.I / (100 * input.L ** 2), input.A * input.Fy / (10 * input.SF)); results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = Math.PI ** 2 * input.E * input.I / (100 * input.L ** 2); results["Math_PI____2___E___I____100___L____2_"] = Number.isFinite(v) ? v : 0; } catch { results["Math_PI____2___E___I____100___L____2_"] = 0; }
  try { const v = input.A * input.Fy / (10 * input.SF); results["A___Fy____10___SF_"] = Number.isFinite(v) ? v : 0; } catch { results["A___Fy____10___SF_"] = 0; }
  try { const v = 100 * input.L / Math.sqrt(input.I / input.A); results["100___L___Math_sqrt_I___A_"] = Number.isFinite(v) ? v : 0; } catch { results["100___L___Math_sqrt_I___A_"] = 0; }
  try { const v = input.P / Math.min(Math.PI ** 2 * input.E * input.I / (100 * input.L ** 2), input.A * input.Fy / (10 * input.SF)); results["P___Math_min_Math_PI____2___E___I____100"] = Number.isFinite(v) ? v : 0; } catch { results["P___Math_min_Math_PI____2___E___I____100"] = 0; }
  try { const v = Math.min(Math.PI ** 2 * input.E * input.I / (100 * input.L ** 2), input.A * input.Fy / (10 * input.SF)); results["primary_result"] = Number.isFinite(v) ? v : 0; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateColumn_design_calculator(input: Column_design_calculatorInput): Column_design_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary_result"] ?? 0;
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


export interface Column_design_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
