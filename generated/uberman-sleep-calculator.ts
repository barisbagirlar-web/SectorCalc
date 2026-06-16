// Auto-generated from uberman-sleep-calculator-schema.json
import * as z from 'zod';

export interface Uberman_sleep_calculatorInput {
  napDuration: number;
  intervalBetweenNaps: number;
  numberOfNaps: number;
  startHour: number;
}

export const Uberman_sleep_calculatorInputSchema = z.object({
  napDuration: z.number().default(20),
  intervalBetweenNaps: z.number().default(4),
  numberOfNaps: z.number().default(6),
  startHour: z.number().default(0),
});

function evaluateAllFormulas(input: Uberman_sleep_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.napDuration * input.numberOfNaps / 60; results["totalSleep"] = Number.isFinite(v) ? v : 0; } catch { results["totalSleep"] = 0; }
  try { const v = (input.napDuration / 60 + input.intervalBetweenNaps) * input.numberOfNaps; results["totalSchedule"] = Number.isFinite(v) ? v : 0; } catch { results["totalSchedule"] = 0; }
  try { const v = 24 - ((input.napDuration / 60 + input.intervalBetweenNaps) * input.numberOfNaps); results["freeTime"] = Number.isFinite(v) ? v : 0; } catch { results["freeTime"] = 0; }
  try { const v = (input.startHour + (input.napDuration / 60 + input.intervalBetweenNaps) * input.numberOfNaps) % 24; results["lastNapEnd"] = Number.isFinite(v) ? v : 0; } catch { results["lastNapEnd"] = 0; }
  return results;
}


export function calculateUberman_sleep_calculator(input: Uberman_sleep_calculatorInput): Uberman_sleep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSleep"] ?? 0;
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


export interface Uberman_sleep_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
