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

function evaluateAllFormulas(input: Gross_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossSales - input.salesReturns - input.salesDiscounts - input.salesAllowances; results["netSales"] = Number.isFinite(v) ? v : 0; } catch { results["netSales"] = 0; }
  try { const v = (results["netSales"] ?? 0) - input.cogs; results["grossProfit"] = Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = (results["netSales"] ?? 0) !== 0 ? ((results["grossProfit"] ?? 0) / (results["netSales"] ?? 0)) * 100 : 0; results["grossMargin"] = Number.isFinite(v) ? v : 0; } catch { results["grossMargin"] = 0; }
  return results;
}


export function calculateGross_profit_calculator(input: Gross_profit_calculatorInput): Gross_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["grossProfit"] ?? 0;
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


export interface Gross_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
