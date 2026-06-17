// @ts-nocheck
// Auto-generated from original-price-calculator-schema.json
import * as z from 'zod';

export interface Original_price_calculatorInput {
  finalPrice: number;
  rawMaterialSurcharge: number;
  laborSurcharge: number;
  overheadPercentage: number;
  profitMarginPercentage: number;
  vatPercentage: number;
}

export const Original_price_calculatorInputSchema = z.object({
  finalPrice: z.number().default(100),
  rawMaterialSurcharge: z.number().default(5),
  laborSurcharge: z.number().default(3),
  overheadPercentage: z.number().default(15),
  profitMarginPercentage: z.number().default(20),
  vatPercentage: z.number().default(18),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Original_price_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.finalPrice / ((1 + input.vatPercentage / 100) * (1 + input.profitMarginPercentage / 100)); results["basePriceBeforeOverhead"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["basePriceBeforeOverhead"] = 0; }
  try { const v = (asFormulaNumber(results["basePriceBeforeOverhead"])) / (1 + input.overheadPercentage / 100) - input.rawMaterialSurcharge - input.laborSurcharge; results["originalBaseCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["originalBaseCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateOriginal_price_calculator(input: Original_price_calculatorInput): Original_price_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["originalBaseCost"]);
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


export interface Original_price_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
