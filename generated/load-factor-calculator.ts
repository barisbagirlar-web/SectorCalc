// Auto-generated from load-factor-calculator-schema.json
import * as z from 'zod';

export interface Load_factor_calculatorInput {
  totalEnergy: number;
  peakDemand: number;
  numberOfDays: number;
  dailyOperatingHours: number;
}

export const Load_factor_calculatorInputSchema = z.object({
  totalEnergy: z.number().default(1000),
  peakDemand: z.number().default(200),
  numberOfDays: z.number().default(30),
  dailyOperatingHours: z.number().default(24),
});

function evaluateAllFormulas(input: Load_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.totalEnergy / (input.numberOfDays * input.dailyOperatingHours)) / input.peakDemand * 100).toFixed(2); results["loadFactorPercent"] = Number.isFinite(v) ? v : 0; } catch { results["loadFactorPercent"] = 0; }
  try { const v = (input.totalEnergy / (input.numberOfDays * input.dailyOperatingHours)).toFixed(2); results["averageLoad"] = Number.isFinite(v) ? v : 0; } catch { results["averageLoad"] = 0; }
  return results;
}


export function calculateLoad_factor_calculator(input: Load_factor_calculatorInput): Load_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["loadFactorPercent"] ?? 0;
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


export interface Load_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
