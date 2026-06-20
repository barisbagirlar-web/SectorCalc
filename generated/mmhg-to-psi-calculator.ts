// Auto-generated from mmhg-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Mmhg_to_psi_calculatorInput {
  pressureMMHG: number;
  conversionFactor: number;
  offset: number;
  outputPrecision: number;
  dataConfidence?: number;
}

export const Mmhg_to_psi_calculatorInputSchema = z.object({
  pressureMMHG: z.number().default(760),
  conversionFactor: z.number().default(0.0193368),
  offset: z.number().default(0),
  outputPrecision: z.number().default(4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mmhg_to_psi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pressureMMHG * input.conversionFactor + input.offset; results["psiRaw"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["psiRaw"] = Number.NaN; }
  try { const v = input.pressureMMHG * input.conversionFactor + input.offset; results["psiRaw_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["psiRaw_aux"] = Number.NaN; }
  return results;
}


export function calculateMmhg_to_psi_calculator(input: Mmhg_to_psi_calculatorInput): Mmhg_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["psiRaw_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
