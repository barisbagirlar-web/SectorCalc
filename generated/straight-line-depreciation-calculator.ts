// Auto-generated from straight-line-depreciation-calculator-schema.json
import * as z from 'zod';

export interface Straight_line_depreciation_calculatorInput {
  assetCost: number;
  salvageValue: number;
  usefulLife: number;
  yearsElapsed: number;
}

export const Straight_line_depreciation_calculatorInputSchema = z.object({
  assetCost: z.number().default(10000),
  salvageValue: z.number().default(1000),
  usefulLife: z.number().default(5),
  yearsElapsed: z.number().default(3),
});

function evaluateAllFormulas(input: Straight_line_depreciation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.assetCost - input.salvageValue) / input.usefulLife; results["annualDepreciation"] = Number.isFinite(v) ? v : 0; } catch { results["annualDepreciation"] = 0; }
  try { const v = Math.min(input.yearsElapsed * (input.assetCost - input.salvageValue) / input.usefulLife, input.assetCost - input.salvageValue); results["accumulatedDepreciation"] = Number.isFinite(v) ? v : 0; } catch { results["accumulatedDepreciation"] = 0; }
  try { const v = input.assetCost - Math.min(input.yearsElapsed * (input.assetCost - input.salvageValue) / input.usefulLife, input.assetCost - input.salvageValue); results["bookValue"] = Number.isFinite(v) ? v : 0; } catch { results["bookValue"] = 0; }
  return results;
}


export function calculateStraight_line_depreciation_calculator(input: Straight_line_depreciation_calculatorInput): Straight_line_depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["annualDepreciation"] ?? 0;
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


export interface Straight_line_depreciation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
