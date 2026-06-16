// Auto-generated from treadmill-pace-calculator-schema.json
import * as z from 'zod';

export interface Treadmill_pace_calculatorInput {
  distance: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Treadmill_pace_calculatorInputSchema = z.object({
  distance: z.number().default(5),
  hours: z.number().default(0),
  minutes: z.number().default(30),
  seconds: z.number().default(0),
});

function evaluateAllFormulas(input: Treadmill_pace_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hours * 3600 + input.minutes * 60 + input.seconds; results["totalSeconds"] = Number.isFinite(v) ? v : 0; } catch { results["totalSeconds"] = 0; }
  try { const v = (results["totalSeconds"] ?? 0) / input.distance; results["paceSecondsPerKm"] = Number.isFinite(v) ? v : 0; } catch { results["paceSecondsPerKm"] = 0; }
  try { const v = (results["paceSecondsPerKm"] ?? 0) / 60; results["paceMinPerKm"] = Number.isFinite(v) ? v : 0; } catch { results["paceMinPerKm"] = 0; }
  try { const v = (input.distance * 3600) / (results["totalSeconds"] ?? 0); results["speedKmh"] = Number.isFinite(v) ? v : 0; } catch { results["speedKmh"] = 0; }
  try { const v = (results["paceSecondsPerKm"] ?? 0) * 1.60934 / 60; results["paceMinPerMile"] = Number.isFinite(v) ? v : 0; } catch { results["paceMinPerMile"] = 0; }
  try { const v = Math.floor((results["paceMinPerKm"] ?? 0)) + ':' + ((results["paceSecondsPerKm"] ?? 0) % 60 < 10 ? '0' : '') + ((results["paceSecondsPerKm"] ?? 0) % 60) + ' min/km'; results["paceDisplay"] = Number.isFinite(v) ? v : 0; } catch { results["paceDisplay"] = 0; }
  return results;
}


export function calculateTreadmill_pace_calculator(input: Treadmill_pace_calculatorInput): Treadmill_pace_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["paceDisplay"] ?? 0;
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


export interface Treadmill_pace_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
