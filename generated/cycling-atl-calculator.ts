// Auto-generated from cycling-atl-calculator-schema.json
import * as z from 'zod';

export interface Cycling_atl_calculatorInput {
  atlPrevious: number;
  tssToday: number;
  timeConstant: number;
  precision: number;
}

export const Cycling_atl_calculatorInputSchema = z.object({
  atlPrevious: z.number().default(0),
  tssToday: z.number().default(0),
  timeConstant: z.number().default(7),
  precision: z.number().default(1),
});

function evaluateAllFormulas(input: Cycling_atl_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.atlPrevious + (input.tssToday - input.atlPrevious) / input.timeConstant; results["atlCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["atlCurrent"] = 0; }
  try { const v = (input.tssToday - input.atlPrevious) / input.timeConstant; results["atlChange"] = Number.isFinite(v) ? v : 0; } catch { results["atlChange"] = 0; }
  try { const v = Math.round((input.atlPrevious + (input.tssToday - input.atlPrevious) / input.timeConstant) * Math.pow(10, input.precision)) / Math.pow(10, input.precision); results["atlRounded"] = Number.isFinite(v) ? v : 0; } catch { results["atlRounded"] = 0; }
  return results;
}


export function calculateCycling_atl_calculator(input: Cycling_atl_calculatorInput): Cycling_atl_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["atlRounded"] ?? 0;
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


export interface Cycling_atl_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
