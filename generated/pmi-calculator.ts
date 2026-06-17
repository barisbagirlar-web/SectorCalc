// @ts-nocheck
// Auto-generated from pmi-calculator-schema.json
import * as z from 'zod';

export interface Pmi_calculatorInput {
  revenue: number;
  costOfGoodsSold: number;
  operatingExpenses: number;
  taxRate: number;
}

export const Pmi_calculatorInputSchema = z.object({
  revenue: z.number().default(100000),
  costOfGoodsSold: z.number().default(60000),
  operatingExpenses: z.number().default(20000),
  taxRate: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pmi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.revenue - input.costOfGoodsSold; results["grossProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = (asFormulaNumber(results["grossProfit"])) - input.operatingExpenses; results["operatingProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["operatingProfit"] = 0; }
  try { const v = (asFormulaNumber(results["operatingProfit"])) * (1 - input.taxRate / 100); results["netProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = (asFormulaNumber(results["grossProfit"])) / input.revenue * 100; results["grossProfitMargin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossProfitMargin"] = 0; }
  try { const v = (asFormulaNumber(results["operatingProfit"])) / input.revenue * 100; results["operatingProfitMargin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["operatingProfitMargin"] = 0; }
  try { const v = (asFormulaNumber(results["netProfit"])) / input.revenue * 100; results["netProfitMargin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netProfitMargin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePmi_calculator(input: Pmi_calculatorInput): Pmi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netProfitMargin"]);
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


export interface Pmi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
