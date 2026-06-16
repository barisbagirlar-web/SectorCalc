// Auto-generated from thc-calculator-schema.json
import * as z from 'zod';

export interface Thc_calculatorInput {
  iFund: number;
  i3: number;
  i5: number;
  i7: number;
  i9: number;
}

export const Thc_calculatorInputSchema = z.object({
  iFund: z.number().default(10),
  i3: z.number().default(1),
  i5: z.number().default(0.5),
  i7: z.number().default(0.3),
  i9: z.number().default(0.2),
});

function evaluateAllFormulas(input: Thc_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(input.i3**2 + input.i5**2 + input.i7**2 + input.i9**2); results["thc"] = Number.isFinite(v) ? v : 0; } catch { results["thc"] = 0; }
  try { const v = ((results["thc"] ?? 0) / input.iFund) * 100; results["thd"] = Number.isFinite(v) ? v : 0; } catch { results["thd"] = 0; }
  return results;
}


export function calculateThc_calculator(input: Thc_calculatorInput): Thc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["thd"] ?? 0;
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


export interface Thc_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
