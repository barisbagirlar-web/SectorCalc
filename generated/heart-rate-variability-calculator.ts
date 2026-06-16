// Auto-generated from heart-rate-variability-calculator-schema.json
import * as z from 'zod';

export interface Heart_rate_variability_calculatorInput {
  numIntervals: number;
  sumRR: number;
  sumSquaredRR: number;
  sumSuccessiveDiffsSq: number;
  countNN50: number;
}

export const Heart_rate_variability_calculatorInputSchema = z.object({
  numIntervals: z.number().default(100),
  sumRR: z.number().default(80000),
  sumSquaredRR: z.number().default(64250000),
  sumSuccessiveDiffsSq: z.number().default(89100),
  countNN50: z.number().default(10),
});

function evaluateAllFormulas(input: Heart_rate_variability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(input.sumSuccessiveDiffsSq / (input.numIntervals - 1)); results["RMSSD"] = Number.isFinite(v) ? v : 0; } catch { results["RMSSD"] = 0; }
  try { const v = Math.sqrt(input.sumSquaredRR / input.numIntervals - Math.pow(input.sumRR / input.numIntervals, 2)); results["SDNN"] = Number.isFinite(v) ? v : 0; } catch { results["SDNN"] = 0; }
  try { const v = (input.countNN50 / (input.numIntervals - 1)) * 100; results["pNN50"] = Number.isFinite(v) ? v : 0; } catch { results["pNN50"] = 0; }
  try { const v = input.sumRR / input.numIntervals; results["meanRR"] = Number.isFinite(v) ? v : 0; } catch { results["meanRR"] = 0; }
  return results;
}


export function calculateHeart_rate_variability_calculator(input: Heart_rate_variability_calculatorInput): Heart_rate_variability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["RMSSD"] ?? 0;
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


export interface Heart_rate_variability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
