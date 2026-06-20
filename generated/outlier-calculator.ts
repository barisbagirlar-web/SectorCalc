// Auto-generated from outlier-calculator-schema.json
import * as z from 'zod';

export interface Outlier_calculatorInput {
  q1: number;
  q3: number;
  value: number;
  multiplier: number;
  dataConfidence?: number;
}

export const Outlier_calculatorInputSchema = z.object({
  q1: z.number().default(0),
  q3: z.number().default(0),
  value: z.number().default(0),
  multiplier: z.number().default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Outlier_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.q3 - input.q1; results["iqr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["iqr"] = Number.NaN; }
  try { const v = input.q1 - input.multiplier * (input.q3 - input.q1); results["lowerBound"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lowerBound"] = Number.NaN; }
  try { const v = input.q3 + input.multiplier * (input.q3 - input.q1); results["upperBound"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["upperBound"] = Number.NaN; }
  return results;
}


export function calculateOutlier_calculator(input: Outlier_calculatorInput): Outlier_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["upperBound"]);
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


export interface Outlier_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
