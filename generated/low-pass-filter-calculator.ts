// Auto-generated from low-pass-filter-calculator-schema.json
import * as z from 'zod';

export interface Low_pass_filter_calculatorInput {
  r: number;
  r_tol: number;
  c: number;
  c_tol: number;
  fin: number;
  dataConfidence?: number;
}

export const Low_pass_filter_calculatorInputSchema = z.object({
  r: z.number().default(1000),
  r_tol: z.number().default(5),
  c: z.number().default(0.000001),
  c_tol: z.number().default(10),
  fin: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Low_pass_filter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / (2 * Math.PI * input.r * input.c); results["fc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fc"] = Number.NaN; }
  try { const v = input.r * input.c; results["tau"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tau"] = Number.NaN; }
  try { const v = 1 / (2 * Math.PI * input.r * (1 + input.r_tol/100) * input.c * (1 + input.c_tol/100)); results["fc_min"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fc_min"] = Number.NaN; }
  try { const v = 1 / (2 * Math.PI * input.r * (1 - input.r_tol/100) * input.c * (1 - input.c_tol/100)); results["fc_max"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fc_max"] = Number.NaN; }
  return results;
}


export function calculateLow_pass_filter_calculator(input: Low_pass_filter_calculatorInput): Low_pass_filter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fc"]);
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


export interface Low_pass_filter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
