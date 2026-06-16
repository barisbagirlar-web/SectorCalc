// Auto-generated from binomial-probability-calculator-schema.json
import * as z from 'zod';

export interface Binomial_probability_calculatorInput {
  n: number;
  k: number;
  p: number;
  precision: number;
}

export const Binomial_probability_calculatorInputSchema = z.object({
  n: z.number().default(10),
  k: z.number().default(5),
  p: z.number().default(0.5),
  precision: z.number().default(4),
});

function evaluateAllFormulas(input: Binomial_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.n * Math.log(input.n) - input.n + 0.5 * Math.log(2 * Math.PI * input.n) - (input.k * Math.log(input.k) - input.k + 0.5 * Math.log(2 * Math.PI * input.k)) - ((input.n - input.k) * Math.log(input.n - input.k) - (input.n - input.k) + 0.5 * Math.log(2 * Math.PI * (input.n - input.k))); results["logCombination"] = Number.isFinite(v) ? v : 0; } catch { results["logCombination"] = 0; }
  try { const v = Math.exp((results["logCombination"] ?? 0) + input.k * Math.log(input.p) + (input.n - input.k) * Math.log(1 - input.p)); results["exactProbability"] = Number.isFinite(v) ? v : 0; } catch { results["exactProbability"] = 0; }
  try { const v = Number((Math.exp((results["logCombination"] ?? 0) + input.k * Math.log(input.p) + (input.n - input.k) * Math.log(1 - input.p))).toFixed(input.precision)); results["probability"] = Number.isFinite(v) ? v : 0; } catch { results["probability"] = 0; }
  return results;
}


export function calculateBinomial_probability_calculator(input: Binomial_probability_calculatorInput): Binomial_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["probability"] ?? 0;
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


export interface Binomial_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
