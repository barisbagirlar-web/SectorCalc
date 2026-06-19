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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Days_sales_outstanding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.beginningAR + input.endingAR) / 2; results["averageAR"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averageAR"] = 0; }
  try { const v = ((input.netCreditSales !== 0 ? ((asFormulaNumber(results["averageAR"])) / input.netCreditSales * input.periodDays) : null) ? 1 : 0); results["dso"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dso"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDays_sales_outstanding_calculator(input: Days_sales_outstanding_calculatorInput): Days_sales_outstanding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["dso"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
