// Auto-generated from ml-to-oz-calculator-schema.json
import * as z from 'zod';

export interface Ml_to_oz_calculatorInput {
  volume_ml: number;
  factor_us: number;
  factor_uk: number;
  precision: number;
}

export const Ml_to_oz_calculatorInputSchema = z.object({
  volume_ml: z.number().default(100),
  factor_us: z.number().default(0.033814),
  factor_uk: z.number().default(0.035195),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Ml_to_oz_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round(input.volume_ml * input.factor_us * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateMl_to_oz_calculator(input: Ml_to_oz_calculatorInput): Ml_to_oz_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["US"] ?? 0;
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


export interface Ml_to_oz_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
