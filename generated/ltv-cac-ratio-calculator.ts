// Auto-generated from ltv-cac-ratio-calculator-schema.json
import * as z from 'zod';

export interface Ltv_cac_ratio_calculatorInput {
  arpu: number;
  grossMargin: number;
  churn: number;
  discount: number;
  totalCacSpend: number;
  newCustomers: number;
  dataConfidence?: number;
}

export const Ltv_cac_ratio_calculatorInputSchema = z.object({
  arpu: z.number().default(100),
  grossMargin: z.number().default(70),
  churn: z.number().default(5),
  discount: z.number().default(10),
  totalCacSpend: z.number().default(50000),
  newCustomers: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ltv_cac_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.arpu * input.grossMargin / 100) * (1 / (input.churn / 100)) * (1 / (1 + input.discount / 100)); results["LTV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LTV"] = Number.NaN; }
  try { const v = input.totalCacSpend / input.newCustomers; results["CAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CAC"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["LTV"])) / (toNumericFormulaValue(results["CAC"])); results["LTV_CAC_Ratio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LTV_CAC_Ratio"] = Number.NaN; }
  return results;
}


export function calculateLtv_cac_ratio_calculator(input: Ltv_cac_ratio_calculatorInput): Ltv_cac_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["LTV_CAC_Ratio"]);
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


export interface Ltv_cac_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
