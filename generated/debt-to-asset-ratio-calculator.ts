// @ts-nocheck
// Auto-generated from debt-to-asset-ratio-calculator-schema.json
import * as z from 'zod';

export interface Debt_to_asset_ratio_calculatorInput {
  shortTermLiabilities: number;
  longTermLiabilities: number;
  currentAssets: number;
  nonCurrentAssets: number;
}

export const Debt_to_asset_ratio_calculatorInputSchema = z.object({
  shortTermLiabilities: z.number().default(0),
  longTermLiabilities: z.number().default(0),
  currentAssets: z.number().default(0),
  nonCurrentAssets: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Debt_to_asset_ratio_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.shortTermLiabilities + input.longTermLiabilities; results["totalLiabilities"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLiabilities"] = 0; }
  try { const v = input.currentAssets + input.nonCurrentAssets; results["totalAssets"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalAssets"] = 0; }
  try { const v = (asFormulaNumber(results["totalAssets"])) !== 0 ? ((asFormulaNumber(results["totalLiabilities"])) / (asFormulaNumber(results["totalAssets"]))) * 100 : null; results["debtToAssetRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["debtToAssetRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDebt_to_asset_ratio_calculator(input: Debt_to_asset_ratio_calculatorInput): Debt_to_asset_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["debtToAssetRatio"]);
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


export interface Debt_to_asset_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
