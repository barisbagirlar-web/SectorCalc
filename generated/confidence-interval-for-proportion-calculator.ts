// Auto-generated from confidence-interval-for-proportion-calculator-schema.json
import * as z from 'zod';

export interface Confidence_interval_for_proportion_calculatorInput {
  sampleSize: number;
  successes: number;
  zValue: number;
  confidenceLevel: number;
  dataConfidence?: number;
}

export const Confidence_interval_for_proportion_calculatorInputSchema = z.object({
  sampleSize: z.number().default(100),
  successes: z.number().default(50),
  zValue: z.number().default(1.96),
  confidenceLevel: z.number().default(0.95),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Confidence_interval_for_proportion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.successes / input.sampleSize; results["p"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["p"] = 0; }
  try { const v = input.successes / input.sampleSize; results["p_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["p_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConfidence_interval_for_proportion_calculator(input: Confidence_interval_for_proportion_calculatorInput): Confidence_interval_for_proportion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["p_aux"]);
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


export interface Confidence_interval_for_proportion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
