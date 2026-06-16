// Auto-generated from days-sales-outstanding-calculator-schema.json
import * as z from 'zod';

export interface Days_sales_outstanding_calculatorInput {
  beginningAR: number;
  endingAR: number;
  netCreditSales: number;
  periodDays: number;
}

export const Days_sales_outstanding_calculatorInputSchema = z.object({
  beginningAR: z.number().default(0),
  endingAR: z.number().default(0),
  netCreditSales: z.number().default(0),
  periodDays: z.number().default(365),
});

function evaluateAllFormulas(input: Days_sales_outstanding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.beginningAR + input.endingAR) / 2; results["averageAR"] = Number.isFinite(v) ? v : 0; } catch { results["averageAR"] = 0; }
  try { const v = input.netCreditSales !== 0 ? ((results["averageAR"] ?? 0) / input.netCreditSales * input.periodDays) : null; results["dso"] = Number.isFinite(v) ? v : 0; } catch { results["dso"] = 0; }
  return results;
}


export function calculateDays_sales_outstanding_calculator(input: Days_sales_outstanding_calculatorInput): Days_sales_outstanding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dso"] ?? 0;
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


export interface Days_sales_outstanding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
