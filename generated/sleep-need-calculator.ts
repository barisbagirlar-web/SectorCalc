// Auto-generated from sleep-need-calculator-schema.json
import * as z from 'zod';

export interface Sleep_need_calculatorInput {
  age: number;
  shiftType: number;
  sleepQuality: number;
  desiredWakeUp: number;
  sleepLatency: number;
  physicalActivity: number;
}

export const Sleep_need_calculatorInputSchema = z.object({
  age: z.number().default(30),
  shiftType: z.number().default(0),
  sleepQuality: z.number().default(5),
  desiredWakeUp: z.number().default(420),
  sleepLatency: z.number().default(15),
  physicalActivity: z.number().default(2),
});

function evaluateAllFormulas(input: Sleep_need_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.age < 18 ? 540 : (input.age > 65 ? 450 : 480)); results["baseSleepMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["baseSleepMinutes"] = 0; }
  try { const v = (input.shiftType === 1 ? 30 : (input.shiftType === 2 ? 15 : 0)); results["shiftAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["shiftAdjustment"] = 0; }
  try { const v = (input.sleepQuality - 5) * 5; results["qualityAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["qualityAdjustment"] = 0; }
  try { const v = (input.physicalActivity > 5 ? -10 : 0); results["activityAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["activityAdjustment"] = 0; }
  try { const v = (results["baseSleepMinutes"] ?? 0) + (results["shiftAdjustment"] ?? 0) + (results["qualityAdjustment"] ?? 0) + (results["activityAdjustment"] ?? 0); results["totalSleepMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalSleepMinutes"] = 0; }
  try { const v = (input.desiredWakeUp - (results["totalSleepMinutes"] ?? 0) + 1440) % 1440; results["bedtimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["bedtimeMinutes"] = 0; }
  try { const v = (results["totalSleepMinutes"] ?? 0) / 60; results["sleepDurationHours"] = Number.isFinite(v) ? v : 0; } catch { results["sleepDurationHours"] = 0; }
  results["____Math_floor_bedtimeMinutes___60______"] = 0;
  results["____Math_round_totalSleepMinutes______mi"] = 0;
  try { const v = 'Recommended sleep: ' + Math.round((results["totalSleepMinutes"] ?? 0) / 60 * 10) / 10 + ' hours'; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateSleep_need_calculator(input: Sleep_need_calculatorInput): Sleep_need_calculatorOutput {
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


export interface Sleep_need_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
