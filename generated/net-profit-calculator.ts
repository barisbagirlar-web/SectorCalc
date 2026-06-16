// Auto-generated from net-profit-calculator-schema.json
import * as z from 'zod';

export interface Net_profit_calculatorInput {
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  interestExpense: number;
  taxExpense: number;
}

export const Net_profit_calculatorInputSchema = z.object({
  revenue: z.number().default(100000),
  cogs: z.number().default(60000),
  operatingExpenses: z.number().default(20000),
  interestExpense: z.number().default(5000),
  taxExpense: z.number().default(10000),
});

function evaluateAllFormulas(input: Net_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.revenue - input.cogs; results["grossProfit"] = Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = input.operatingExpenses + input.interestExpense + input.taxExpense; results["totalExpenses"] = Number.isFinite(v) ? v : 0; } catch { results["totalExpenses"] = 0; }
  try { const v = (results["grossProfit"] ?? 0) - (results["totalExpenses"] ?? 0); results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  return results;
}


export function calculateNet_profit_calculator(input: Net_profit_calculatorInput): Net_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netProfit"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
