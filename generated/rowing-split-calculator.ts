// Auto-generated from rowing-split-calculator-schema.json
import * as z from 'zod';

export interface Rowing_split_calculatorInput {
  distance: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Rowing_split_calculatorInputSchema = z.object({
  distance: z.number().default(2000),
  hours: z.number().default(0),
  minutes: z.number().default(7),
  seconds: z.number().default(0),
});

function evaluateAllFormulas(input: Rowing_split_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.hours * 3600 + input.minutes * 60 + input.seconds) / input.distance * 500; results["splitPer500m"] = Number.isFinite(v) ? v : 0; } catch { results["splitPer500m"] = 0; }
  try { const v = (input.hours * 3600 + input.minutes * 60 + input.seconds) / input.distance * 100; results["pacePer100m"] = Number.isFinite(v) ? v : 0; } catch { results["pacePer100m"] = 0; }
  try { const v = input.distance / (input.hours * 3600 + input.minutes * 60 + input.seconds); results["speedMs"] = Number.isFinite(v) ? v : 0; } catch { results["speedMs"] = 0; }
  try { const v = input.hours * 3600 + input.minutes * 60 + input.seconds; results["totalTimeSeconds"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeSeconds"] = 0; }
  return results;
}


export function calculateRowing_split_calculator(input: Rowing_split_calculatorInput): Rowing_split_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["splitPer500m"] ?? 0;
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


export interface Rowing_split_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
