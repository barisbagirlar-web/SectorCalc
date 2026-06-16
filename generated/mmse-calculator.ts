// Auto-generated from mmse-calculator-schema.json
import * as z from 'zod';

export interface Mmse_calculatorInput {
  actualValue1: number;
  predictedValue1: number;
  actualValue2: number;
  predictedValue2: number;
}

export const Mmse_calculatorInputSchema = z.object({
  actualValue1: z.number().default(0),
  predictedValue1: z.number().default(0),
  actualValue2: z.number().default(0),
  predictedValue2: z.number().default(0),
});

function evaluateAllFormulas(input: Mmse_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.actualValue1 - input.predictedValue1) ** 2; results["squaredError1"] = Number.isFinite(v) ? v : 0; } catch { results["squaredError1"] = 0; }
  try { const v = (input.actualValue2 - input.predictedValue2) ** 2; results["squaredError2"] = Number.isFinite(v) ? v : 0; } catch { results["squaredError2"] = 0; }
  try { const v = (results["squaredError1"] ?? 0) + (results["squaredError2"] ?? 0); results["totalSquaredError"] = Number.isFinite(v) ? v : 0; } catch { results["totalSquaredError"] = 0; }
  try { const v = 2; results["sampleSize"] = Number.isFinite(v) ? v : 0; } catch { results["sampleSize"] = 0; }
  try { const v = ((results["squaredError1"] ?? 0) + (results["squaredError2"] ?? 0)) / 2; results["meanSquaredError"] = Number.isFinite(v) ? v : 0; } catch { results["meanSquaredError"] = 0; }
  return results;
}


export function calculateMmse_calculator(input: Mmse_calculatorInput): Mmse_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["meanSquaredError"] ?? 0;
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


export interface Mmse_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
