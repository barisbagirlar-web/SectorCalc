// Auto-generated from baby-weight-calculator-schema.json
import * as z from 'zod';

export interface Baby_weight_calculatorInput {
  bpd: number;
  hc: number;
  ac: number;
  fl: number;
}

export const Baby_weight_calculatorInputSchema = z.object({
  bpd: z.number().default(7.5),
  hc: z.number().default(27),
  ac: z.number().default(25.5),
  fl: z.number().default(5.6),
});

function evaluateAllFormulas(input: Baby_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1.335 - 0.0034 * input.ac * input.fl + 0.0316 * input.bpd + 0.0457 * input.ac + 0.1623 * input.fl; results["logEFW"] = Number.isFinite(v) ? v : 0; } catch { results["logEFW"] = 0; }
  try { const v = Math.pow(10, (results["logEFW"] ?? 0)); results["efw_g"] = Number.isFinite(v) ? v : 0; } catch { results["efw_g"] = 0; }
  try { const v = (results["efw_g"] ?? 0) / 1000; results["efw_kg"] = Number.isFinite(v) ? v : 0; } catch { results["efw_kg"] = 0; }
  return results;
}


export function calculateBaby_weight_calculator(input: Baby_weight_calculatorInput): Baby_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["efw_g"] ?? 0;
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


export interface Baby_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
