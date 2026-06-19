// Auto-generated from hypothesis-testing-calculator-schema.json
import * as z from 'zod';

export interface Hypothesis_testing_calculatorInput {
  sampleMean: number;
  nullMean: number;
  stdDev: number;
  sampleSize: number;
  alpha: number;
  tails: number;
  dataConfidence?: number;
}

export const Hypothesis_testing_calculatorInputSchema = z.object({
  sampleMean: z.number().default(0),
  nullMean: z.number().default(0),
  stdDev: z.number().default(1),
  sampleSize: z.number().default(30),
  alpha: z.number().default(0.05),
  tails: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hypothesis_testing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sampleMean * input.nullMean * input.stdDev * input.sampleSize; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.sampleMean * input.nullMean * input.stdDev * input.sampleSize * (input.alpha * input.tails); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.alpha * input.tails; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHypothesis_testing_calculator(input: Hypothesis_testing_calculatorInput): Hypothesis_testing_calculatorOutput {
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


export interface Hypothesis_testing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
