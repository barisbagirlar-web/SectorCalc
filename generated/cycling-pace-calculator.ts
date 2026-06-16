// Auto-generated from cycling-pace-calculator-schema.json
import * as z from 'zod';

export interface Cycling_pace_calculatorInput {
  distance: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Cycling_pace_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  hours: z.number().default(0),
  minutes: z.number().default(30),
  seconds: z.number().default(0),
});

function evaluateAllFormulas(input: Cycling_pace_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hours * 3600 + input.minutes * 60 + input.seconds; results["totalTimeSec"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeSec"] = 0; }
  try { const v = (results["totalTimeSec"] ?? 0) / 60; results["totalTimeMin"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeMin"] = 0; }
  try { const v = (results["totalTimeMin"] ?? 0) / input.distance; results["pace"] = Number.isFinite(v) ? v : 0; } catch { results["pace"] = 0; }
  try { const v = input.distance / ((results["totalTimeSec"] ?? 0) / 3600); results["speed"] = Number.isFinite(v) ? v : 0; } catch { results["speed"] = 0; }
  return results;
}


export function calculateCycling_pace_calculator(input: Cycling_pace_calculatorInput): Cycling_pace_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pace"] ?? 0;
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


export interface Cycling_pace_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
