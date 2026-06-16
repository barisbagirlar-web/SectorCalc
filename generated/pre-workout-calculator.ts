// Auto-generated from pre-workout-calculator-schema.json
import * as z from 'zod';

export interface Pre_workout_calculatorInput {
  bodyWeight: number;
  caffeinePerKg: number;
  betaAlaninePerKg: number;
  citrullinePerKg: number;
  water: number;
}

export const Pre_workout_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(75),
  caffeinePerKg: z.number().default(3),
  betaAlaninePerKg: z.number().default(50),
  citrullinePerKg: z.number().default(80),
  water: z.number().default(300),
});

function evaluateAllFormulas(input: Pre_workout_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bodyWeight * input.caffeinePerKg; results["caffeineDose"] = Number.isFinite(v) ? v : 0; } catch { results["caffeineDose"] = 0; }
  try { const v = input.bodyWeight * input.betaAlaninePerKg; results["betaAlanineDose"] = Number.isFinite(v) ? v : 0; } catch { results["betaAlanineDose"] = 0; }
  try { const v = input.bodyWeight * input.citrullinePerKg; results["citrullineDose"] = Number.isFinite(v) ? v : 0; } catch { results["citrullineDose"] = 0; }
  try { const v = ((results["caffeineDose"] ?? 0) + (results["betaAlanineDose"] ?? 0) + (results["citrullineDose"] ?? 0)) / 1000; results["totalActiveGrams"] = Number.isFinite(v) ? v : 0; } catch { results["totalActiveGrams"] = 0; }
  try { const v = input.water; results["waterAmount"] = Number.isFinite(v) ? v : 0; } catch { results["waterAmount"] = 0; }
  return results;
}


export function calculatePre_workout_calculator(input: Pre_workout_calculatorInput): Pre_workout_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["caffeineDose"] ?? 0;
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


export interface Pre_workout_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
