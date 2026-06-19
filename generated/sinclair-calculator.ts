// Auto-generated from sinclair-calculator-schema.json
import * as z from 'zod';

export interface Sinclair_calculatorInput {
  bodyweight: number;
  totalLifted: number;
  coefficientA: number;
  coefficientB: number;
  dataConfidence?: number;
}

export const Sinclair_calculatorInputSchema = z.object({
  bodyweight: z.number().default(80),
  totalLifted: z.number().default(200),
  coefficientA: z.number().default(0.722762521),
  coefficientB: z.number().default(193.609),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sinclair_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bodyweight / input.coefficientB; results["bodyweightRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bodyweightRatio"] = 0; }
  try { const v = input.bodyweight / input.coefficientB; results["bodyweightRatio_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bodyweightRatio_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSinclair_calculator(input: Sinclair_calculatorInput): Sinclair_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["bodyweightRatio_aux"]));
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


export interface Sinclair_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
