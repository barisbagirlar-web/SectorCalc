// Auto-generated from cycling-speed-calculator-schema.json
import * as z from 'zod';

export interface Cycling_speed_calculatorInput {
  distance: number;
  timeHours: number;
  timeMinutes: number;
  timeSeconds: number;
  breakTime: number;
}

export const Cycling_speed_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  timeHours: z.number().default(0),
  timeMinutes: z.number().default(30),
  timeSeconds: z.number().default(0),
  breakTime: z.number().default(5),
});

function evaluateAllFormulas(input: Cycling_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.timeHours * 60 + input.timeMinutes + input.timeSeconds / 60; results["totalTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeMinutes"] = 0; }
  try { const v = (results["totalTimeMinutes"] ?? 0) - input.breakTime; results["movingTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["movingTimeMinutes"] = 0; }
  try { const v = input.distance / ((results["movingTimeMinutes"] ?? 0) / 60); results["avgMovingSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["avgMovingSpeed"] = 0; }
  try { const v = input.distance / ((results["totalTimeMinutes"] ?? 0) / 60); results["avgTotalSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["avgTotalSpeed"] = 0; }
  return results;
}


export function calculateCycling_speed_calculator(input: Cycling_speed_calculatorInput): Cycling_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["avgMovingSpeed"] ?? 0;
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


export interface Cycling_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
