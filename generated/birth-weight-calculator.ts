// Auto-generated from birth-weight-calculator-schema.json
import * as z from 'zod';

export interface Birth_weight_calculatorInput {
  hc: number;
  ac: number;
  fl: number;
  bpd: number;
}

export const Birth_weight_calculatorInputSchema = z.object({
  hc: z.number().default(33),
  ac: z.number().default(33),
  fl: z.number().default(7),
  bpd: z.number().default(9.5),
});

function evaluateAllFormulas(input: Birth_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 ** (1.3596 + 0.0064 * input.hc + 0.0424 * input.ac + 0.174 * input.fl + 0.00061 * input.bpd * input.ac - 0.00386 * input.ac * input.fl); results["estimatedWeightGrams"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedWeightGrams"] = 0; }
  try { const v = (results["estimatedWeightGrams"] ?? 0) * 0.00220462; results["estimatedWeightPounds"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedWeightPounds"] = 0; }
  try { const v = (results["estimatedWeightGrams"] ?? 0) * 0.85; results["confidenceRangeLow"] = Number.isFinite(v) ? v : 0; } catch { results["confidenceRangeLow"] = 0; }
  try { const v = (results["estimatedWeightGrams"] ?? 0) * 1.15; results["confidenceRangeHigh"] = Number.isFinite(v) ? v : 0; } catch { results["confidenceRangeHigh"] = 0; }
  return results;
}


export function calculateBirth_weight_calculator(input: Birth_weight_calculatorInput): Birth_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimatedWeightGrams"] ?? 0;
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


export interface Birth_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
