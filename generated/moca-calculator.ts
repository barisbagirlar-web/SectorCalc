// Auto-generated from moca-calculator-schema.json
import * as z from 'zod';

export interface Moca_calculatorInput {
  mean: number;
  stddev: number;
  usl: number;
  lsl: number;
}

export const Moca_calculatorInputSchema = z.object({
  mean: z.number().default(0),
  stddev: z.number().default(1),
  usl: z.number().default(3),
  lsl: z.number().default(-3),
});

function evaluateAllFormulas(input: Moca_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.usl - input.lsl) / (6 * input.stddev); results["Cp"] = Number.isFinite(v) ? v : 0; } catch { results["Cp"] = 0; }
  try { const v = (input.usl - input.mean) / (3 * input.stddev); results["CPU"] = Number.isFinite(v) ? v : 0; } catch { results["CPU"] = 0; }
  try { const v = (input.mean - input.lsl) / (3 * input.stddev); results["CPL"] = Number.isFinite(v) ? v : 0; } catch { results["CPL"] = 0; }
  try { const v = Math.min((input.usl - input.mean) / (3 * input.stddev), (input.mean - input.lsl) / (3 * input.stddev)); results["Cpk"] = Number.isFinite(v) ? v : 0; } catch { results["Cpk"] = 0; }
  return results;
}


export function calculateMoca_calculator(input: Moca_calculatorInput): Moca_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Cpk"] ?? 0;
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


export interface Moca_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
