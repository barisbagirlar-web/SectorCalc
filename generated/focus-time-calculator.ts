// Auto-generated from focus-time-calculator-schema.json
import * as z from 'zod';

export interface Focus_time_calculatorInput {
  totalWorkHours: number;
  breakHours: number;
  meetingHours: number;
  interruptionCount: number;
  avgInterruptionDuration: number;
}

export const Focus_time_calculatorInputSchema = z.object({
  totalWorkHours: z.number().default(8),
  breakHours: z.number().default(1),
  meetingHours: z.number().default(1.5),
  interruptionCount: z.number().default(10),
  avgInterruptionDuration: z.number().default(5),
});

function evaluateAllFormulas(input: Focus_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.breakHours; results["breakOut"] = Number.isFinite(v) ? v : 0; } catch { results["breakOut"] = 0; }
  try { const v = input.meetingHours; results["meetingOut"] = Number.isFinite(v) ? v : 0; } catch { results["meetingOut"] = 0; }
  try { const v = input.interruptionCount * input.avgInterruptionDuration / 60; results["interruptionOut"] = Number.isFinite(v) ? v : 0; } catch { results["interruptionOut"] = 0; }
  try { const v = (results["breakOut"] ?? 0) + (results["meetingOut"] ?? 0) + (results["interruptionOut"] ?? 0); results["nonFocusOut"] = Number.isFinite(v) ? v : 0; } catch { results["nonFocusOut"] = 0; }
  try { const v = input.totalWorkHours - (results["nonFocusOut"] ?? 0); results["focusOut"] = Number.isFinite(v) ? v : 0; } catch { results["focusOut"] = 0; }
  return results;
}


export function calculateFocus_time_calculator(input: Focus_time_calculatorInput): Focus_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["focusOut"] ?? 0;
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


export interface Focus_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
