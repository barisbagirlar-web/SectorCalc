// Auto-generated from baby-height-percentile-calculator-schema.json
import * as z from 'zod';

export interface Baby_height_percentile_calculatorInput {
  sex: number;
  ageMonths: number;
  heightCm: number;
  L: number;
  M: number;
  S: number;
}

export const Baby_height_percentile_calculatorInputSchema = z.object({
  sex: z.number().default(0),
  ageMonths: z.number().default(12),
  heightCm: z.number().default(76),
  L: z.number().default(1),
  M: z.number().default(76),
  S: z.number().default(0.04),
});

function evaluateAllFormulas(input: Baby_height_percentile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.pow(input.heightCm / input.M, input.L) - 1) / (input.L * input.S); results["zScore"] = Number.isFinite(v) ? v : 0; } catch { results["zScore"] = 0; }
  try { const v = ((results["zScore"] ?? 0) > 0 ? 1 : -1) * Math.sqrt(1 - Math.exp(-(results["zScore"] ?? 0) * (results["zScore"] ?? 0) * (4 / Math.PI + 0.147 * (results["zScore"] ?? 0) * (results["zScore"] ?? 0)) / (1 + 0.147 * (results["zScore"] ?? 0) * (results["zScore"] ?? 0)))); results["erf"] = Number.isFinite(v) ? v : 0; } catch { results["erf"] = 0; }
  try { const v = 0.5 * (1 + (results["erf"] ?? 0) / Math.sqrt(2)) * 100; results["percentile"] = Number.isFinite(v) ? v : 0; } catch { results["percentile"] = 0; }
  return results;
}


export function calculateBaby_height_percentile_calculator(input: Baby_height_percentile_calculatorInput): Baby_height_percentile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["percentile"] ?? 0;
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


export interface Baby_height_percentile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
