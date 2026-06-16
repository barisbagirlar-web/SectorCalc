// Auto-generated from osmolality-calculator-schema.json
import * as z from 'zod';

export interface Osmolality_calculatorInput {
  sodium: number;
  glucose: number;
  bun: number;
  measuredOsm: number;
}

export const Osmolality_calculatorInputSchema = z.object({
  sodium: z.number().default(140),
  glucose: z.number().default(90),
  bun: z.number().default(14),
  measuredOsm: z.number().default(0),
});

function evaluateAllFormulas(input: Osmolality_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * input.sodium + input.glucose / 18 + input.bun / 2.8; results["calculatedOsmolality"] = Number.isFinite(v) ? v : 0; } catch { results["calculatedOsmolality"] = 0; }
  try { const v = 2 * input.sodium; results["sodiumContribution"] = Number.isFinite(v) ? v : 0; } catch { results["sodiumContribution"] = 0; }
  try { const v = input.glucose / 18; results["glucoseContribution"] = Number.isFinite(v) ? v : 0; } catch { results["glucoseContribution"] = 0; }
  try { const v = input.bun / 2.8; results["bunContribution"] = Number.isFinite(v) ? v : 0; } catch { results["bunContribution"] = 0; }
  try { const v = input.measuredOsm > 0 ? input.measuredOsm - (2 * input.sodium + input.glucose / 18 + input.bun / 2.8) : null; results["osmolarGap"] = Number.isFinite(v) ? v : 0; } catch { results["osmolarGap"] = 0; }
  return results;
}


export function calculateOsmolality_calculator(input: Osmolality_calculatorInput): Osmolality_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["calculatedOsmolality"] ?? 0;
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


export interface Osmolality_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
