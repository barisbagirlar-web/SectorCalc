// Auto-generated from sinclair-calculator-schema.json
import * as z from 'zod';

export interface Sinclair_calculatorInput {
  bodyweight: number;
  totalLifted: number;
  coefficientA: number;
  coefficientB: number;
}

export const Sinclair_calculatorInputSchema = z.object({
  bodyweight: z.number().default(80),
  totalLifted: z.number().default(200),
  coefficientA: z.number().default(0.722762521),
  coefficientB: z.number().default(193.609),
});

function evaluateAllFormulas(input: Sinclair_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalLifted * Math.pow(10, input.coefficientA * Math.pow(Math.log(input.bodyweight / input.coefficientB) / Math.log(10), 2)); results["sinclairScore"] = Number.isFinite(v) ? v : 0; } catch { results["sinclairScore"] = 0; }
  try { const v = Math.pow(10, input.coefficientA * Math.pow(Math.log(input.bodyweight / input.coefficientB) / Math.log(10), 2)); results["adjustedFactor"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedFactor"] = 0; }
  try { const v = input.bodyweight / input.coefficientB; results["bodyweightRatio"] = Number.isFinite(v) ? v : 0; } catch { results["bodyweightRatio"] = 0; }
  return results;
}


export function calculateSinclair_calculator(input: Sinclair_calculatorInput): Sinclair_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sinclairScore"] ?? 0;
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


export interface Sinclair_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
