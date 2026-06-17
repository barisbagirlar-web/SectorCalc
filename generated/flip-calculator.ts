// @ts-nocheck
// Auto-generated from flip-calculator-schema.json
import * as z from 'zod';

export interface Flip_calculatorInput {
  purchasePrice: number;
  renovationCost: number;
  holdingCosts: number;
  sellingPrice: number;
  sellingCosts: number;
  financingCosts: number;
}

export const Flip_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(100000),
  renovationCost: z.number().default(20000),
  holdingCosts: z.number().default(5000),
  sellingPrice: z.number().default(150000),
  sellingCosts: z.number().default(10000),
  financingCosts: z.number().default(3000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Flip_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.purchasePrice + input.renovationCost + input.holdingCosts; results["totalInvestment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = input.sellingPrice - (asFormulaNumber(results["totalInvestment"])) - input.sellingCosts - input.financingCosts; results["grossProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = (asFormulaNumber(results["grossProfit"])); results["netProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = (asFormulaNumber(results["totalInvestment"])) !== 0 ? ((asFormulaNumber(results["netProfit"])) / (asFormulaNumber(results["totalInvestment"]))) * 100 : 0; results["roi"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFlip_calculator(input: Flip_calculatorInput): Flip_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netProfit"]);
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


export interface Flip_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
