// Auto-generated from reps-in-reserve-calculator-schema.json
import * as z from 'zod';

export interface Reps_in_reserve_calculatorInput {
  totalLifespan: number;
  currentUsage: number;
  dailyUsageRate: number;
  safetyFactor: number;
  plannedProduction: number;
}

export const Reps_in_reserve_calculatorInputSchema = z.object({
  totalLifespan: z.number().default(10000),
  currentUsage: z.number().default(0),
  dailyUsageRate: z.number().default(100),
  safetyFactor: z.number().default(5),
  plannedProduction: z.number().default(5000),
});

function evaluateAllFormulas(input: Reps_in_reserve_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalLifespan * (1 - input.safetyFactor / 100) - input.currentUsage; results["remainingReps"] = Number.isFinite(v) ? v : 0; } catch { results["remainingReps"] = 0; }
  try { const v = (input.totalLifespan * (1 - input.safetyFactor / 100) - input.currentUsage) / input.dailyUsageRate; results["daysRemaining"] = Number.isFinite(v) ? v : 0; } catch { results["daysRemaining"] = 0; }
  try { const v = input.currentUsage / (input.totalLifespan * (1 - input.safetyFactor / 100)) * 100; results["utilizationPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["utilizationPercentage"] = 0; }
  return results;
}


export function calculateReps_in_reserve_calculator(input: Reps_in_reserve_calculatorInput): Reps_in_reserve_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["remainingReps"] ?? 0;
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


export interface Reps_in_reserve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
