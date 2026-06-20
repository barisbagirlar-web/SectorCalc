// Auto-generated from habit-tracker-calculator-schema.json
import * as z from 'zod';

export interface Habit_tracker_calculatorInput {
  daysTracked: number;
  successfulDays: number;
  targetDays: number;
  totalDays: number;
  currentStreak: number;
  bestStreak: number;
  dataConfidence?: number;
}

export const Habit_tracker_calculatorInputSchema = z.object({
  daysTracked: z.number().default(30),
  successfulDays: z.number().default(0),
  targetDays: z.number().default(30),
  totalDays: z.number().default(30),
  currentStreak: z.number().default(0),
  bestStreak: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Habit_tracker_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.successfulDays / input.totalDays) * 100; results["compliancePercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["compliancePercentage"] = Number.NaN; }
  try { const v = input.daysTracked / input.totalDays; results["trackingRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["trackingRatio"] = Number.NaN; }
  try { const v = input.bestStreak === 0 ? 0 : input.currentStreak / input.bestStreak; results["streakRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["streakRatio"] = Number.NaN; }
  return results;
}


export function calculateHabit_tracker_calculator(input: Habit_tracker_calculatorInput): Habit_tracker_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["compliancePercentage"]);
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


export interface Habit_tracker_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
