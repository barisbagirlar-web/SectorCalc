// Auto-generated from ps-ratio-calculator-schema.json
import * as z from 'zod';

export interface Ps_ratio_calculatorInput {
  marketCap: number;
  totalSales: number;
  pricePerShare: number;
  salesPerShare: number;
  dataConfidence?: number;
}

export const Ps_ratio_calculatorInputSchema = z.object({
  marketCap: z.number().default(0),
  totalSales: z.number().default(0),
  pricePerShare: z.number().default(0),
  salesPerShare: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ps_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.marketCap / input.totalSales; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.pricePerShare / input.salesPerShare; results["psPerShare"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["psPerShare"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePs_ratio_calculator(input: Ps_ratio_calculatorInput): Ps_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["psPerShare"]));
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


export interface Ps_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
