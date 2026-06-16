// Auto-generated from sample-size-calculator-schema.json
import * as z from 'zod';

export interface Sample_size_calculatorInput {
  populationSize: number;
  proportion: number;
  marginOfError: number;
  zScore: number;
}

export const Sample_size_calculatorInputSchema = z.object({
  populationSize: z.number().default(10000),
  proportion: z.number().default(0.5),
  marginOfError: z.number().default(0.05),
  zScore: z.number().default(1.96),
});

function evaluateAllFormulas(input: Sample_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.zScore**2 * input.proportion * (1 - input.proportion)) / (input.marginOfError**2); results["sampleSizeInfinite"] = Number.isFinite(v) ? v : 0; } catch { results["sampleSizeInfinite"] = 0; }
  try { const v = (results["sampleSizeInfinite"] ?? 0) / (1 + ((results["sampleSizeInfinite"] ?? 0) - 1) / input.populationSize); results["sampleSizeFinite"] = Number.isFinite(v) ? v : 0; } catch { results["sampleSizeFinite"] = 0; }
  return results;
}


export function calculateSample_size_calculator(input: Sample_size_calculatorInput): Sample_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sampleSizeFinite"] ?? 0;
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


export interface Sample_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
