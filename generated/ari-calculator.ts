// Auto-generated from ari-calculator-schema.json
import * as z from 'zod';

export interface Ari_calculatorInput {
  initialValue: number;
  targetValue: number;
  currentValue: number;
  yearsElapsed: number;
  confidenceFactor: number;
}

export const Ari_calculatorInputSchema = z.object({
  initialValue: z.number().default(100),
  targetValue: z.number().default(80),
  currentValue: z.number().default(90),
  yearsElapsed: z.number().default(1),
  confidenceFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Ari_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.initialValue - input.targetValue) / input.initialValue) / input.yearsElapsed * 100 * input.confidenceFactor; results["ariRequired"] = Number.isFinite(v) ? v : 0; } catch { results["ariRequired"] = 0; }
  try { const v = ((input.initialValue - input.currentValue) / input.initialValue) / input.yearsElapsed * 100 * input.confidenceFactor; results["ariActual"] = Number.isFinite(v) ? v : 0; } catch { results["ariActual"] = 0; }
  try { const v = ((input.currentValue - input.targetValue) / input.initialValue) * 100; results["gapPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["gapPercentage"] = 0; }
  return results;
}


export function calculateAri_calculator(input: Ari_calculatorInput): Ari_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ariRequired"] ?? 0;
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


export interface Ari_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
