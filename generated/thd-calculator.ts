// Auto-generated from thd-calculator-schema.json
import * as z from 'zod';

export interface Thd_calculatorInput {
  V1: number;
  V2: number;
  V3: number;
  V4: number;
  V5: number;
  V6: number;
  V7: number;
  V8: number;
  dataConfidence?: number;
}

export const Thd_calculatorInputSchema = z.object({
  V1: z.number().default(230),
  V2: z.number().default(0),
  V3: z.number().default(0),
  V4: z.number().default(0),
  V5: z.number().default(0),
  V6: z.number().default(0),
  V7: z.number().default(0),
  V8: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Thd_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.V2**2 + input.V3**2 + input.V4**2 + input.V5**2 + input.V6**2 + input.V7**2 + input.V8**2; results["sumOfSquares"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sumOfSquares"] = 0; }
  try { const v = input.V2**2 + input.V3**2 + input.V4**2 + input.V5**2 + input.V6**2 + input.V7**2 + input.V8**2; results["sumOfSquares_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sumOfSquares_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateThd_calculator(input: Thd_calculatorInput): Thd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sumOfSquares_aux"]);
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


export interface Thd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
