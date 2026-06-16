// Auto-generated from marathon-time-predictor-calculator-schema.json
import * as z from 'zod';

export interface Marathon_time_predictor_calculatorInput {
  recentDistance: number;
  recentTime: number;
  marathonDistance: number;
  exponent: number;
}

export const Marathon_time_predictor_calculatorInputSchema = z.object({
  recentDistance: z.number().default(21.1),
  recentTime: z.number().default(100),
  marathonDistance: z.number().default(42.195),
  exponent: z.number().default(1.06),
});

function evaluateAllFormulas(input: Marathon_time_predictor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.recentTime * Math.pow(input.marathonDistance / input.recentDistance, input.exponent); results["predictedTime"] = Number.isFinite(v) ? v : 0; } catch { results["predictedTime"] = 0; }
  try { const v = (results["predictedTime"] ?? 0) / input.marathonDistance; results["predictedPace"] = Number.isFinite(v) ? v : 0; } catch { results["predictedPace"] = 0; }
  try { const v = (results["predictedTime"] ?? 0) / 60; results["predictedTimeHours"] = Number.isFinite(v) ? v : 0; } catch { results["predictedTimeHours"] = 0; }
  return results;
}


export function calculateMarathon_time_predictor_calculator(input: Marathon_time_predictor_calculatorInput): Marathon_time_predictor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["predictedTime"] ?? 0;
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


export interface Marathon_time_predictor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
