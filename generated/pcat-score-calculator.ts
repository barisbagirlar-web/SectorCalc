// Auto-generated from pcat-score-calculator-schema.json
import * as z from 'zod';

export interface Pcat_score_calculatorInput {
  usl: number;
  lsl: number;
  mean: number;
  stddev: number;
}

export const Pcat_score_calculatorInputSchema = z.object({
  usl: z.number().default(10),
  lsl: z.number().default(5),
  mean: z.number().default(7.5),
  stddev: z.number().default(0.5),
});

function evaluateAllFormulas(input: Pcat_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.usl - input.lsl) / (6 * input.stddev); results["cp"] = Number.isFinite(v) ? v : 0; } catch { results["cp"] = 0; }
  try { const v = Math.min((input.usl - input.mean) / (3 * input.stddev), (input.mean - input.lsl) / (3 * input.stddev)); results["cpk"] = Number.isFinite(v) ? v : 0; } catch { results["cpk"] = 0; }
  try { const v = (Math.min((input.usl - input.lsl) / (6 * input.stddev), Math.min((input.usl - input.mean) / (3 * input.stddev), (input.mean - input.lsl) / (3 * input.stddev))) / 1.33) * 100; results["pcatScore"] = Number.isFinite(v) ? v : 0; } catch { results["pcatScore"] = 0; }
  return results;
}


export function calculatePcat_score_calculator(input: Pcat_score_calculatorInput): Pcat_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pcatScore"] ?? 0;
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


export interface Pcat_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
