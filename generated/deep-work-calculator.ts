// Auto-generated from deep-work-calculator-schema.json
import * as z from 'zod';

export interface Deep_work_calculatorInput {
  dailyWorkHours: number;
  meetingCount: number;
  meetingDuration: number;
  interruptionCount: number;
  recoveryTime: number;
  deepWorkBlock: number;
  shallowWorkPercent: number;
}

export const Deep_work_calculatorInputSchema = z.object({
  dailyWorkHours: z.number().default(8),
  meetingCount: z.number().default(3),
  meetingDuration: z.number().default(30),
  interruptionCount: z.number().default(10),
  recoveryTime: z.number().default(15),
  deepWorkBlock: z.number().default(90),
  shallowWorkPercent: z.number().default(30),
});

function evaluateAllFormulas(input: Deep_work_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyWorkHours * 60; results["totalMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalMinutes"] = 0; }
  try { const v = input.meetingCount * input.meetingDuration; results["meetingTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["meetingTimeMinutes"] = 0; }
  try { const v = input.interruptionCount * input.recoveryTime; results["interruptionTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["interruptionTimeMinutes"] = 0; }
  try { const v = (input.shallowWorkPercent / 100) * (results["totalMinutes"] ?? 0); results["shallowTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["shallowTimeMinutes"] = 0; }
  try { const v = Math.max(0, (results["totalMinutes"] ?? 0) - (results["meetingTimeMinutes"] ?? 0) - (results["interruptionTimeMinutes"] ?? 0) - (results["shallowTimeMinutes"] ?? 0)); results["deepWorkTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["deepWorkTimeMinutes"] = 0; }
  try { const v = (results["deepWorkTimeMinutes"] ?? 0) / 60; results["effectiveDeepWorkHours"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveDeepWorkHours"] = 0; }
  try { const v = (results["shallowTimeMinutes"] ?? 0) / 60; results["shallowWorkHours"] = Number.isFinite(v) ? v : 0; } catch { results["shallowWorkHours"] = 0; }
  try { const v = (results["meetingTimeMinutes"] ?? 0) / 60; results["meetingHours"] = Number.isFinite(v) ? v : 0; } catch { results["meetingHours"] = 0; }
  try { const v = (results["interruptionTimeMinutes"] ?? 0) / 60; results["interruptionHours"] = Number.isFinite(v) ? v : 0; } catch { results["interruptionHours"] = 0; }
  try { const v = (results["totalMinutes"] ?? 0) > 0 ? (((results["totalMinutes"] ?? 0) - (results["deepWorkTimeMinutes"] ?? 0)) / (results["totalMinutes"] ?? 0)) * 100 : 0; results["productivityLossPercent"] = Number.isFinite(v) ? v : 0; } catch { results["productivityLossPercent"] = 0; }
  return results;
}


export function calculateDeep_work_calculator(input: Deep_work_calculatorInput): Deep_work_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effectiveDeepWorkHours"] ?? 0;
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


export interface Deep_work_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
