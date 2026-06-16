// Auto-generated from wrestling-weight-cut-calculator-schema.json
import * as z from 'zod';

export interface Wrestling_weight_cut_calculatorInput {
  currentWeight: number;
  targetWeight: number;
  hoursUntilWeighIn: number;
  bodyFatPercentage: number;
  maxDehydrationPercentage: number;
}

export const Wrestling_weight_cut_calculatorInputSchema = z.object({
  currentWeight: z.number().default(80),
  targetWeight: z.number().default(75),
  hoursUntilWeighIn: z.number().default(24),
  bodyFatPercentage: z.number().default(15),
  maxDehydrationPercentage: z.number().default(5),
});

function evaluateAllFormulas(input: Wrestling_weight_cut_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentWeight - input.targetWeight; results["requiredWeightLoss"] = Number.isFinite(v) ? v : 0; } catch { results["requiredWeightLoss"] = 0; }
  try { const v = input.currentWeight * input.maxDehydrationPercentage / 100; results["maxSafeWaterLoss"] = Number.isFinite(v) ? v : 0; } catch { results["maxSafeWaterLoss"] = 0; }
  try { const v = Math.max(0, (results["requiredWeightLoss"] ?? 0) - (results["maxSafeWaterLoss"] ?? 0)); results["excessWeight"] = Number.isFinite(v) ? v : 0; } catch { results["excessWeight"] = 0; }
  try { const v = (results["requiredWeightLoss"] ?? 0) / input.hoursUntilWeighIn; results["cutRatePerHour"] = Number.isFinite(v) ? v : 0; } catch { results["cutRatePerHour"] = 0; }
  return results;
}


export function calculateWrestling_weight_cut_calculator(input: Wrestling_weight_cut_calculatorInput): Wrestling_weight_cut_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredWeightLoss"] ?? 0;
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


export interface Wrestling_weight_cut_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
