// Auto-generated from section-179-calculator-schema.json
import * as z from 'zod';

export interface Section_179_calculatorInput {
  assetCost: number;
  businessUsePercent: number;
  section179Limit: number;
  phaseOutThreshold: number;
  totalAssetAdditions: number;
}

export const Section_179_calculatorInputSchema = z.object({
  assetCost: z.number().default(50000),
  businessUsePercent: z.number().default(100),
  section179Limit: z.number().default(1220000),
  phaseOutThreshold: z.number().default(3050000),
  totalAssetAdditions: z.number().default(50000),
});

function evaluateAllFormulas(input: Section_179_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, input.section179Limit - Math.max(0, input.totalAssetAdditions - input.phaseOutThreshold)); results["reducedLimit"] = Number.isFinite(v) ? v : 0; } catch { results["reducedLimit"] = 0; }
  try { const v = Math.min(input.assetCost, (results["reducedLimit"] ?? 0)); results["tentativeDeduction"] = Number.isFinite(v) ? v : 0; } catch { results["tentativeDeduction"] = 0; }
  try { const v = (results["tentativeDeduction"] ?? 0) * (input.businessUsePercent / 100); results["section179Deduction"] = Number.isFinite(v) ? v : 0; } catch { results["section179Deduction"] = 0; }
  try { const v = input.assetCost - (results["section179Deduction"] ?? 0); results["remainingBasis"] = Number.isFinite(v) ? v : 0; } catch { results["remainingBasis"] = 0; }
  return results;
}


export function calculateSection_179_calculator(input: Section_179_calculatorInput): Section_179_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["section179Deduction"] ?? 0;
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


export interface Section_179_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
