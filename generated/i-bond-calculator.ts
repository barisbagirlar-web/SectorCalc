// @ts-nocheck
// Auto-generated from i-bond-calculator-schema.json
import * as z from 'zod';

export interface I_bond_calculatorInput {
  principal: number;
  fixedRate: number;
  inflationRate: number;
  years: number;
}

export const I_bond_calculatorInputSchema = z.object({
  principal: z.number().default(10000),
  fixedRate: z.number().default(0.4),
  inflationRate: z.number().default(3.24),
  years: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: I_bond_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.fixedRate/100) + 2*(input.inflationRate/100) + (input.fixedRate/100)*(input.inflationRate/100); results["compositeRateDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["compositeRateDecimal"] = 0; }
  try { const v = (asFormulaNumber(results["compositeRateDecimal"])) * 100; results["compositeRatePercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["compositeRatePercent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateI_bond_calculator(input: I_bond_calculatorInput): I_bond_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["compositeRatePercent"]);
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


export interface I_bond_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
