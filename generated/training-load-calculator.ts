// Auto-generated from training-load-calculator-schema.json
import * as z from 'zod';

export interface Training_load_calculatorInput {
  duration: number;
  avgHeartRate: number;
  restingHeartRate: number;
  maxHeartRate: number;
  kFactor: number;
}

export const Training_load_calculatorInputSchema = z.object({
  duration: z.number().default(60),
  avgHeartRate: z.number().default(140),
  restingHeartRate: z.number().default(60),
  maxHeartRate: z.number().default(190),
  kFactor: z.number().default(0.64),
});

function evaluateAllFormulas(input: Training_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.duration * ((input.avgHeartRate - input.restingHeartRate) / (input.maxHeartRate - input.restingHeartRate)) * Math.exp(input.kFactor * ((input.avgHeartRate - input.restingHeartRate) / (input.maxHeartRate - input.restingHeartRate))); results["trimp"] = Number.isFinite(v) ? v : 0; } catch { results["trimp"] = 0; }
  try { const v = (input.avgHeartRate - input.restingHeartRate) / (input.maxHeartRate - input.restingHeartRate); results["hrRatio"] = Number.isFinite(v) ? v : 0; } catch { results["hrRatio"] = 0; }
  try { const v = Math.exp(input.kFactor * ((input.avgHeartRate - input.restingHeartRate) / (input.maxHeartRate - input.restingHeartRate))); results["expFactor"] = Number.isFinite(v) ? v : 0; } catch { results["expFactor"] = 0; }
  return results;
}


export function calculateTraining_load_calculator(input: Training_load_calculatorInput): Training_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["trimp"] ?? 0;
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


export interface Training_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
