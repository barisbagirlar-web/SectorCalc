// @ts-nocheck
// Auto-generated from roof-truss-calculator-schema.json
import * as z from 'zod';

export interface Roof_truss_calculatorInput {
  span: number;
  rise: number;
  overhang: number;
  length: number;
  spacing: number;
}

export const Roof_truss_calculatorInputSchema = z.object({
  span: z.number().default(10),
  rise: z.number().default(3),
  overhang: z.number().default(0.6),
  length: z.number().default(12),
  spacing: z.number().default(0.6),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Roof_truss_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.span / 2 + input.overhang; results["halfRun"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["halfRun"] = 0; }
  try { const v = input.span / 2 + input.overhang; results["halfRun_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["halfRun_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRoof_truss_calculator(input: Roof_truss_calculatorInput): Roof_truss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["halfRun_aux"]);
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


export interface Roof_truss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
