// Auto-generated from stair-stringer-calculator-schema.json
import * as z from 'zod';

export interface Stair_stringer_calculatorInput {
  totalRise: number;
  numberRisers: number;
  treadDepth: number;
  stringerWidth: number;
  nosing: number;
}

export const Stair_stringer_calculatorInputSchema = z.object({
  totalRise: z.number().default(2800),
  numberRisers: z.number().default(15),
  treadDepth: z.number().default(280),
  stringerWidth: z.number().default(286),
  nosing: z.number().default(25),
});

function evaluateAllFormulas(input: Stair_stringer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalRise; results["riserHeight"] = Number.isFinite(v) ? v : 0; } catch { results["riserHeight"] = 0; }
  try { const v = input.totalRise; results["totalRun"] = Number.isFinite(v) ? v : 0; } catch { results["totalRun"] = 0; }
  try { const v = input.totalRise; results["stringerLength"] = Number.isFinite(v) ? v : 0; } catch { results["stringerLength"] = 0; }
  try { const v = input.totalRise; results["angle"] = Number.isFinite(v) ? v : 0; } catch { results["angle"] = 0; }
  try { const v = input.totalRise; results["numberTreads"] = Number.isFinite(v) ? v : 0; } catch { results["numberTreads"] = 0; }
  results["_riserHeight_toFixed_1___mm"] = 0;
  results["_totalRun_toFixed_1___mm"] = 0;
  try { const v = (results["numberTreads"] ?? 0); results["_numberTreads_"] = Number.isFinite(v) ? v : 0; } catch { results["_numberTreads_"] = 0; }
  results["_stringerLength_toFixed_1___mm"] = 0;
  results["_angle_toFixed_1___"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateStair_stringer_calculator(input: Stair_stringer_calculatorInput): Stair_stringer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Stair_stringer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
