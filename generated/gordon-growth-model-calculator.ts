// @ts-nocheck
// Auto-generated from gordon-growth-model-calculator-schema.json
import * as z from 'zod';

export interface Gordon_growth_model_calculatorInput {
  currentDividend: number;
  growthRate: number;
  requiredReturn: number;
  marketPrice: number;
}

export const Gordon_growth_model_calculatorInputSchema = z.object({
  currentDividend: z.number().default(2.5),
  growthRate: z.number().default(3),
  requiredReturn: z.number().default(10),
  marketPrice: z.number().default(50),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gordon_growth_model_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.currentDividend * (1 + input.growthRate/100) / (input.requiredReturn/100 - input.growthRate/100); results["intrinsicValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["intrinsicValue"] = 0; }
  try { const v = (input.currentDividend / input.marketPrice) * 100; results["dividendYield"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dividendYield"] = 0; }
  try { const v = (((asFormulaNumber(results["intrinsicValue"])) - input.marketPrice) / (asFormulaNumber(results["intrinsicValue"]))) * 100; results["marginOfSafety"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["marginOfSafety"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGordon_growth_model_calculator(input: Gordon_growth_model_calculatorInput): Gordon_growth_model_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["intrinsicValue"]);
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


export interface Gordon_growth_model_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
