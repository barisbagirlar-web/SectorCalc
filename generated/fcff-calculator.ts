// Auto-generated from fcff-calculator-schema.json
import * as z from 'zod';

export interface Fcff_calculatorInput {
  revenue: number;
  operatingExpenses: number;
  depreciation: number;
  taxRate: number;
  capitalExpenditures: number;
  changeInWorkingCapital: number;
}

export const Fcff_calculatorInputSchema = z.object({
  revenue: z.number().default(1000000),
  operatingExpenses: z.number().default(700000),
  depreciation: z.number().default(100000),
  taxRate: z.number().default(0.2),
  capitalExpenditures: z.number().default(200000),
  changeInWorkingCapital: z.number().default(50000),
});

function evaluateAllFormulas(input: Fcff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.revenue - input.operatingExpenses; results["ebit"] = Number.isFinite(v) ? v : 0; } catch { results["ebit"] = 0; }
  try { const v = (results["ebit"] ?? 0) * (1 - input.taxRate); results["nopat"] = Number.isFinite(v) ? v : 0; } catch { results["nopat"] = 0; }
  try { const v = (results["nopat"] ?? 0) + input.depreciation - input.capitalExpenditures - input.changeInWorkingCapital; results["fcff"] = Number.isFinite(v) ? v : 0; } catch { results["fcff"] = 0; }
  return results;
}


export function calculateFcff_calculator(input: Fcff_calculatorInput): Fcff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fcff"] ?? 0;
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


export interface Fcff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
