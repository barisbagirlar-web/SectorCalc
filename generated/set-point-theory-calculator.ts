// Auto-generated from set-point-theory-calculator-schema.json
import * as z from 'zod';

export interface Set_point_theory_calculatorInput {
  targetOutput: number;
  measuredDisturbance: number;
  processGain: number;
  processOffset: number;
  safetyMargin: number;
  setPointMin: number;
  setPointMax: number;
}

export const Set_point_theory_calculatorInputSchema = z.object({
  targetOutput: z.number().default(100),
  measuredDisturbance: z.number().default(0),
  processGain: z.number().default(1),
  processOffset: z.number().default(0),
  safetyMargin: z.number().default(5),
  setPointMin: z.number().default(0),
  setPointMax: z.number().default(200),
});

function evaluateAllFormulas(input: Set_point_theory_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.targetOutput - input.processOffset; results["effectiveTarget"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveTarget"] = 0; }
  try { const v = (results["effectiveTarget"] ?? 0) - input.measuredDisturbance; results["gainAdjusted"] = Number.isFinite(v) ? v : 0; } catch { results["gainAdjusted"] = 0; }
  try { const v = (results["gainAdjusted"] ?? 0) / input.processGain; results["rawSetPoint"] = Number.isFinite(v) ? v : 0; } catch { results["rawSetPoint"] = 0; }
  try { const v = (results["rawSetPoint"] ?? 0) * (1 - input.safetyMargin / 100); results["setPointAfterMargin"] = Number.isFinite(v) ? v : 0; } catch { results["setPointAfterMargin"] = 0; }
  try { const v = Math.min(Math.max((results["setPointAfterMargin"] ?? 0), input.setPointMin), input.setPointMax); results["recommendedSetPoint"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedSetPoint"] = 0; }
  try { const v = (results["rawSetPoint"] ?? 0) - (results["setPointAfterMargin"] ?? 0); results["marginAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["marginAdjustment"] = 0; }
  return results;
}


export function calculateSet_point_theory_calculator(input: Set_point_theory_calculatorInput): Set_point_theory_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recommendedSetPoint"] ?? 0;
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


export interface Set_point_theory_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
