// Auto-generated from ceiling-joist-calculator-schema.json
import * as z from 'zod';

export interface Ceiling_joist_calculatorInput {
  span: number;
  spacing: number;
  liveLoad: number;
  deadLoad: number;
  eModulus: number;
  iValue: number;
}

export const Ceiling_joist_calculatorInputSchema = z.object({
  span: z.number().default(12),
  spacing: z.number().default(16),
  liveLoad: z.number().default(40),
  deadLoad: z.number().default(10),
  eModulus: z.number().default(1600000),
  iValue: z.number().default(47.6),
});

function evaluateAllFormulas(input: Ceiling_joist_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.liveLoad + input.deadLoad; results["totalLoad"] = Number.isFinite(v) ? v : 0; } catch { results["totalLoad"] = 0; }
  try { const v = (input.liveLoad + input.deadLoad) * input.spacing / 144; results["uniformLoad"] = Number.isFinite(v) ? v : 0; } catch { results["uniformLoad"] = 0; }
  try { const v = (5 * ((input.liveLoad + input.deadLoad) * input.spacing / 144) * Math.pow(input.span * 12, 4)) / (384 * input.eModulus * input.iValue); results["deflection"] = Number.isFinite(v) ? v : 0; } catch { results["deflection"] = 0; }
  try { const v = input.span * 12 / 240; results["allowableDeflection"] = Number.isFinite(v) ? v : 0; } catch { results["allowableDeflection"] = 0; }
  try { const v = (((5 * ((input.liveLoad + input.deadLoad) * input.spacing / 144) * Math.pow(input.span * 12, 4)) / (384 * input.eModulus * input.iValue)) <= (input.span * 12 / 240)) ? 1 : 0; results["isSafe"] = Number.isFinite(v) ? v : 0; } catch { results["isSafe"] = 0; }
  return results;
}


export function calculateCeiling_joist_calculator(input: Ceiling_joist_calculatorInput): Ceiling_joist_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["deflection"] ?? 0;
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


export interface Ceiling_joist_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
