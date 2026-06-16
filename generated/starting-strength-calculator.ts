// Auto-generated from starting-strength-calculator-schema.json
import * as z from 'zod';

export interface Starting_strength_calculatorInput {
  bodyWeight: number;
  squatMax: number;
  benchMax: number;
  deadliftMax: number;
  pressMax: number;
}

export const Starting_strength_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(80),
  squatMax: z.number().default(100),
  benchMax: z.number().default(80),
  deadliftMax: z.number().default(140),
  pressMax: z.number().default(50),
});

function evaluateAllFormulas(input: Starting_strength_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round(input.squatMax * 0.9 / 2.5) * 2.5; results["startingSquat"] = Number.isFinite(v) ? v : 0; } catch { results["startingSquat"] = 0; }
  try { const v = Math.round(input.benchMax * 0.9 / 2.5) * 2.5; results["startingBench"] = Number.isFinite(v) ? v : 0; } catch { results["startingBench"] = 0; }
  try { const v = Math.round(input.deadliftMax * 0.9 / 2.5) * 2.5; results["startingDeadlift"] = Number.isFinite(v) ? v : 0; } catch { results["startingDeadlift"] = 0; }
  try { const v = Math.round(input.pressMax * 0.9 / 2.5) * 2.5; results["startingPress"] = Number.isFinite(v) ? v : 0; } catch { results["startingPress"] = 0; }
  return results;
}


export function calculateStarting_strength_calculator(input: Starting_strength_calculatorInput): Starting_strength_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Squat"] ?? 0;
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


export interface Starting_strength_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
