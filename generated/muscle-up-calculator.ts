// Auto-generated from muscle-up-calculator-schema.json
import * as z from 'zod';

export interface Muscle_up_calculatorInput {
  bodyWeight: number;
  pullUpMax: number;
  dipMax: number;
  barHeight: number;
}

export const Muscle_up_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(70),
  pullUpMax: z.number().default(10),
  dipMax: z.number().default(10),
  barHeight: z.number().default(2.2),
});

function evaluateAllFormulas(input: Muscle_up_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bodyWeight * input.pullUpMax / 10; results["pullingPower"] = Number.isFinite(v) ? v : 0; } catch { results["pullingPower"] = 0; }
  try { const v = input.bodyWeight * input.dipMax / 10; results["pushingPower"] = Number.isFinite(v) ? v : 0; } catch { results["pushingPower"] = 0; }
  try { const v = Math.sqrt((results["pullingPower"] ?? 0) * (results["pushingPower"] ?? 0)) / input.barHeight; results["muscleUpIndex"] = Number.isFinite(v) ? v : 0; } catch { results["muscleUpIndex"] = 0; }
  return results;
}


export function calculateMuscle_up_calculator(input: Muscle_up_calculatorInput): Muscle_up_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["muscleUpIndex"] ?? 0;
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


export interface Muscle_up_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
