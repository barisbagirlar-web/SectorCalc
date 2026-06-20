// Auto-generated from reps-in-reserve-calculator-schema.json
import * as z from 'zod';

export interface Reps_in_reserve_calculatorInput {
  totalLifespan: number;
  currentUsage: number;
  dailyUsageRate: number;
  safetyFactor: number;
  plannedProduction: number;
  dataConfidence?: number;
}

export const Reps_in_reserve_calculatorInputSchema = z.object({
  totalLifespan: z.number().default(10000),
  currentUsage: z.number().default(0),
  dailyUsageRate: z.number().default(100),
  safetyFactor: z.number().default(5),
  plannedProduction: z.number().default(5000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Reps_in_reserve_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalLifespan * (1 - input.safetyFactor / 100) - input.currentUsage; results["remainingReps"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["remainingReps"] = Number.NaN; }
  try { const v = (input.totalLifespan * (1 - input.safetyFactor / 100) - input.currentUsage) / input.dailyUsageRate; results["daysRemaining"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["daysRemaining"] = Number.NaN; }
  try { const v = input.currentUsage / (input.totalLifespan * (1 - input.safetyFactor / 100)) * 100; results["utilizationPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["utilizationPercentage"] = Number.NaN; }
  return results;
}


export function calculateReps_in_reserve_calculator(input: Reps_in_reserve_calculatorInput): Reps_in_reserve_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["remainingReps"]);
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


export interface Reps_in_reserve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
