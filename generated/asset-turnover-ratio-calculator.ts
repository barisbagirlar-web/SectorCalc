// Auto-generated from asset-turnover-ratio-calculator-schema.json
import * as z from 'zod';

export interface Asset_turnover_ratio_calculatorInput {
  netSales: number;
  totalAssetsBeginning: number;
  totalAssetsEnding: number;
  industryAverage: number;
  dataConfidence?: number;
}

export const Asset_turnover_ratio_calculatorInputSchema = z.object({
  netSales: z.number().default(1000000),
  totalAssetsBeginning: z.number().default(500000),
  totalAssetsEnding: z.number().default(600000),
  industryAverage: z.number().default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Asset_turnover_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.totalAssetsBeginning + input.totalAssetsEnding) / 2; results["averageTotalAssets"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averageTotalAssets"] = Number.NaN; }
  try { const v = input.netSales / ((input.totalAssetsBeginning + input.totalAssetsEnding) / 2); results["assetTurnoverRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["assetTurnoverRatio"] = Number.NaN; }
  try { const v = input.netSales; results["netSales"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netSales"] = Number.NaN; }
  return results;
}


export function calculateAsset_turnover_ratio_calculator(input: Asset_turnover_ratio_calculatorInput): Asset_turnover_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["assetTurnoverRatio"]);
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


export interface Asset_turnover_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
