// Auto-generated from swimming-lap-calculator-schema.json
import * as z from 'zod';

export interface Swimming_lap_calculatorInput {
  poolLength: number;
  numLaps: number;
  pacePer100m: number;
  restBetweenLaps: number;
}

export const Swimming_lap_calculatorInputSchema = z.object({
  poolLength: z.number().default(25),
  numLaps: z.number().default(10),
  pacePer100m: z.number().default(120),
  restBetweenLaps: z.number().default(15),
});

function evaluateAllFormulas(input: Swimming_lap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.poolLength * input.numLaps; results["totalDistance"] = Number.isFinite(v) ? v : 0; } catch { results["totalDistance"] = 0; }
  try { const v = (input.pacePer100m / 100) * input.poolLength * input.numLaps; results["totalSwimTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalSwimTime"] = 0; }
  try { const v = (input.numLaps - 1) * input.restBetweenLaps; results["totalRestTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalRestTime"] = 0; }
  try { const v = ((input.pacePer100m / 100) * input.poolLength * input.numLaps + (input.numLaps - 1) * input.restBetweenLaps) * 100 / (input.poolLength * input.numLaps); results["effectivePacePer100m"] = Number.isFinite(v) ? v : 0; } catch { results["effectivePacePer100m"] = 0; }
  try { const v = (input.pacePer100m / 100) * input.poolLength * input.numLaps + (input.numLaps - 1) * input.restBetweenLaps; results["totalTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalTime"] = 0; }
  return results;
}


export function calculateSwimming_lap_calculator(input: Swimming_lap_calculatorInput): Swimming_lap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTime"] ?? 0;
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


export interface Swimming_lap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
