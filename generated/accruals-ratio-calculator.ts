// Auto-generated from accruals-ratio-calculator-schema.json
import * as z from 'zod';

export interface Accruals_ratio_calculatorInput {
  netIncome: number;
  operatingCashFlow: number;
  totalAssetsStart: number;
  totalAssetsEnd: number;
  dataConfidence?: number;
}

export const Accruals_ratio_calculatorInputSchema = z.object({
  netIncome: z.number().default(0),
  operatingCashFlow: z.number().default(0),
  totalAssetsStart: z.number().default(0),
  totalAssetsEnd: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Accruals_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netIncome - input.operatingCashFlow; results["numerator"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["numerator"] = Number.NaN; }
  try { const v = (input.totalAssetsStart + input.totalAssetsEnd) / 2; results["denominator"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["denominator"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["numerator"])) / (toNumericFormulaValue(results["denominator"])); results["accrualsRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["accrualsRatio"] = Number.NaN; }
  return results;
}


export function calculateAccruals_ratio_calculator(input: Accruals_ratio_calculatorInput): Accruals_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["accrualsRatio"]);
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


export interface Accruals_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
