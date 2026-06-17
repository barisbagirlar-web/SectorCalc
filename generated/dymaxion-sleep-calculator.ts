// Auto-generated from dymaxion-sleep-calculator-schema.json
import * as z from 'zod';

export interface Dymaxion_sleep_calculatorInput {
  napDurationMinutes: number;
  intervalHours: number;
  totalDays: number;
  baseSleepHours: number;
}

export const Dymaxion_sleep_calculatorInputSchema = z.object({
  napDurationMinutes: z.number().default(30),
  intervalHours: z.number().default(6),
  totalDays: z.number().default(7),
  baseSleepHours: z.number().default(8),
});

function evaluateAllFormulas(input: Dymaxion_sleep_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 24 / input.intervalHours; results["napsPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["napsPerDay"] = 0; }
  try { const v = (results["napsPerDay"] ?? 0) * input.totalDays; results["totalNaps"] = Number.isFinite(v) ? v : 0; } catch { results["totalNaps"] = 0; }
  try { const v = (results["totalNaps"] ?? 0) * input.napDurationMinutes; results["totalSleepMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalSleepMinutes"] = 0; }
  try { const v = (results["totalSleepMinutes"] ?? 0) / 60; results["totalSleepHours"] = Number.isFinite(v) ? v : 0; } catch { results["totalSleepHours"] = 0; }
  try { const v = ((results["totalSleepMinutes"] ?? 0) / (input.baseSleepHours * 60)) * 100; results["efficiencyPercent"] = Number.isFinite(v) ? v : 0; } catch { results["efficiencyPercent"] = 0; }
  results["__napsPerDay_toFixed_1____standard_Dymax"] = 0;
  results["__totalNaps_toFixed_1___"] = 0;
  results["__efficiencyPercent_toFixed_1_____lower_"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateDymaxion_sleep_calculator(input: Dymaxion_sleep_calculatorInput): Dymaxion_sleep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Dymaxion_sleep_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
