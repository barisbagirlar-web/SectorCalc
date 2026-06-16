// Auto-generated from marathon-calculator-schema.json
import * as z from 'zod';

export interface Marathon_calculatorInput {
  distance_km: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Marathon_calculatorInputSchema = z.object({
  distance_km: z.number().default(42.195),
  hours: z.number().default(4),
  minutes: z.number().default(0),
  seconds: z.number().default(0),
});

function evaluateAllFormulas(input: Marathon_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hours * 3600 + input.minutes * 60 + input.seconds; results["total_time_sec"] = Number.isFinite(v) ? v : 0; } catch { results["total_time_sec"] = 0; }
  try { const v = (results["total_time_sec"] ?? 0) / input.distance_km; results["pace_per_km_sec"] = Number.isFinite(v) ? v : 0; } catch { results["pace_per_km_sec"] = 0; }
  try { const v = Math.floor((results["pace_per_km_sec"] ?? 0) / 60); results["pace_per_km_min"] = Number.isFinite(v) ? v : 0; } catch { results["pace_per_km_min"] = 0; }
  try { const v = Math.round((results["pace_per_km_sec"] ?? 0) % 60); results["pace_per_km_rem_sec"] = Number.isFinite(v) ? v : 0; } catch { results["pace_per_km_rem_sec"] = 0; }
  try { const v = input.distance_km / ((results["total_time_sec"] ?? 0) / 3600); results["speed_kmh"] = Number.isFinite(v) ? v : 0; } catch { results["speed_kmh"] = 0; }
  try { const v = input.distance_km / 1.60934; results["distance_miles"] = Number.isFinite(v) ? v : 0; } catch { results["distance_miles"] = 0; }
  try { const v = (results["total_time_sec"] ?? 0) / (results["distance_miles"] ?? 0); results["pace_per_mile_sec"] = Number.isFinite(v) ? v : 0; } catch { results["pace_per_mile_sec"] = 0; }
  try { const v = Math.floor((results["pace_per_mile_sec"] ?? 0) / 60); results["pace_per_mile_min"] = Number.isFinite(v) ? v : 0; } catch { results["pace_per_mile_min"] = 0; }
  try { const v = Math.round((results["pace_per_mile_sec"] ?? 0) % 60); results["pace_per_mile_rem_sec"] = Number.isFinite(v) ? v : 0; } catch { results["pace_per_mile_rem_sec"] = 0; }
  return results;
}


export function calculateMarathon_calculator(input: Marathon_calculatorInput): Marathon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pace_per_km_min"] ?? 0;
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


export interface Marathon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
