// Auto-generated from bias-variance-tradeoff-calculator-schema.json
import * as z from 'zod';

export interface Bias_variance_tradeoff_calculatorInput {
  averagePrediction: number;
  trueValue: number;
  variance: number;
  irreducibleError: number;
  dataConfidence?: number;
}

export const Bias_variance_tradeoff_calculatorInputSchema = z.object({
  averagePrediction: z.number().default(0),
  trueValue: z.number().default(0),
  variance: z.number().default(1),
  irreducibleError: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bias_variance_tradeoff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.averagePrediction * input.trueValue * input.variance * input.irreducibleError; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.averagePrediction * input.trueValue * input.variance * input.irreducibleError; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBias_variance_tradeoff_calculator(input: Bias_variance_tradeoff_calculatorInput): Bias_variance_tradeoff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Bias_variance_tradeoff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
