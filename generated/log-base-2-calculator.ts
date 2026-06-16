// Auto-generated from log-base-2-calculator-schema.json
import * as z from 'zod';

export interface Log_base_2_calculatorInput {
  sign: number;
  fraction: number;
  exponent: number;
  bias: number;
  precision: number;
}

export const Log_base_2_calculatorInputSchema = z.object({
  sign: z.number().default(0),
  fraction: z.number().default(0.5),
  exponent: z.number().default(3),
  bias: z.number().default(127),
  precision: z.number().default(4),
});

function evaluateAllFormulas(input: Log_base_2_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.exponent - input.bias; results["exponentPart"] = Number.isFinite(v) ? v : 0; } catch { results["exponentPart"] = 0; }
  try { const v = Math.log(1 + input.fraction) / Math.log(2); results["fractionalPart"] = Number.isFinite(v) ? v : 0; } catch { results["fractionalPart"] = 0; }
  try { const v = (input.exponent - input.bias) + Math.log(1 + input.fraction) / Math.log(2); results["log2Value"] = Number.isFinite(v) ? v : 0; } catch { results["log2Value"] = 0; }
  try { const v = (1 + input.fraction) * Math.pow(2, input.exponent - input.bias); results["actualValue"] = Number.isFinite(v) ? v : 0; } catch { results["actualValue"] = 0; }
  return results;
}


export function calculateLog_base_2_calculator(input: Log_base_2_calculatorInput): Log_base_2_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["log2Value"] ?? 0;
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


export interface Log_base_2_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
