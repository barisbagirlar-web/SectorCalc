// Auto-generated from normality-test-calculator-schema.json
import * as z from 'zod';

export interface Normality_test_calculatorInput {
  sampleSize: number;
  skewness: number;
  excessKurtosis: number;
  criticalZ: number;
  dataConfidence?: number;
}

export const Normality_test_calculatorInputSchema = z.object({
  sampleSize: z.number().default(30),
  skewness: z.number().default(0),
  excessKurtosis: z.number().default(0),
  criticalZ: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Normality_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sampleSize * input.skewness * input.excessKurtosis * input.criticalZ; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.sampleSize * input.skewness * input.excessKurtosis * input.criticalZ; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNormality_test_calculator(input: Normality_test_calculatorInput): Normality_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Normality_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
