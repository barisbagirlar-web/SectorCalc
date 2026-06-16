// Auto-generated from asset-turnover-ratio-calculator-schema.json
import * as z from 'zod';

export interface Asset_turnover_ratio_calculatorInput {
  netSales: number;
  totalAssetsBeginning: number;
  totalAssetsEnding: number;
  industryAverage: number;
}

export const Asset_turnover_ratio_calculatorInputSchema = z.object({
  netSales: z.number().default(1000000),
  totalAssetsBeginning: z.number().default(500000),
  totalAssetsEnding: z.number().default(600000),
  industryAverage: z.number().default(1.5),
});

function evaluateAllFormulas(input: Asset_turnover_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.totalAssetsBeginning + input.totalAssetsEnding) / 2; results["averageTotalAssets"] = Number.isFinite(v) ? v : 0; } catch { results["averageTotalAssets"] = 0; }
  try { const v = input.netSales / ((input.totalAssetsBeginning + input.totalAssetsEnding) / 2); results["assetTurnoverRatio"] = Number.isFinite(v) ? v : 0; } catch { results["assetTurnoverRatio"] = 0; }
  return results;
}


export function calculateAsset_turnover_ratio_calculator(input: Asset_turnover_ratio_calculatorInput): Asset_turnover_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["assetTurnoverRatio"] ?? 0;
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


export interface Asset_turnover_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
