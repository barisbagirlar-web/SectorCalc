// Auto-generated from mmhg-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Mmhg_to_psi_calculatorInput {
  pressureMMHG: number;
  conversionFactor: number;
  offset: number;
  outputPrecision: number;
}

export const Mmhg_to_psi_calculatorInputSchema = z.object({
  pressureMMHG: z.number().default(760),
  conversionFactor: z.number().default(0.0193368),
  offset: z.number().default(0),
  outputPrecision: z.number().default(4),
});

function evaluateAllFormulas(input: Mmhg_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressureMMHG * input.conversionFactor + input.offset; results["psiRaw"] = Number.isFinite(v) ? v : 0; } catch { results["psiRaw"] = 0; }
  try { const v = Math.round((input.pressureMMHG * input.conversionFactor + input.offset) * 10**input.outputPrecision) / 10**input.outputPrecision; results["psiRounded"] = Number.isFinite(v) ? v : 0; } catch { results["psiRounded"] = 0; }
  return results;
}


export function calculateMmhg_to_psi_calculator(input: Mmhg_to_psi_calculatorInput): Mmhg_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["psiRounded"] ?? 0;
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


export interface Mmhg_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
