// Auto-generated from nap-calculator-schema.json
import * as z from 'zod';

export interface Nap_calculatorInput {
  currentTimeHours: number;
  wakeUpTimeHours: number;
  sleepCycleMinutes: number;
  minNapMinutes: number;
  maxNapMinutes: number;
}

export const Nap_calculatorInputSchema = z.object({
  currentTimeHours: z.number().default(14),
  wakeUpTimeHours: z.number().default(17),
  sleepCycleMinutes: z.number().default(90),
  minNapMinutes: z.number().default(10),
  maxNapMinutes: z.number().default(30),
});

function evaluateAllFormulas(input: Nap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.wakeUpTimeHours - input.currentTimeHours) * 60; results["availableMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["availableMinutes"] = 0; }
  try { const v = ((results["availableMinutes"] ?? 0) >= input.sleepCycleMinutes) ? input.sleepCycleMinutes : (((results["availableMinutes"] ?? 0) >= input.minNapMinutes) ? input.minNapMinutes : 0); results["recommendedNapMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedNapMinutes"] = 0; }
  try { const v = input.currentTimeHours + input.sleepCycleMinutes/60; results["cycleNapWakeTime"] = Number.isFinite(v) ? v : 0; } catch { results["cycleNapWakeTime"] = 0; }
  try { const v = input.currentTimeHours + input.minNapMinutes/60; results["shortNapWakeTime"] = Number.isFinite(v) ? v : 0; } catch { results["shortNapWakeTime"] = 0; }
  try { const v = input.currentTimeHours + input.maxNapMinutes/60; results["maxNapWakeTime"] = Number.isFinite(v) ? v : 0; } catch { results["maxNapWakeTime"] = 0; }
  results["__availableMinutes__dakika"] = 0;
  results["__cycleNapWakeTime_toFixed_2__"] = 0;
  results["__shortNapWakeTime_toFixed_2__"] = 0;
  results["__maxNapWakeTime_toFixed_2__"] = 0;
  return results;
}


export function calculateNap_calculator(input: Nap_calculatorInput): Nap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["availableMinutes"] ?? 0;
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


export interface Nap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
