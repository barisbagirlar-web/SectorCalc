// Auto-generated from intermittent-fasting-calculator-schema.json
import * as z from 'zod';

export interface Intermittent_fasting_calculatorInput {
  fastingStartHour: number;
  fastingDurationHours: number;
  eatingWindowDurationHours: number;
  targetDailyCalories: number;
  currentWeight: number;
}

export const Intermittent_fasting_calculatorInputSchema = z.object({
  fastingStartHour: z.number().default(20),
  fastingDurationHours: z.number().default(16),
  eatingWindowDurationHours: z.number().default(8),
  targetDailyCalories: z.number().default(2000),
  currentWeight: z.number().default(70),
});

function evaluateAllFormulas(input: Intermittent_fasting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = i.input.eatingWindowDurationHours / i.input.fastingDurationHours; results["feedingToFastingRatio"] = Number.isFinite(v) ? v : 0; } catch { results["feedingToFastingRatio"] = 0; }
  try { const v = (i.input.fastingStartHour + i.input.eatingWindowDurationHours) % 24; results["eatingEndHour"] = Number.isFinite(v) ? v : 0; } catch { results["eatingEndHour"] = 0; }
  try { const v = i.input.fastingDurationHours + i.input.eatingWindowDurationHours; results["totalCycleHours"] = Number.isFinite(v) ? v : 0; } catch { results["totalCycleHours"] = 0; }
  try { const v = i.input.targetDailyCalories / i.input.eatingWindowDurationHours; results["caloriesPerHour"] = Number.isFinite(v) ? v : 0; } catch { results["caloriesPerHour"] = 0; }
  return results;
}


export function calculateIntermittent_fasting_calculator(input: Intermittent_fasting_calculatorInput): Intermittent_fasting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["feedingToFastingRatio"] ?? 0;
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


export interface Intermittent_fasting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
