// Auto-generated from sleep-quality-calculator-schema.json
import * as z from 'zod';

export interface Sleep_quality_calculatorInput {
  totalSleepHours: number;
  timeToFallAsleep: number;
  awakeningsCount: number;
  sleepEfficiency: number;
  dataConfidence?: number;
}

export const Sleep_quality_calculatorInputSchema = z.object({
  totalSleepHours: z.number().default(7.5),
  timeToFallAsleep: z.number().default(15),
  awakeningsCount: z.number().default(1),
  sleepEfficiency: z.number().default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sleep_quality_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalSleepHours / 8 * 100; results["durationScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["durationScore"] = Number.NaN; }
  try { const v = input.sleepEfficiency; results["efficiencyScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["efficiencyScore"] = Number.NaN; }
  return results;
}


export function calculateSleep_quality_calculator(input: Sleep_quality_calculatorInput): Sleep_quality_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["efficiencyScore"]);
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


export interface Sleep_quality_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
