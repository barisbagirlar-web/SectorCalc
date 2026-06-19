// Auto-generated from probability-calculator-schema.json
import * as z from 'zod';

export interface Probability_calculatorInput {
  defect_count: number;
  sample_size: number;
  sigma_shift: number;
  distribution_type: string;
  confidence_level: string;
  use_historical_bias: boolean;
  dataConfidence?: number;
}

export const Probability_calculatorInputSchema = z.object({
  defect_count: z.number().min(0).max(1000000).default(10),
  sample_size: z.number().min(1).max(10000000).default(1000),
  sigma_shift: z.number().min(0).max(3).default(1.5),
  distribution_type: z.enum(['binomial', 'poisson', 'normal']).default('binomial'),
  confidence_level: z.enum(['90', '95', '99']).default('95'),
  use_historical_bias: z.boolean().default(false),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.defect_count * input.sample_size * input.sigma_shift; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.defect_count * input.sample_size * input.sigma_shift; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateProbability_calculator(input: Probability_calculatorInput): Probability_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Historical comparison"],
  };
}


export interface Probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
