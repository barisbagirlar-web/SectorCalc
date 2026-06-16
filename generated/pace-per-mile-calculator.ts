// Auto-generated from pace-per-mile-calculator-schema.json
import * as z from 'zod';

export interface Pace_per_mile_calculatorInput {
  hours: number;
  minutes: number;
  seconds: number;
  distance: number;
}

export const Pace_per_mile_calculatorInputSchema = z.object({
  hours: z.number().default(0),
  minutes: z.number().default(0),
  seconds: z.number().default(0),
  distance: z.number().default(1),
});

function evaluateAllFormulas(input: Pace_per_mile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hours * 60 + input.minutes + input.seconds / 60; results["total_time_min"] = Number.isFinite(v) ? v : 0; } catch { results["total_time_min"] = 0; }
  try { const v = (results["total_time_min"] ?? 0) / input.distance; results["pace_min_per_mile"] = Number.isFinite(v) ? v : 0; } catch { results["pace_min_per_mile"] = 0; }
  try { const v = (results["pace_min_per_mile"] ?? 0) * 60; results["pace_sec_per_mile"] = Number.isFinite(v) ? v : 0; } catch { results["pace_sec_per_mile"] = 0; }
  try { const v = 60 / (results["pace_min_per_mile"] ?? 0); results["speed_mph"] = Number.isFinite(v) ? v : 0; } catch { results["speed_mph"] = 0; }
  return results;
}


export function calculatePace_per_mile_calculator(input: Pace_per_mile_calculatorInput): Pace_per_mile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pace_min_per_mile"] ?? 0;
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


export interface Pace_per_mile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
