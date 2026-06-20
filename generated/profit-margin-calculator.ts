// Auto-generated from profit-margin-calculator-schema.json
import * as z from 'zod';

export interface Profit_margin_calculatorInput {
  totalRevenue: number;
  costOfGoodsSold: number;
  operatingExpenses: number;
  otherExpenses: number;
  taxExpense: number;
  dataConfidence?: number;
}

export const Profit_margin_calculatorInputSchema = z.object({
  totalRevenue: z.number().default(100000),
  costOfGoodsSold: z.number().default(60000),
  operatingExpenses: z.number().default(20000),
  otherExpenses: z.number().default(5000),
  taxExpense: z.number().default(5000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Profit_margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalRevenue - input.costOfGoodsSold; results["grossProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossProfit"] = Number.NaN; }
  try { const v = (input.totalRevenue - input.costOfGoodsSold) / input.totalRevenue * 100; results["grossMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossMargin"] = Number.NaN; }
  try { const v = input.totalRevenue - input.costOfGoodsSold - input.operatingExpenses; results["operatingProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["operatingProfit"] = Number.NaN; }
  try { const v = (input.totalRevenue - input.costOfGoodsSold - input.operatingExpenses) / input.totalRevenue * 100; results["operatingMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["operatingMargin"] = Number.NaN; }
  try { const v = input.totalRevenue - input.costOfGoodsSold - input.operatingExpenses - input.otherExpenses; results["profitBeforeTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitBeforeTax"] = Number.NaN; }
  try { const v = (input.totalRevenue - input.costOfGoodsSold - input.operatingExpenses - input.otherExpenses) / input.totalRevenue * 100; results["preTaxMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["preTaxMargin"] = Number.NaN; }
  try { const v = input.totalRevenue - input.costOfGoodsSold - input.operatingExpenses - input.otherExpenses - input.taxExpense; results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netProfit"] = Number.NaN; }
  try { const v = (input.totalRevenue - input.costOfGoodsSold - input.operatingExpenses - input.otherExpenses - input.taxExpense) / input.totalRevenue * 100; results["netMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netMargin"] = Number.NaN; }
  return results;
}


export function calculateProfit_margin_calculator(input: Profit_margin_calculatorInput): Profit_margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netMargin"]);
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


export interface Profit_margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
