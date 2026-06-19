// Auto-generated from effect-size-calculator-schema.json
import * as z from 'zod';

export interface Effect_size_calculatorInput {
  mean1: number;
  mean2: number;
  sd1: number;
  sd2: number;
  n1: number;
  n2: number;
  dataConfidence?: number;
}

export const Effect_size_calculatorInputSchema = z.object({
  mean1: z.number().default(0),
  mean2: z.number().default(0),
  sd1: z.number().default(1),
  sd2: z.number().default(1),
  n1: z.number().default(30),
  n2: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Effect_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mean1 - input.mean2; results["meanDiff"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meanDiff"] = 0; }
  try { const v = input.mean1 - input.mean2; results["meanDiff_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meanDiff_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEffect_size_calculator(input: Effect_size_calculatorInput): Effect_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["meanDiff_aux"]);
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


export interface Effect_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
