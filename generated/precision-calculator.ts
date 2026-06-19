// Auto-generated from precision-calculator-schema.json
import * as z from 'zod';

export interface Precision_calculatorInput {
  usl: number;
  lsl: number;
  target: number;
  mean: number;
  stddev: number;
  dataConfidence?: number;
}

export const Precision_calculatorInputSchema = z.object({
  usl: z.number().default(10),
  lsl: z.number().default(0),
  target: z.number().default(5),
  mean: z.number().default(5),
  stddev: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Precision_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.usl - input.lsl) / (6 * input.stddev); results["cp"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cp"] = 0; }
  try { const v = (input.usl - input.lsl) / (6 * input.stddev); results["cp_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cp_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePrecision_calculator(input: Precision_calculatorInput): Precision_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["cp_aux"]));
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


export interface Precision_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
