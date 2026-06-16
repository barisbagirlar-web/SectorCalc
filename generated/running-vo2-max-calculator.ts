// Auto-generated from running-vo2-max-calculator-schema.json
import * as z from 'zod';

export interface Running_vo2_max_calculatorInput {
  age: number;
  gender: number;
  distance: number;
  bodyWeight: number;
}

export const Running_vo2_max_calculatorInputSchema = z.object({
  age: z.number().default(30),
  gender: z.number().default(1),
  distance: z.number().default(2000),
  bodyWeight: z.number().default(70),
});

function evaluateAllFormulas(input: Running_vo2_max_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.distance - 504.9) / 44.73; results["vo2max"] = Number.isFinite(v) ? v : 0; } catch { results["vo2max"] = 0; }
  try { const v = (results["vo2max"] ?? 0) * input.bodyWeight / 1000; results["absoluteVO2"] = Number.isFinite(v) ? v : 0; } catch { results["absoluteVO2"] = 0; }
  try { const v = input.distance / 12; results["speed"] = Number.isFinite(v) ? v : 0; } catch { results["speed"] = 0; }
  return results;
}


export function calculateRunning_vo2_max_calculator(input: Running_vo2_max_calculatorInput): Running_vo2_max_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["vo2max"] ?? 0;
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


export interface Running_vo2_max_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
