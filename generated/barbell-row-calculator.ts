// Auto-generated from barbell-row-calculator-schema.json
import * as z from 'zod';

export interface Barbell_row_calculatorInput {
  barbellWeight: number;
  addedWeight: number;
  reps: number;
  sets: number;
  liftDistance: number;
  timePerRep: number;
}

export const Barbell_row_calculatorInputSchema = z.object({
  barbellWeight: z.number().default(20),
  addedWeight: z.number().default(40),
  reps: z.number().default(8),
  sets: z.number().default(3),
  liftDistance: z.number().default(0.5),
  timePerRep: z.number().default(2),
});

function evaluateAllFormulas(input: Barbell_row_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.barbellWeight + input.addedWeight; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (results["totalWeight"] ?? 0) * input.reps * input.sets; results["volumeLoad"] = Number.isFinite(v) ? v : 0; } catch { results["volumeLoad"] = 0; }
  try { const v = (results["totalWeight"] ?? 0) * 9.81 * input.liftDistance; results["workPerRep"] = Number.isFinite(v) ? v : 0; } catch { results["workPerRep"] = 0; }
  try { const v = (results["workPerRep"] ?? 0) * input.reps * input.sets; results["totalWork"] = Number.isFinite(v) ? v : 0; } catch { results["totalWork"] = 0; }
  try { const v = input.timePerRep * input.reps * input.sets; results["totalTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalTime"] = 0; }
  try { const v = (results["totalWork"] ?? 0) / (results["totalTime"] ?? 0); results["power"] = Number.isFinite(v) ? v : 0; } catch { results["power"] = 0; }
  return results;
}


export function calculateBarbell_row_calculator(input: Barbell_row_calculatorInput): Barbell_row_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWork"] ?? 0;
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


export interface Barbell_row_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
