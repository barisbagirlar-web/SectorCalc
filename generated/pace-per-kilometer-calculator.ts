// Auto-generated from pace-per-kilometer-calculator-schema.json
import * as z from 'zod';

export interface Pace_per_kilometer_calculatorInput {
  totalMinutes: number;
  totalSeconds: number;
  distanceKm: number;
}

export const Pace_per_kilometer_calculatorInputSchema = z.object({
  totalMinutes: z.number().default(30),
  totalSeconds: z.number().default(0),
  distanceKm: z.number().default(5),
});

function evaluateAllFormulas(input: Pace_per_kilometer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalMinutes * 60 + input.totalSeconds; results["totalTimeSeconds"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeSeconds"] = 0; }
  try { const v = (results["totalTimeSeconds"] ?? 0) / input.distanceKm; results["paceSecondsPerKm"] = Number.isFinite(v) ? v : 0; } catch { results["paceSecondsPerKm"] = 0; }
  try { const v = Math.floor((results["paceSecondsPerKm"] ?? 0) / 60); results["paceMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["paceMinutes"] = 0; }
  try { const v = Math.round((results["paceSecondsPerKm"] ?? 0) % 60); results["paceSeconds"] = Number.isFinite(v) ? v : 0; } catch { results["paceSeconds"] = 0; }
  try { const v = (results["paceMinutes"] ?? 0) + ':' + ((results["paceSeconds"] ?? 0) < 10 ? '0' : '') + (results["paceSeconds"] ?? 0); results["paceFormatted"] = Number.isFinite(v) ? v : 0; } catch { results["paceFormatted"] = 0; }
  return results;
}


export function calculatePace_per_kilometer_calculator(input: Pace_per_kilometer_calculatorInput): Pace_per_kilometer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["paceFormatted"] ?? 0;
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


export interface Pace_per_kilometer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
