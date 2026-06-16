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

function evaluateAllFormulas(input: Stock_return_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfShares * input.purchasePrice; results["totalInvestmentCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalInvestmentCost"] = 0; }
  try { const v = input.numberOfShares * input.sellingPrice + input.dividends - input.numberOfShares * input.purchasePrice; results["totalReturnAmount"] = Number.isFinite(v) ? v : 0; } catch { results["totalReturnAmount"] = 0; }
  try { const v = ((input.numberOfShares * input.sellingPrice + input.dividends - input.numberOfShares * input.purchasePrice) / (input.numberOfShares * input.purchasePrice)) * 100; results["returnPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["returnPercentage"] = 0; }
  try { const v = (((input.numberOfShares * input.sellingPrice + input.dividends) / (input.numberOfShares * input.purchasePrice)) ** (1 / input.holdingPeriodYears) - 1) * 100; results["annualizedReturnPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["annualizedReturnPercentage"] = 0; }
  return results;
}


export function calculateStock_return_calculator(input: Stock_return_calculatorInput): Stock_return_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["returnPercentage"] ?? 0;
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


export interface Stock_return_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
