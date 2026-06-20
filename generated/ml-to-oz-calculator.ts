// Auto-generated from ml-to-oz-calculator-schema.json
import * as z from 'zod';

export interface Ml_to_oz_calculatorInput {
  volume_ml: number;
  factor_us: number;
  factor_uk: number;
  precision: number;
  dataConfidence?: number;
}

export const Ml_to_oz_calculatorInputSchema = z.object({
  volume_ml: z.number().default(100),
  factor_us: z.number().default(0.033814),
  factor_uk: z.number().default(0.035195),
  precision: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ml_to_oz_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volume_ml * input.factor_us; results["us_oz"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["us_oz"] = Number.NaN; }
  try { const v = input.volume_ml * input.factor_uk; results["uk_oz"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["uk_oz"] = Number.NaN; }
  return results;
}


export function calculateMl_to_oz_calculator(input: Ml_to_oz_calculatorInput): Ml_to_oz_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["uk_oz"]);
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


export interface Ml_to_oz_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
