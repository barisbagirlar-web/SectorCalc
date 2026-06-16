// Auto-generated from nft-profit-calculator-schema.json
import * as z from 'zod';

export interface Nft_profit_calculatorInput {
  purchasePrice: number;
  gasFee: number;
  listingFee: number;
  salePrice: number;
  royaltyPercent: number;
}

export const Nft_profit_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(0),
  gasFee: z.number().default(0),
  listingFee: z.number().default(0),
  salePrice: z.number().default(0),
  royaltyPercent: z.number().default(0),
});

function evaluateAllFormulas(input: Nft_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + input.gasFee + input.listingFee + (input.salePrice * input.royaltyPercent / 100); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.salePrice - (input.purchasePrice + input.gasFee + input.listingFee + (input.salePrice * input.royaltyPercent / 100)); results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = ((input.salePrice - (input.purchasePrice + input.gasFee + input.listingFee + (input.salePrice * input.royaltyPercent / 100))) / (input.purchasePrice + input.gasFee + input.listingFee + (input.salePrice * input.royaltyPercent / 100))) * 100; results["roiPercent"] = Number.isFinite(v) ? v : 0; } catch { results["roiPercent"] = 0; }
  return results;
}


export function calculateNft_profit_calculator(input: Nft_profit_calculatorInput): Nft_profit_calculatorOutput {
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


export interface Nft_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
