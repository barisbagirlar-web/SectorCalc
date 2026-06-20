// Auto-generated from net-profit-calculator-schema.json
import * as z from 'zod';

export interface Net_profit_calculatorInput {
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  interestExpense: number;
  taxExpense: number;
  dataConfidence?: number;
}

export const Net_profit_calculatorInputSchema = z.object({
  revenue: z.number().default(100000),
  cogs: z.number().default(60000),
  operatingExpenses: z.number().default(20000),
  interestExpense: z.number().default(5000),
  taxExpense: z.number().default(10000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Net_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.revenue - input.cogs; results["grossProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossProfit"] = Number.NaN; }
  try { const v = input.operatingExpenses + input.interestExpense + input.taxExpense; results["totalExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalExpenses"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossProfit"])) - (toNumericFormulaValue(results["totalExpenses"])); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netProfit"] = Number.NaN; }
  return results;
}


export function calculateNet_profit_calculator(input: Net_profit_calculatorInput): Net_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netProfit"]);
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


export interface Net_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
