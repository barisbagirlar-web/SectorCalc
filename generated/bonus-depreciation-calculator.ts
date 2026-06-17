// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bonus_depreciation_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.assetCost - input.section179) * (input.bonusRate / 100) * (input.businessUse / 100); results["bonusDepreciation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bonusDepreciation"] = 0; }
  try { const v = input.assetCost - input.section179 - ((input.assetCost - input.section179) * (input.bonusRate / 100) * (input.businessUse / 100)); results["remainingBasis"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["remainingBasis"] = 0; }
  try { const v = input.section179 + ((input.assetCost - input.section179) * (input.bonusRate / 100) * (input.businessUse / 100)); results["totalFirstYear"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalFirstYear"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBonus_depreciation_calculator(input: Bonus_depreciation_calculatorInput): Bonus_depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bonusDepreciation"]);
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


export interface Bonus_depreciation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
