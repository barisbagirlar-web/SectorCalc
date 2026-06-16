// Auto-generated from hcg-doubling-time-calculator-schema.json
import * as z from 'zod';

export interface Hcg_doubling_time_calculatorInput {
  hcg1: number;
  hcg2: number;
  timeInterval: number;
}

export const Hcg_doubling_time_calculatorInputSchema = z.object({
  hcg1: z.number().default(100),
  hcg2: z.number().default(200),
  timeInterval: z.number().default(48),
});

function evaluateAllFormulas(input: Hcg_doubling_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.timeInterval * Math.log(2)) / Math.log(input.hcg2 / input.hcg1); results["doublingTimeHours"] = Number.isFinite(v) ? v : 0; } catch { results["doublingTimeHours"] = 0; }
  try { const v = ((input.timeInterval * Math.log(2)) / Math.log(input.hcg2 / input.hcg1)) / 24; results["doublingTimeDays"] = Number.isFinite(v) ? v : 0; } catch { results["doublingTimeDays"] = 0; }
  try { const v = input.hcg2 / input.hcg1; results["growthRate"] = Number.isFinite(v) ? v : 0; } catch { results["growthRate"] = 0; }
  return results;
}


export function calculateHcg_doubling_time_calculator(input: Hcg_doubling_time_calculatorInput): Hcg_doubling_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["doublingTimeHours"] ?? 0;
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


export interface Hcg_doubling_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
