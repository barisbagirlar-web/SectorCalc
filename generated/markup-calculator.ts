// @ts-nocheck
// Auto-generated from markup-calculator-schema.json
import * as z from 'zod';

export interface Markup_calculatorInput {
  costPrice: number;
  markupPercent: number;
  quantity: number;
  additionalCostPerUnit: number;
}

export const Markup_calculatorInputSchema = z.object({
  costPrice: z.number().default(100),
  markupPercent: z.number().default(50),
  quantity: z.number().default(1),
  additionalCostPerUnit: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Markup_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.costPrice + input.costPrice * input.markupPercent / 100 + input.additionalCostPerUnit; results["sellingPrice"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sellingPrice"] = 0; }
  try { const v = (input.costPrice + input.costPrice * input.markupPercent / 100 + input.additionalCostPerUnit) * input.quantity; results["totalRevenue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (input.costPrice + input.costPrice * input.markupPercent / 100 + input.additionalCostPerUnit) * input.quantity - (input.costPrice + input.additionalCostPerUnit) * input.quantity; results["totalProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalProfit"] = 0; }
  try { const v = (((input.costPrice + input.costPrice * input.markupPercent / 100 + input.additionalCostPerUnit) * input.quantity - (input.costPrice + input.additionalCostPerUnit) * input.quantity) / ((input.costPrice + input.costPrice * input.markupPercent / 100 + input.additionalCostPerUnit) * input.quantity)) * 100; results["profitMargin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["profitMargin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMarkup_calculator(input: Markup_calculatorInput): Markup_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPrice"]);
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


export interface Markup_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
