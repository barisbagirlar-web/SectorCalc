// Auto-generated from normal-distribution-calculator-schema.json
import * as z from 'zod';

export interface Normal_distribution_calculatorInput {
  mean: number;
  stdDev: number;
  x: number;
  dataConfidence?: number;
}

export const Normal_distribution_calculatorInputSchema = z.object({
  mean: z.number().default(0),
  stdDev: z.number().default(1),
  x: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Normal_distribution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.x - input.mean) / input.stdDev; results["zScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["zScore"] = Number.NaN; }
  try { const v = (input.x - input.mean) / input.stdDev; results["zScore_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["zScore_aux"] = Number.NaN; }
  return results;
}


export function calculateNormal_distribution_calculator(input: Normal_distribution_calculatorInput): Normal_distribution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["zScore_aux"]);
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


export interface Normal_distribution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
