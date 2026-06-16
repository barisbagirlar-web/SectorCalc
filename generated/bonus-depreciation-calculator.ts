// Auto-generated from bonus-depreciation-calculator-schema.json
import * as z from 'zod';

export interface Bonus_depreciation_calculatorInput {
  assetCost: number;
  bonusRate: number;
  businessUse: number;
  section179: number;
}

export const Bonus_depreciation_calculatorInputSchema = z.object({
  assetCost: z.number().default(10000),
  bonusRate: z.number().default(100),
  businessUse: z.number().default(100),
  section179: z.number().default(0),
});

function evaluateAllFormulas(input: Bonus_depreciation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.assetCost - input.section179) * (input.bonusRate / 100) * (input.businessUse / 100); results["bonusDepreciation"] = Number.isFinite(v) ? v : 0; } catch { results["bonusDepreciation"] = 0; }
  try { const v = input.assetCost - input.section179 - ((input.assetCost - input.section179) * (input.bonusRate / 100) * (input.businessUse / 100)); results["remainingBasis"] = Number.isFinite(v) ? v : 0; } catch { results["remainingBasis"] = 0; }
  try { const v = input.section179 + ((input.assetCost - input.section179) * (input.bonusRate / 100) * (input.businessUse / 100)); results["totalFirstYear"] = Number.isFinite(v) ? v : 0; } catch { results["totalFirstYear"] = 0; }
  return results;
}


export function calculateBonus_depreciation_calculator(input: Bonus_depreciation_calculatorInput): Bonus_depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bonusDepreciation"] ?? 0;
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


export interface Bonus_depreciation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
