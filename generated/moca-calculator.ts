// Auto-generated from moca-calculator-schema.json
import * as z from 'zod';

export interface Moca_calculatorInput {
  mean: number;
  stddev: number;
  usl: number;
  lsl: number;
  dataConfidence?: number;
}

export const Moca_calculatorInputSchema = z.object({
  mean: z.number().default(0),
  stddev: z.number().default(1),
  usl: z.number().default(3),
  lsl: z.number().default(-3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Moca_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.usl - input.lsl) / (6 * input.stddev); results["Cp"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Cp"] = 0; }
  try { const v = (input.usl - input.mean) / (3 * input.stddev); results["CPU"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["CPU"] = 0; }
  try { const v = (input.mean - input.lsl) / (3 * input.stddev); results["CPL"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["CPL"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMoca_calculator(input: Moca_calculatorInput): Moca_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["CPL"]));
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


export interface Moca_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
