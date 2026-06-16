// Auto-generated from greywater-calculator-schema.json
import * as z from 'zod';

export interface Greywater_calculatorInput {
  numberOfPeople: number;
  dailyWaterUsagePerPerson: number;
  greywaterFraction: number;
  systemEfficiency: number;
  waterCostPerCubicMeter: number;
}

export const Greywater_calculatorInputSchema = z.object({
  numberOfPeople: z.number().default(4),
  dailyWaterUsagePerPerson: z.number().default(100),
  greywaterFraction: z.number().default(0.65),
  systemEfficiency: z.number().default(0.8),
  waterCostPerCubicMeter: z.number().default(3.5),
});

function evaluateAllFormulas(input: Greywater_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfPeople * input.dailyWaterUsagePerPerson * input.greywaterFraction; results["dailyGreywaterProduction"] = Number.isFinite(v) ? v : 0; } catch { results["dailyGreywaterProduction"] = 0; }
  try { const v = (results["dailyGreywaterProduction"] ?? 0) * input.systemEfficiency; results["dailyReusableWater"] = Number.isFinite(v) ? v : 0; } catch { results["dailyReusableWater"] = 0; }
  try { const v = (results["dailyReusableWater"] ?? 0) * 365 / 1000; results["annualWaterSaved"] = Number.isFinite(v) ? v : 0; } catch { results["annualWaterSaved"] = 0; }
  try { const v = (results["annualWaterSaved"] ?? 0) * input.waterCostPerCubicMeter; results["annualCostSaved"] = Number.isFinite(v) ? v : 0; } catch { results["annualCostSaved"] = 0; }
  return results;
}


export function calculateGreywater_calculator(input: Greywater_calculatorInput): Greywater_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyReusableWater"] ?? 0;
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


export interface Greywater_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
