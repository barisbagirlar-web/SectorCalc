// Auto-generated from precision-calculator-schema.json
import * as z from 'zod';

export interface Precision_calculatorInput {
  usl: number;
  lsl: number;
  target: number;
  mean: number;
  stddev: number;
}

export const Precision_calculatorInputSchema = z.object({
  usl: z.number().default(10),
  lsl: z.number().default(0),
  target: z.number().default(5),
  mean: z.number().default(5),
  stddev: z.number().default(1),
});

function evaluateAllFormulas(input: Precision_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.usl - input.lsl) / (6 * input.stddev); results["cp"] = Number.isFinite(v) ? v : 0; } catch { results["cp"] = 0; }
  try { const v = Math.min((input.usl - input.mean), (input.mean - input.lsl)) / (3 * input.stddev); results["cpk"] = Number.isFinite(v) ? v : 0; } catch { results["cpk"] = 0; }
  try { const v = (input.usl - input.lsl) / (6 * Math.sqrt(input.stddev**2 + (input.mean - input.target)**2)); results["cpm"] = Number.isFinite(v) ? v : 0; } catch { results["cpm"] = 0; }
  return results;
}


export function calculatePrecision_calculator(input: Precision_calculatorInput): Precision_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cpk"] ?? 0;
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


export interface Precision_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
