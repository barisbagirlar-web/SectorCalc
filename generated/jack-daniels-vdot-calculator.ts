// Auto-generated from jack-daniels-vdot-calculator-schema.json
import * as z from 'zod';

export interface Jack_daniels_vdot_calculatorInput {
  raceDistance: number;
  raceTimeMinutes: number;
  raceTimeSeconds: number;
  targetDistance: number;
}

export const Jack_daniels_vdot_calculatorInputSchema = z.object({
  raceDistance: z.number().default(5000),
  raceTimeMinutes: z.number().default(20),
  raceTimeSeconds: z.number().default(0),
  targetDistance: z.number().default(10000),
});

function evaluateAllFormulas(input: Jack_daniels_vdot_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.raceDistance / (input.raceTimeMinutes + input.raceTimeSeconds / 60); results["velocity"] = Number.isFinite(v) ? v : 0; } catch { results["velocity"] = 0; }
  try { const v = 0.2 * (input.raceDistance / (input.raceTimeMinutes + input.raceTimeSeconds / 60)) + 3.5; results["vdot"] = Number.isFinite(v) ? v : 0; } catch { results["vdot"] = 0; }
  try { const v = input.targetDistance / (input.raceDistance / (input.raceTimeMinutes + input.raceTimeSeconds / 60)); results["predictedTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["predictedTimeMinutes"] = 0; }
  return results;
}


export function calculateJack_daniels_vdot_calculator(input: Jack_daniels_vdot_calculatorInput): Jack_daniels_vdot_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["vdot"] ?? 0;
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


export interface Jack_daniels_vdot_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
