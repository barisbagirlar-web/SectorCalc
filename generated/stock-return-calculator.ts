// @ts-nocheck
// Auto-generated from stock-return-calculator-schema.json
import * as z from 'zod';

export interface Stock_return_calculatorInput {
  numberOfShares: number;
  purchasePrice: number;
  sellingPrice: number;
  dividends: number;
  holdingPeriodYears: number;
}

export const Stock_return_calculatorInputSchema = z.object({
  numberOfShares: z.number().default(100),
  purchasePrice: z.number().default(50),
  sellingPrice: z.number().default(60),
  dividends: z.number().default(0),
  holdingPeriodYears: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stock_return_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.numberOfShares * input.purchasePrice; results["totalInvestmentCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalInvestmentCost"] = 0; }
  try { const v = input.numberOfShares * input.sellingPrice + input.dividends - input.numberOfShares * input.purchasePrice; results["totalReturnAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalReturnAmount"] = 0; }
  try { const v = ((input.numberOfShares * input.sellingPrice + input.dividends - input.numberOfShares * input.purchasePrice) / (input.numberOfShares * input.purchasePrice)) * 100; results["returnPercentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["returnPercentage"] = 0; }
  try { const v = (((input.numberOfShares * input.sellingPrice + input.dividends) / (input.numberOfShares * input.purchasePrice)) ** (1 / input.holdingPeriodYears) - 1) * 100; results["annualizedReturnPercentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualizedReturnPercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStock_return_calculator(input: Stock_return_calculatorInput): Stock_return_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["returnPercentage"]);
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


export interface Stock_return_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
