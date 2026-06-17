// @ts-nocheck
// Auto-generated from roe-calculator-schema.json
import * as z from 'zod';

export interface Roe_calculatorInput {
  netIncome: number;
  revenue: number;
  totalAssets: number;
  shareholdersEquity: number;
}

export const Roe_calculatorInputSchema = z.object({
  netIncome: z.number().default(1000000),
  revenue: z.number().default(5000000),
  totalAssets: z.number().default(10000000),
  shareholdersEquity: z.number().default(4000000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Roe_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.netIncome / input.revenue) * 100; results["netProfitMargin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netProfitMargin"] = 0; }
  try { const v = input.revenue / input.totalAssets; results["assetTurnover"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["assetTurnover"] = 0; }
  try { const v = input.totalAssets / input.shareholdersEquity; results["equityMultiplier"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["equityMultiplier"] = 0; }
  try { const v = (input.netIncome / input.shareholdersEquity) * 100; results["roe"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["roe"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRoe_calculator(input: Roe_calculatorInput): Roe_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["roe"]);
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


export interface Roe_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
