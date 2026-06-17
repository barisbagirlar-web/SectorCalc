// Auto-generated from u-value-calculator-schema.json
import * as z from 'zod';

export interface U_value_calculatorInput {
  rsi: number;
  thickness1: number;
  conductivity1: number;
  thickness2: number;
  conductivity2: number;
  thickness3: number;
  conductivity3: number;
  rse: number;
}

export const U_value_calculatorInputSchema = z.object({
  rsi: z.number().default(0.13),
  thickness1: z.number().default(0.1),
  conductivity1: z.number().default(0.7),
  thickness2: z.number().default(0.05),
  conductivity2: z.number().default(0.04),
  thickness3: z.number().default(0.02),
  conductivity3: z.number().default(0.5),
  rse: z.number().default(0.04),
});

function evaluateAllFormulas(input: U_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.thickness1 / input.conductivity1; results["r1"] = Number.isFinite(v) ? v : 0; } catch { results["r1"] = 0; }
  try { const v = input.thickness2 / input.conductivity2; results["r2"] = Number.isFinite(v) ? v : 0; } catch { results["r2"] = 0; }
  try { const v = input.thickness3 / input.conductivity3; results["r3"] = Number.isFinite(v) ? v : 0; } catch { results["r3"] = 0; }
  try { const v = input.rsi + (results["r1"] ?? 0) + (results["r2"] ?? 0) + (results["r3"] ?? 0) + input.rse; results["totalResistance"] = Number.isFinite(v) ? v : 0; } catch { results["totalResistance"] = 0; }
  try { const v = 1 / (results["totalResistance"] ?? 0); results["uValue"] = Number.isFinite(v) ? v : 0; } catch { results["uValue"] = 0; }
  return results;
}


export function calculateU_value_calculator(input: U_value_calculatorInput): U_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["r1"] ?? 0;
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


export interface U_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
