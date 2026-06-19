// Auto-generated from fcff-calculator-schema.json
import * as z from 'zod';

export interface Fcff_calculatorInput {
  revenue: number;
  operatingExpenses: number;
  depreciation: number;
  taxRate: number;
  capitalExpenditures: number;
  changeInWorkingCapital: number;
  dataConfidence?: number;
}

export const Fcff_calculatorInputSchema = z.object({
  revenue: z.number().default(1000000),
  operatingExpenses: z.number().default(700000),
  depreciation: z.number().default(100000),
  taxRate: z.number().default(0.2),
  capitalExpenditures: z.number().default(200000),
  changeInWorkingCapital: z.number().default(50000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fcff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.revenue - input.operatingExpenses; results["ebit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ebit"] = 0; }
  try { const v = (asFormulaNumber(results["ebit"])) * (1 - input.taxRate); results["nopat"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["nopat"] = 0; }
  try { const v = (asFormulaNumber(results["nopat"])) + input.depreciation - input.capitalExpenditures - input.changeInWorkingCapital; results["fcff"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fcff"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFcff_calculator(input: Fcff_calculatorInput): Fcff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["fcff"]));
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


export interface Fcff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
