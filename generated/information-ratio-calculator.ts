// Auto-generated from information-ratio-calculator-schema.json
import * as z from 'zod';

export interface Information_ratio_calculatorInput {
  portfolioReturn: number;
  benchmarkReturn: number;
  trackingError: number;
  periodsPerYear: number;
}

export const Information_ratio_calculatorInputSchema = z.object({
  portfolioReturn: z.number().default(10),
  benchmarkReturn: z.number().default(8),
  trackingError: z.number().default(5),
  periodsPerYear: z.number().default(12),
});

function evaluateAllFormulas(input: Information_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.portfolioReturn - input.benchmarkReturn) / input.trackingError * Math.sqrt(input.periodsPerYear); results["informationRatio"] = Number.isFinite(v) ? v : 0; } catch { results["informationRatio"] = 0; }
  try { const v = input.portfolioReturn - input.benchmarkReturn; results["activeReturn"] = Number.isFinite(v) ? v : 0; } catch { results["activeReturn"] = 0; }
  try { const v = (input.portfolioReturn - input.benchmarkReturn) * Math.sqrt(input.periodsPerYear); results["annualizedActiveReturn"] = Number.isFinite(v) ? v : 0; } catch { results["annualizedActiveReturn"] = 0; }
  return results;
}


export function calculateInformation_ratio_calculator(input: Information_ratio_calculatorInput): Information_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["informationRatio"] ?? 0;
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


export interface Information_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
