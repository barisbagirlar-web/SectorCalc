// Auto-generated from steps-to-miles-calculator-schema.json
import * as z from 'zod';

export interface Steps_to_miles_calculatorInput {
  steps: number;
  stepLength: number;
  strideLength: number;
  height: number;
  terrainFactor: number;
}

export const Steps_to_miles_calculatorInputSchema = z.object({
  steps: z.number().default(10000),
  stepLength: z.number().default(0),
  strideLength: z.number().default(0),
  height: z.number().default(0),
  terrainFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Steps_to_miles_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.stepLength > 0 ? input.stepLength : (input.strideLength > 0 ? input.strideLength / 2 : (input.height > 0 ? input.height * 0.415 : 78))) * input.terrainFactor; results["effectiveStepLengthCm"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveStepLengthCm"] = 0; }
  try { const v = (input.steps * (results["effectiveStepLengthCm"] ?? 0)) / 100000; results["distanceKm"] = Number.isFinite(v) ? v : 0; } catch { results["distanceKm"] = 0; }
  try { const v = (results["distanceKm"] ?? 0) * 0.621371; results["distanceMiles"] = Number.isFinite(v) ? v : 0; } catch { results["distanceMiles"] = 0; }
  try { const v = 160934.4 / (results["effectiveStepLengthCm"] ?? 0); results["stepsPerMile"] = Number.isFinite(v) ? v : 0; } catch { results["stepsPerMile"] = 0; }
  return results;
}


export function calculateSteps_to_miles_calculator(input: Steps_to_miles_calculatorInput): Steps_to_miles_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["distanceMiles"] ?? 0;
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


export interface Steps_to_miles_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
