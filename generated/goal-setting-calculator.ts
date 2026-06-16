// Auto-generated from goal-setting-calculator-schema.json
import * as z from 'zod';

export interface Goal_setting_calculatorInput {
  currentOEE: number;
  targetOEE: number;
  timeframe: number;
  currentAvailability: number;
  currentPerformance: number;
  currentQuality: number;
}

export const Goal_setting_calculatorInputSchema = z.object({
  currentOEE: z.number().default(70),
  targetOEE: z.number().default(85),
  timeframe: z.number().default(6),
  currentAvailability: z.number().default(80),
  currentPerformance: z.number().default(90),
  currentQuality: z.number().default(95),
});

function evaluateAllFormulas(input: Goal_setting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.targetOEE - input.currentOEE; results["deltaOEE"] = Number.isFinite(v) ? v : 0; } catch { results["deltaOEE"] = 0; }
  try { const v = (results["deltaOEE"] ?? 0) / input.timeframe; results["monthlyOEEincrease"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyOEEincrease"] = 0; }
  return results;
}


export function calculateGoal_setting_calculator(input: Goal_setting_calculatorInput): Goal_setting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyOEEincrease"] ?? 0;
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


export interface Goal_setting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
