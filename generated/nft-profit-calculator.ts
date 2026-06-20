// Auto-generated from nft-profit-calculator-schema.json
import * as z from 'zod';

export interface Nft_profit_calculatorInput {
  purchasePrice: number;
  gasFee: number;
  listingFee: number;
  salePrice: number;
  royaltyPercent: number;
  dataConfidence?: number;
}

export const Nft_profit_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(0),
  gasFee: z.number().default(0),
  listingFee: z.number().default(0),
  salePrice: z.number().default(0),
  royaltyPercent: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Nft_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + input.gasFee + input.listingFee + (input.salePrice * input.royaltyPercent / 100); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = input.salePrice - (input.purchasePrice + input.gasFee + input.listingFee + (input.salePrice * input.royaltyPercent / 100)); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netProfit"] = Number.NaN; }
  try { const v = ((input.salePrice - (input.purchasePrice + input.gasFee + input.listingFee + (input.salePrice * input.royaltyPercent / 100))) / (input.purchasePrice + input.gasFee + input.listingFee + (input.salePrice * input.royaltyPercent / 100))) * 100; results["roiPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["roiPercent"] = Number.NaN; }
  return results;
}


export function calculateNft_profit_calculator(input: Nft_profit_calculatorInput): Nft_profit_calculatorOutput {
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


export interface Nft_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
