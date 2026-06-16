// Auto-generated from sleep-quality-calculator-schema.json
import * as z from 'zod';

export interface Sleep_quality_calculatorInput {
  totalSleepHours: number;
  timeToFallAsleep: number;
  awakeningsCount: number;
  sleepEfficiency: number;
}

export const Sleep_quality_calculatorInputSchema = z.object({
  totalSleepHours: z.number().default(7.5),
  timeToFallAsleep: z.number().default(15),
  awakeningsCount: z.number().default(1),
  sleepEfficiency: z.number().default(90),
});

function evaluateAllFormulas(input: Sleep_quality_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 100 * Math.exp(-((input.totalSleepHours - 7.5) ** 2) / 5); results["durationScore"] = Number.isFinite(v) ? v : 0; } catch { results["durationScore"] = 0; }
  try { const v = 100 * Math.exp(-input.timeToFallAsleep / 30); results["latencyScore"] = Number.isFinite(v) ? v : 0; } catch { results["latencyScore"] = 0; }
  try { const v = 100 * Math.exp(-input.awakeningsCount); results["disturbanceScore"] = Number.isFinite(v) ? v : 0; } catch { results["disturbanceScore"] = 0; }
  try { const v = input.sleepEfficiency; results["efficiencyScore"] = Number.isFinite(v) ? v : 0; } catch { results["efficiencyScore"] = 0; }
  try { const v = ((results["durationScore"] ?? 0) + (results["latencyScore"] ?? 0) + (results["disturbanceScore"] ?? 0) + (results["efficiencyScore"] ?? 0)) / 4; results["sleepQualityScore"] = Number.isFinite(v) ? v : 0; } catch { results["sleepQualityScore"] = 0; }
  return results;
}


export function calculateSleep_quality_calculator(input: Sleep_quality_calculatorInput): Sleep_quality_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sleepQualityScore"] ?? 0;
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


export interface Sleep_quality_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
