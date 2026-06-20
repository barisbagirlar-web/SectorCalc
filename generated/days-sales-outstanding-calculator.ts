// Auto-generated from days-sales-outstanding-calculator-schema.json
import * as z from 'zod';

export interface Days_sales_outstanding_calculatorInput {
  beginningAR: number;
  endingAR: number;
  netCreditSales: number;
  periodDays: number;
  dataConfidence?: number;
}

export const Days_sales_outstanding_calculatorInputSchema = z.object({
  beginningAR: z.number().default(0),
  endingAR: z.number().default(0),
  netCreditSales: z.number().default(0),
  periodDays: z.number().default(365),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Days_sales_outstanding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.beginningAR + input.endingAR) / 2; results["averageAR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averageAR"] = Number.NaN; }
  try { const v = ((input.netCreditSales !== 0 ? ((toNumericFormulaValue(results["averageAR"])) / input.netCreditSales * input.periodDays) : null) ? 1 : 0); results["dso"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dso"] = Number.NaN; }
  return results;
}


export function calculateDays_sales_outstanding_calculator(input: Days_sales_outstanding_calculatorInput): Days_sales_outstanding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dso"]);
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


export interface Days_sales_outstanding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
