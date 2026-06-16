// Auto-generated from running-speed-calculator-schema.json
import * as z from 'zod';

export interface Running_speed_calculatorInput {
  distance: number;
  time_hours: number;
  time_minutes: number;
  time_seconds: number;
}

export const Running_speed_calculatorInputSchema = z.object({
  distance: z.number().default(5),
  time_hours: z.number().default(0),
  time_minutes: z.number().default(30),
  time_seconds: z.number().default(0),
});

function evaluateAllFormulas(input: Running_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.time_hours * 3600 + input.time_minutes * 60 + input.time_seconds) / 3600; results["total_time"] = Number.isFinite(v) ? v : 0; } catch { results["total_time"] = 0; }
  try { const v = input.distance / (results["total_time"] ?? 0); results["speed"] = Number.isFinite(v) ? v : 0; } catch { results["speed"] = 0; }
  try { const v = (results["total_time"] ?? 0) * 60 / input.distance; results["pace"] = Number.isFinite(v) ? v : 0; } catch { results["pace"] = 0; }
  try { const v = (results["speed"] ?? 0) / 3.6; results["speed_ms"] = Number.isFinite(v) ? v : 0; } catch { results["speed_ms"] = 0; }
  return results;
}


export function calculateRunning_speed_calculator(input: Running_speed_calculatorInput): Running_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["speed"] ?? 0;
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


export interface Running_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
