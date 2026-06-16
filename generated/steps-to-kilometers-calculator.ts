// Auto-generated from steps-to-kilometers-calculator-schema.json
import * as z from 'zod';

export interface Steps_to_kilometers_calculatorInput {
  steps: number;
  stepLengthCm: number;
  heightCm: number;
  useHeightEstimation: number;
  strideRatio: number;
}

export const Steps_to_kilometers_calculatorInputSchema = z.object({
  steps: z.number().default(10000),
  stepLengthCm: z.number().default(76.2),
  heightCm: z.number().default(170),
  useHeightEstimation: z.number().default(0),
  strideRatio: z.number().default(0.46),
});

function evaluateAllFormulas(input: Steps_to_kilometers_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.steps * (input.stepLengthCm * (1 - input.useHeightEstimation) + input.heightCm * input.strideRatio * input.useHeightEstimation) / 100000; results["distanceKm"] = Number.isFinite(v) ? v : 0; } catch { results["distanceKm"] = 0; }
  try { const v = input.steps * (input.stepLengthCm * (1 - input.useHeightEstimation) + input.heightCm * input.strideRatio * input.useHeightEstimation) / 100; results["distanceM"] = Number.isFinite(v) ? v : 0; } catch { results["distanceM"] = 0; }
  try { const v = input.steps * (input.stepLengthCm * (1 - input.useHeightEstimation) + input.heightCm * input.strideRatio * input.useHeightEstimation) / 100000 * 0.621371; results["distanceMi"] = Number.isFinite(v) ? v : 0; } catch { results["distanceMi"] = 0; }
  return results;
}


export function calculateSteps_to_kilometers_calculator(input: Steps_to_kilometers_calculatorInput): Steps_to_kilometers_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["distanceKm"] ?? 0;
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


export interface Steps_to_kilometers_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
