// Auto-generated from f-distribution-calculator-schema.json
import * as z from 'zod';

export interface F_distribution_calculatorInput {
  ssBetween: number;
  dfBetween: number;
  ssWithin: number;
  dfWithin: number;
}

export const F_distribution_calculatorInputSchema = z.object({
  ssBetween: z.number().default(0),
  dfBetween: z.number().default(1),
  ssWithin: z.number().default(0),
  dfWithin: z.number().default(1),
});

function evaluateAllFormulas(input: F_distribution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ssBetween / input.dfBetween; results["meanSquareBetween"] = Number.isFinite(v) ? v : 0; } catch { results["meanSquareBetween"] = 0; }
  try { const v = input.ssWithin / input.dfWithin; results["meanSquareWithin"] = Number.isFinite(v) ? v : 0; } catch { results["meanSquareWithin"] = 0; }
  try { const v = (input.ssBetween / input.dfBetween) / (input.ssWithin / input.dfWithin); results["fStatistic"] = Number.isFinite(v) ? v : 0; } catch { results["fStatistic"] = 0; }
  return results;
}


export function calculateF_distribution_calculator(input: F_distribution_calculatorInput): F_distribution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fStatistic"] ?? 0;
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


export interface F_distribution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
