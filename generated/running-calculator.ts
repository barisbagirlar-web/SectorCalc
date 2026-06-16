// Auto-generated from running-calculator-schema.json
import * as z from 'zod';

export interface Running_calculatorInput {
  distance: number;
  time_hours: number;
  time_minutes: number;
  time_seconds: number;
}

export const Running_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  time_hours: z.number().default(0),
  time_minutes: z.number().default(50),
  time_seconds: z.number().default(0),
});

function evaluateAllFormulas(input: Running_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.time_hours * 60 + input.time_minutes + input.time_seconds / 60; results["totalTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeMinutes"] = 0; }
  try { const v = (results["totalTimeMinutes"] ?? 0) / input.distance; results["paceMinPerKm"] = Number.isFinite(v) ? v : 0; } catch { results["paceMinPerKm"] = 0; }
  try { const v = input.distance / ((results["totalTimeMinutes"] ?? 0) / 60); results["speedKmPerH"] = Number.isFinite(v) ? v : 0; } catch { results["speedKmPerH"] = 0; }
  try { const v = (results["paceMinPerKm"] ?? 0) * 1.60934; results["paceMinPerMile"] = Number.isFinite(v) ? v : 0; } catch { results["paceMinPerMile"] = 0; }
  return results;
}


export function calculateRunning_calculator(input: Running_calculatorInput): Running_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["paceMinPerKm"] ?? 0;
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


export interface Running_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
