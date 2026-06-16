// Auto-generated from work-study-calculator-schema.json
import * as z from 'zod';

export interface Work_study_calculatorInput {
  observedTime: number;
  ratingFactor: number;
  allowanceFactor: number;
  cycleCount: number;
  standardDeviation: number;
  precision: number;
  zScore: number;
}

export const Work_study_calculatorInputSchema = z.object({
  observedTime: z.number().default(1),
  ratingFactor: z.number().default(100),
  allowanceFactor: z.number().default(15),
  cycleCount: z.number().default(5),
  standardDeviation: z.number().default(0.1),
  precision: z.number().default(5),
  zScore: z.number().default(1.96),
});

function evaluateAllFormulas(input: Work_study_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.observedTime * (input.ratingFactor / 100); results["normalTime"] = Number.isFinite(v) ? v : 0; } catch { results["normalTime"] = 0; }
  try { const v = (results["normalTime"] ?? 0) * (1 + input.allowanceFactor / 100); results["standardTime"] = Number.isFinite(v) ? v : 0; } catch { results["standardTime"] = 0; }
  try { const v = Math.pow((input.zScore * input.standardDeviation) / ((input.precision / 100) * input.observedTime), 2); results["requiredSamples"] = Number.isFinite(v) ? v : 0; } catch { results["requiredSamples"] = 0; }
  try { const v = (input.zScore * input.standardDeviation) / (Math.sqrt(input.cycleCount) * input.observedTime) * 100; results["actualPrecision"] = Number.isFinite(v) ? v : 0; } catch { results["actualPrecision"] = 0; }
  return results;
}


export function calculateWork_study_calculator(input: Work_study_calculatorInput): Work_study_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["standardTime"] ?? 0;
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


export interface Work_study_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
