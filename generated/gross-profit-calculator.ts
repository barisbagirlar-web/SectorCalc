// @ts-nocheck
// Auto-generated from gross-profit-calculator-schema.json
import * as z from 'zod';

export interface Gross_profit_calculatorInput {
  grossSales: number;
  salesReturns: number;
  salesDiscounts: number;
  salesAllowances: number;
  cogs: number;
}

export const Gross_profit_calculatorInputSchema = z.object({
  grossSales: z.number().default(0),
  salesReturns: z.number().default(0),
  salesDiscounts: z.number().default(0),
  salesAllowances: z.number().default(0),
  cogs: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gross_profit_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.grossSales - input.salesReturns - input.salesDiscounts - input.salesAllowances; results["netSales"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netSales"] = 0; }
  try { const v = (asFormulaNumber(results["netSales"])) - input.cogs; results["grossProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = (asFormulaNumber(results["netSales"])) !== 0 ? ((asFormulaNumber(results["grossProfit"])) / (asFormulaNumber(results["netSales"]))) * 100 : 0; results["grossMargin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossMargin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGross_profit_calculator(input: Gross_profit_calculatorInput): Gross_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grossProfit"]);
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


export interface Gross_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
