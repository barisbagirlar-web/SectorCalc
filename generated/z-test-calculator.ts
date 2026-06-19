// Auto-generated from z-test-calculator-schema.json
import * as z from 'zod';

export interface Z_test_calculatorInput {
  sample_mean: number;
  population_mean: number;
  standard_deviation: number;
  sample_size: number;
  alpha: number;
  tails: number;
  dataConfidence?: number;
}

export const Z_test_calculatorInputSchema = z.object({
  sample_mean: z.number().default(0),
  population_mean: z.number().default(0),
  standard_deviation: z.number().default(1),
  sample_size: z.number().default(30),
  alpha: z.number().default(0.05),
  tails: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Z_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sample_mean * input.population_mean * input.standard_deviation * input.sample_size; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.sample_mean * input.population_mean * input.standard_deviation * input.sample_size * (input.alpha * input.tails); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.alpha * input.tails; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateZ_test_calculator(input: Z_test_calculatorInput): Z_test_calculatorOutput {
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


export interface Z_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
