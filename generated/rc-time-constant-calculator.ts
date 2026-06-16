// Auto-generated from rc-time-constant-calculator-schema.json
import * as z from 'zod';

export interface Rc_time_constant_calculatorInput {
  R: number;
  C: number;
  V0: number;
  t: number;
}

export const Rc_time_constant_calculatorInputSchema = z.object({
  R: z.number().default(1000),
  C: z.number().default(0.000001),
  V0: z.number().default(5),
  t: z.number().default(0.001),
});

function evaluateAllFormulas(input: Rc_time_constant_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.R * input.C; results["tau"] = Number.isFinite(v) ? v : 0; } catch { results["tau"] = 0; }
  try { const v = input.V0 * (1 - Math.exp(-input.t / (input.R * input.C))); results["Vc"] = Number.isFinite(v) ? v : 0; } catch { results["Vc"] = 0; }
  return results;
}


export function calculateRc_time_constant_calculator(input: Rc_time_constant_calculatorInput): Rc_time_constant_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tau"] ?? 0;
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


export interface Rc_time_constant_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
