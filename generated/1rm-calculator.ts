// Auto-generated from 1rm-calculator-schema.json
import * as z from 'zod';

export interface _1rm_calculatorInput {
  weight_lifted: number;
  reps_performed: number;
  rir: number;
  fatigue_percent: number;
}

export const _1rm_calculatorInputSchema = z.object({
  weight_lifted: z.number().default(100),
  reps_performed: z.number().default(5),
  rir: z.number().default(0),
  fatigue_percent: z.number().default(0),
});

function evaluateAllFormulas(input: _1rm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.reps_performed + input.rir; results["adjusted_reps"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_reps"] = 0; }
  try { const v = input.weight_lifted * (1 + ((results["adjusted_reps"] ?? 0) / 30)); results["raw_1rm"] = Number.isFinite(v) ? v : 0; } catch { results["raw_1rm"] = 0; }
  try { const v = 1 - (input.fatigue_percent / 100); results["fatigue_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["fatigue_adjustment"] = 0; }
  try { const v = (results["raw_1rm"] ?? 0) * (results["fatigue_adjustment"] ?? 0); results["estimated_1rm"] = Number.isFinite(v) ? v : 0; } catch { results["estimated_1rm"] = 0; }
  try { const v = (results["estimated_1rm"] ?? 0) / (1 + 5/30); results["weight_5rm"] = Number.isFinite(v) ? v : 0; } catch { results["weight_5rm"] = 0; }
  try { const v = (results["estimated_1rm"] ?? 0) / (1 + 10/30); results["weight_10rm"] = Number.isFinite(v) ? v : 0; } catch { results["weight_10rm"] = 0; }
  return results;
}


export function calculate_1rm_calculator(input: _1rm_calculatorInput): _1rm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimated_1rm"] ?? 0;
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


export interface _1rm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
