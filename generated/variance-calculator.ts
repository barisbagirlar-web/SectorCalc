// Auto-generated from variance-calculator-schema.json
import * as z from 'zod';

export interface Variance_calculatorInput {
  n: number;
  sumX: number;
  sumX2: number;
  isPopulation: number;
}

export const Variance_calculatorInputSchema = z.object({
  n: z.number().default(1),
  sumX: z.number().default(0),
  sumX2: z.number().default(0),
  isPopulation: z.number().default(1),
});

function evaluateAllFormulas(input: Variance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.n > 1) ? ( (input.isPopulation == 1) ? (input.sumX2 - (input.sumX * input.sumX) / input.n) / input.n : (input.sumX2 - (input.sumX * input.sumX) / input.n) / (input.n - 1) ) : 0; results["variance"] = Number.isFinite(v) ? v : 0; } catch { results["variance"] = 0; }
  try { const v = (input.n > 0) ? input.sumX / input.n : 0; results["mean"] = Number.isFinite(v) ? v : 0; } catch { results["mean"] = 0; }
  try { const v = Math.sqrt( Math.max(0, (input.n > 1) ? ( (input.isPopulation == 1) ? (input.sumX2 - (input.sumX * input.sumX) / input.n) / input.n : (input.sumX2 - (input.sumX * input.sumX) / input.n) / (input.n - 1) ) : 0 ) ); results["standardDeviation"] = Number.isFinite(v) ? v : 0; } catch { results["standardDeviation"] = 0; }
  try { const v = (input.n > 1) ? (input.sumX2 - (input.sumX * input.sumX) / input.n) : 0; results["sumOfSquaredDeviations"] = Number.isFinite(v) ? v : 0; } catch { results["sumOfSquaredDeviations"] = 0; }
  return results;
}


export function calculateVariance_calculator(input: Variance_calculatorInput): Variance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["variance"] ?? 0;
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


export interface Variance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
