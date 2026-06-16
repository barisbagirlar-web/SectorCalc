// Auto-generated from habit-tracker-calculator-schema.json
import * as z from 'zod';

export interface Habit_tracker_calculatorInput {
  daysTracked: number;
  successfulDays: number;
  targetDays: number;
  totalDays: number;
  currentStreak: number;
  bestStreak: number;
}

export const Habit_tracker_calculatorInputSchema = z.object({
  daysTracked: z.number().default(30),
  successfulDays: z.number().default(0),
  targetDays: z.number().default(30),
  totalDays: z.number().default(30),
  currentStreak: z.number().default(0),
  bestStreak: z.number().default(0),
});

function evaluateAllFormulas(input: Habit_tracker_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.successfulDays / input.totalDays) * 100; results["compliancePercentage"] = Number.isFinite(v) ? v : 0; } catch { results["compliancePercentage"] = 0; }
  try { const v = input.daysTracked / input.totalDays; results["trackingRatio"] = Number.isFinite(v) ? v : 0; } catch { results["trackingRatio"] = 0; }
  try { const v = input.bestStreak === 0 ? 0 : input.currentStreak / input.bestStreak; results["streakRatio"] = Number.isFinite(v) ? v : 0; } catch { results["streakRatio"] = 0; }
  return results;
}


export function calculateHabit_tracker_calculator(input: Habit_tracker_calculatorInput): Habit_tracker_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["compliancePercentage"] ?? 0;
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


export interface Habit_tracker_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
