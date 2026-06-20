// Auto-generated from manova-calculator-schema.json
import * as z from 'zod';

export interface Manova_calculatorInput {
  n1: number;
  n2: number;
  d1: number;
  d2: number;
  v1: number;
  v2: number;
  dataConfidence?: number;
}

export const Manova_calculatorInputSchema = z.object({
  n1: z.number().default(30),
  n2: z.number().default(30),
  d1: z.number().default(0.5),
  d2: z.number().default(0.3),
  v1: z.number().default(1),
  v2: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Manova_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.n1 * input.n2 / (input.n1 + input.n2)) * ( (input.d1 * input.d1) / input.v1 + (input.d2 * input.d2) / input.v2 ); results["T2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["T2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["T2"])) * (input.n1 + input.n2 - 3) / (2 * (input.n1 + input.n2 - 2)); results["F_stat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["F_stat"] = Number.NaN; }
  try { const v = input.n1 + input.n2 - 3; results["df2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["df2"] = Number.NaN; }
  return results;
}


export function calculateManova_calculator(input: Manova_calculatorInput): Manova_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["T2"]);
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


export interface Manova_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
