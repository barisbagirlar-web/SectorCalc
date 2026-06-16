// Auto-generated from osmolarity-calculator-schema.json
import * as z from 'zod';

export interface Osmolarity_calculatorInput {
  sodium: number;
  glucose: number;
  bun: number;
  measuredOsmolarity: number;
}

export const Osmolarity_calculatorInputSchema = z.object({
  sodium: z.number().default(140),
  glucose: z.number().default(90),
  bun: z.number().default(14),
  measuredOsmolarity: z.number().default(285),
});

function evaluateAllFormulas(input: Osmolarity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * input.sodium + input.glucose / 18 + input.bun / 2.8; results["calculatedOsmolarity"] = Number.isFinite(v) ? v : 0; } catch { results["calculatedOsmolarity"] = 0; }
  try { const v = input.measuredOsmolarity - (2 * input.sodium + input.glucose / 18 + input.bun / 2.8); results["osmolarGap"] = Number.isFinite(v) ? v : 0; } catch { results["osmolarGap"] = 0; }
  return results;
}


export function calculateOsmolarity_calculator(input: Osmolarity_calculatorInput): Osmolarity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["calculatedOsmolarity"] ?? 0;
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


export interface Osmolarity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
