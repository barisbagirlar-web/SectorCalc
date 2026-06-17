// @ts-nocheck
// Auto-generated from profit-margin-calculator-schema.json
import * as z from 'zod';

export interface Profit_margin_calculatorInput {
  totalRevenue: number;
  costOfGoodsSold: number;
  operatingExpenses: number;
  otherExpenses: number;
  taxExpense: number;
}

export const Profit_margin_calculatorInputSchema = z.object({
  totalRevenue: z.number().default(100000),
  costOfGoodsSold: z.number().default(60000),
  operatingExpenses: z.number().default(20000),
  otherExpenses: z.number().default(5000),
  taxExpense: z.number().default(5000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Profit_margin_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalRevenue - input.costOfGoodsSold; results["grossProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = (input.totalRevenue - input.costOfGoodsSold) / input.totalRevenue * 100; results["grossMargin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossMargin"] = 0; }
  try { const v = input.totalRevenue - input.costOfGoodsSold - input.operatingExpenses; results["operatingProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["operatingProfit"] = 0; }
  try { const v = (input.totalRevenue - input.costOfGoodsSold - input.operatingExpenses) / input.totalRevenue * 100; results["operatingMargin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["operatingMargin"] = 0; }
  try { const v = input.totalRevenue - input.costOfGoodsSold - input.operatingExpenses - input.otherExpenses; results["profitBeforeTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["profitBeforeTax"] = 0; }
  try { const v = (input.totalRevenue - input.costOfGoodsSold - input.operatingExpenses - input.otherExpenses) / input.totalRevenue * 100; results["preTaxMargin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["preTaxMargin"] = 0; }
  try { const v = input.totalRevenue - input.costOfGoodsSold - input.operatingExpenses - input.otherExpenses - input.taxExpense; results["netProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = (input.totalRevenue - input.costOfGoodsSold - input.operatingExpenses - input.otherExpenses - input.taxExpense) / input.totalRevenue * 100; results["netMargin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netMargin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateProfit_margin_calculator(input: Profit_margin_calculatorInput): Profit_margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netMargin"]);
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


export interface Profit_margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
