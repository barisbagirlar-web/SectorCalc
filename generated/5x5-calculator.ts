// Auto-generated from 5x5-calculator-schema.json
import * as z from 'zod';

export interface _5x5_calculatorInput {
  sortScore: number;
  setOrderScore: number;
  shineScore: number;
  standardizeScore: number;
  sustainScore: number;
}

export const _5x5_calculatorInputSchema = z.object({
  sortScore: z.number().default(3),
  setOrderScore: z.number().default(3),
  shineScore: z.number().default(3),
  standardizeScore: z.number().default(3),
  sustainScore: z.number().default(3),
});

function evaluateAllFormulas(input: _5x5_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sortScore + input.setOrderScore + input.shineScore + input.standardizeScore + input.sustainScore; results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  try { const v = (input.sortScore + input.setOrderScore + input.shineScore + input.standardizeScore + input.sustainScore) / 5; results["average"] = Number.isFinite(v) ? v : 0; } catch { results["average"] = 0; }
  try { const v = (input.sortScore + input.setOrderScore + input.shineScore + input.standardizeScore + input.sustainScore) / 25 * 100; results["percentage"] = Number.isFinite(v) ? v : 0; } catch { results["percentage"] = 0; }
  try { const v = `Sort: ${input.sortScore}`; results["sortStr"] = Number.isFinite(v) ? v : 0; } catch { results["sortStr"] = 0; }
  try { const v = `Set in Order: ${input.setOrderScore}`; results["setOrderStr"] = Number.isFinite(v) ? v : 0; } catch { results["setOrderStr"] = 0; }
  try { const v = `Shine: ${input.shineScore}`; results["shineStr"] = Number.isFinite(v) ? v : 0; } catch { results["shineStr"] = 0; }
  try { const v = `Standardize: ${input.standardizeScore}`; results["standardizeStr"] = Number.isFinite(v) ? v : 0; } catch { results["standardizeStr"] = 0; }
  try { const v = `Sustain: ${input.sustainScore}`; results["sustainStr"] = Number.isFinite(v) ? v : 0; } catch { results["sustainStr"] = 0; }
  try { const v = (results["sortStr"] ?? 0); results["_sortStr_"] = Number.isFinite(v) ? v : 0; } catch { results["_sortStr_"] = 0; }
  try { const v = (results["setOrderStr"] ?? 0); results["_setOrderStr_"] = Number.isFinite(v) ? v : 0; } catch { results["_setOrderStr_"] = 0; }
  try { const v = (results["shineStr"] ?? 0); results["_shineStr_"] = Number.isFinite(v) ? v : 0; } catch { results["_shineStr_"] = 0; }
  try { const v = (results["standardizeStr"] ?? 0); results["_standardizeStr_"] = Number.isFinite(v) ? v : 0; } catch { results["_standardizeStr_"] = 0; }
  try { const v = (results["sustainStr"] ?? 0); results["_sustainStr_"] = Number.isFinite(v) ? v : 0; } catch { results["_sustainStr_"] = 0; }
  results["result"] = 0;
  return results;
}


export function calculate_5x5_calculator(input: _5x5_calculatorInput): _5x5_calculatorOutput {
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


export interface _5x5_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
