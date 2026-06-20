// Auto-generated from wrestling-weight-cut-calculator-schema.json
import * as z from 'zod';

export interface Wrestling_weight_cut_calculatorInput {
  currentWeight: number;
  targetWeight: number;
  hoursUntilWeighIn: number;
  bodyFatPercentage: number;
  maxDehydrationPercentage: number;
  dataConfidence?: number;
}

export const Wrestling_weight_cut_calculatorInputSchema = z.object({
  currentWeight: z.number().default(80),
  targetWeight: z.number().default(75),
  hoursUntilWeighIn: z.number().default(24),
  bodyFatPercentage: z.number().default(15),
  maxDehydrationPercentage: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wrestling_weight_cut_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentWeight - input.targetWeight; results["requiredWeightLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredWeightLoss"] = Number.NaN; }
  try { const v = input.currentWeight * input.maxDehydrationPercentage / 100; results["maxSafeWaterLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxSafeWaterLoss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["requiredWeightLoss"])) / input.hoursUntilWeighIn; results["cutRatePerHour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cutRatePerHour"] = Number.NaN; }
  return results;
}


export function calculateWrestling_weight_cut_calculator(input: Wrestling_weight_cut_calculatorInput): Wrestling_weight_cut_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredWeightLoss"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
