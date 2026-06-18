// @ts-nocheck
// Auto-generated from mortgage-refinance-calculator-schema.json
import * as z from 'zod';

export interface Mortgage_refinance_calculatorInput {
  currentBalance: number;
  currentRate: number;
  currentTermRemaining: number;
  newRate: number;
  newTerm: number;
  closingCosts: number;
}

export const Mortgage_refinance_calculatorInputSchema = z.object({
  currentBalance: z.number().default(200000),
  currentRate: z.number().default(5.5),
  currentTermRemaining: z.number().default(240),
  newRate: z.number().default(4),
  newTerm: z.number().default(180),
  closingCosts: z.number().default(3000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mortgage_refinance_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.currentBalance * input.closingCosts; results["base_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.currentBalance * input.closingCosts * (1 + (input.currentRate / 100)); results["adjusted_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.currentBalance * input.closingCosts * (1 + (input.currentRate / 100)); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMortgage_refinance_calculator(input: Mortgage_refinance_calculatorInput): Mortgage_refinance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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


export interface Mortgage_refinance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
