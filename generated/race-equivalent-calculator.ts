// Auto-generated from race-equivalent-calculator-schema.json
import * as z from 'zod';

export interface Race_equivalent_calculatorInput {
  knownDistance: number;
  knownTimeHours: number;
  knownTimeMinutes: number;
  knownTimeSeconds: number;
  targetDistance: number;
}

export const Race_equivalent_calculatorInputSchema = z.object({
  knownDistance: z.number().default(10),
  knownTimeHours: z.number().default(0),
  knownTimeMinutes: z.number().default(50),
  knownTimeSeconds: z.number().default(0),
  targetDistance: z.number().default(42.195),
});

function evaluateAllFormulas(input: Race_equivalent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.knownTimeHours * 3600 + input.knownTimeMinutes * 60 + input.knownTimeSeconds) * Math.pow(input.targetDistance / input.knownDistance, 1.06); results["equivalentTimeSeconds"] = Number.isFinite(v) ? v : 0; } catch { results["equivalentTimeSeconds"] = 0; }
  try { const v = (results["equivalentTimeSeconds"] ?? 0) / 60; results["equivalentTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["equivalentTimeMinutes"] = 0; }
  try { const v = (results["equivalentTimeSeconds"] ?? 0) / input.targetDistance; results["equivalentPaceSecondsPerKm"] = Number.isFinite(v) ? v : 0; } catch { results["equivalentPaceSecondsPerKm"] = 0; }
  return results;
}


export function calculateRace_equivalent_calculator(input: Race_equivalent_calculatorInput): Race_equivalent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["equivalentTimeSeconds"] ?? 0;
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


export interface Race_equivalent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
