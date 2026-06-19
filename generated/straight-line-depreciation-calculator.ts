// Auto-generated from straight-line-depreciation-calculator-schema.json
import * as z from 'zod';

export interface Straight_line_depreciation_calculatorInput {
  assetCost: number;
  salvageValue: number;
  usefulLife: number;
  yearsElapsed: number;
  dataConfidence?: number;
}

export const Straight_line_depreciation_calculatorInputSchema = z.object({
  assetCost: z.number().default(10000),
  salvageValue: z.number().default(1000),
  usefulLife: z.number().default(5),
  yearsElapsed: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Straight_line_depreciation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.assetCost - input.salvageValue) / input.usefulLife; results["annualDepreciation"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualDepreciation"] = 0; }
  try { const v = (input.assetCost - input.salvageValue) / input.usefulLife; results["annualDepreciation_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualDepreciation_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStraight_line_depreciation_calculator(input: Straight_line_depreciation_calculatorInput): Straight_line_depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["annualDepreciation"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
