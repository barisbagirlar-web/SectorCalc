// Auto-generated from bonus-depreciation-calculator-schema.json
import * as z from 'zod';

export interface Bonus_depreciation_calculatorInput {
  assetCost: number;
  bonusRate: number;
  businessUse: number;
  section179: number;
  dataConfidence?: number;
}

export const Bonus_depreciation_calculatorInputSchema = z.object({
  assetCost: z.number().default(10000),
  bonusRate: z.number().default(100),
  businessUse: z.number().default(100),
  section179: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bonus_depreciation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.assetCost - input.section179) * (input.bonusRate / 100) * (input.businessUse / 100); results["bonusDepreciation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bonusDepreciation"] = Number.NaN; }
  try { const v = input.assetCost - input.section179 - ((input.assetCost - input.section179) * (input.bonusRate / 100) * (input.businessUse / 100)); results["remainingBasis"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["remainingBasis"] = Number.NaN; }
  try { const v = input.section179 + ((input.assetCost - input.section179) * (input.bonusRate / 100) * (input.businessUse / 100)); results["totalFirstYear"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFirstYear"] = Number.NaN; }
  return results;
}


export function calculateBonus_depreciation_calculator(input: Bonus_depreciation_calculatorInput): Bonus_depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bonusDepreciation"]);
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


export interface Bonus_depreciation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
