// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mmhg_to_psi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.pressureMMHG * input.conversionFactor + input.offset; results["psiRaw"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["psiRaw"] = 0; }
  try { const v = input.pressureMMHG * input.conversionFactor + input.offset; results["psiRaw_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["psiRaw_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMmhg_to_psi_calculator(input: Mmhg_to_psi_calculatorInput): Mmhg_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["psiRaw_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
