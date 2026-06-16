// Auto-generated from thd-calculator-schema.json
import * as z from 'zod';

export interface Thd_calculatorInput {
  V1: number;
  V2: number;
  V3: number;
  V4: number;
  V5: number;
  V6: number;
  V7: number;
  V8: number;
}

export const Thd_calculatorInputSchema = z.object({
  V1: z.number().default(230),
  V2: z.number().default(0),
  V3: z.number().default(0),
  V4: z.number().default(0),
  V5: z.number().default(0),
  V6: z.number().default(0),
  V7: z.number().default(0),
  V8: z.number().default(0),
});

function evaluateAllFormulas(input: Thd_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.V2**2 + input.V3**2 + input.V4**2 + input.V5**2 + input.V6**2 + input.V7**2 + input.V8**2; results["sumOfSquares"] = Number.isFinite(v) ? v : 0; } catch { results["sumOfSquares"] = 0; }
  try { const v = Math.sqrt(input.V2**2 + input.V3**2 + input.V4**2 + input.V5**2 + input.V6**2 + input.V7**2 + input.V8**2); results["harmonicRMS"] = Number.isFinite(v) ? v : 0; } catch { results["harmonicRMS"] = 0; }
  try { const v = (Math.sqrt(input.V2**2 + input.V3**2 + input.V4**2 + input.V5**2 + input.V6**2 + input.V7**2 + input.V8**2) / input.V1) * 100; results["THD"] = Number.isFinite(v) ? v : 0; } catch { results["THD"] = 0; }
  return results;
}


export function calculateThd_calculator(input: Thd_calculatorInput): Thd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["THD"] ?? 0;
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


export interface Thd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
