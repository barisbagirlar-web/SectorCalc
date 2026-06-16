// Auto-generated from squat-calculator-schema.json
import * as z from 'zod';

export interface Squat_calculatorInput {
  weight: number;
  reps: number;
}

export const Squat_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  reps: z.number().default(5),
});

function evaluateAllFormulas(input: Squat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 + input.reps / 30); results["estimated1RM"] = Number.isFinite(v) ? v : 0; } catch { results["estimated1RM"] = 0; }
  try { const v = input.weight * (1 + input.reps / 30) * 0.95; results["speedWeight"] = Number.isFinite(v) ? v : 0; } catch { results["speedWeight"] = 0; }
  try { const v = input.weight * (1 + input.reps / 30) * 0.90; results["heavyTriple"] = Number.isFinite(v) ? v : 0; } catch { results["heavyTriple"] = 0; }
  try { const v = input.weight * (1 + input.reps / 30) * 0.80; results["workSetWeight"] = Number.isFinite(v) ? v : 0; } catch { results["workSetWeight"] = 0; }
  try { const v = input.weight * (1 + input.reps / 30) * 0.70; results["deloadWeight"] = Number.isFinite(v) ? v : 0; } catch { results["deloadWeight"] = 0; }
  return results;
}


export function calculateSquat_calculator(input: Squat_calculatorInput): Squat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimated1RM"] ?? 0;
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


export interface Squat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
