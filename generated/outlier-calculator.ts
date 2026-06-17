// @ts-nocheck
// Auto-generated from outlier-calculator-schema.json
import * as z from 'zod';

export interface Outlier_calculatorInput {
  q1: number;
  q3: number;
  value: number;
  multiplier: number;
}

export const Outlier_calculatorInputSchema = z.object({
  q1: z.number().default(0),
  q3: z.number().default(0),
  value: z.number().default(0),
  multiplier: z.number().default(1.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Outlier_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.q3 - input.q1; results["iqr"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["iqr"] = 0; }
  try { const v = input.q1 - input.multiplier * (input.q3 - input.q1); results["lowerBound"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["lowerBound"] = 0; }
  try { const v = input.q3 + input.multiplier * (input.q3 - input.q1); results["upperBound"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["upperBound"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateOutlier_calculator(input: Outlier_calculatorInput): Outlier_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["upperBound"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
