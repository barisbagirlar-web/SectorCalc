// Auto-generated from life-table-calculator-schema.json
import * as z from 'zod';

export interface Life_table_calculatorInput {
  l0: number;
  B: number;
  c: number;
  age: number;
}

export const Life_table_calculatorInputSchema = z.object({
  l0: z.number().default(100000),
  B: z.number().default(0.0001),
  c: z.number().default(1.1),
  age: z.number().default(30),
});

function evaluateAllFormulas(input: Life_table_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.l0 * Math.exp(-(input.B / Math.log(input.c)) * (input.c ** input.age - 1)); results["lx"] = Number.isFinite(v) ? v : 0; } catch { results["lx"] = 0; }
  try { const v = input.l0 * Math.exp(-(input.B / Math.log(input.c)) * (input.c ** input.age - 1)) * (1 - Math.exp(-(input.B * input.c ** input.age * (input.c - 1) / Math.log(input.c)))); results["dx"] = Number.isFinite(v) ? v : 0; } catch { results["dx"] = 0; }
  try { const v = 1 - Math.exp(-(input.B * input.c ** input.age * (input.c - 1) / Math.log(input.c))); results["qx"] = Number.isFinite(v) ? v : 0; } catch { results["qx"] = 0; }
  return results;
}


export function calculateLife_table_calculator(input: Life_table_calculatorInput): Life_table_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["qx"] ?? 0;
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


export interface Life_table_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
