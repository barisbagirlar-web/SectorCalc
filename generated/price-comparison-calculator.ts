// Auto-generated from price-comparison-calculator-schema.json
import * as z from 'zod';

export interface Price_comparison_calculatorInput {
  priceA: number;
  priceB: number;
  quantityA: number;
  quantityB: number;
  discountA: number;
  discountB: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Price_comparison_calculatorInputSchema = z.object({
  priceA: z.number().default(10),
  priceB: z.number().default(12),
  quantityA: z.number().default(1),
  quantityB: z.number().default(1),
  discountA: z.number().default(0),
  discountB: z.number().default(0),
  taxRate: z.number().default(18),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Price_comparison_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.priceA * input.quantityA * (1 - input.discountA/100) * (1 + input.taxRate/100); results["totalA"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalA"] = 0; }
  try { const v = input.priceB * input.quantityB * (1 - input.discountB/100) * (1 + input.taxRate/100); results["totalB"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalB"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePrice_comparison_calculator(input: Price_comparison_calculatorInput): Price_comparison_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalB"]);
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


export interface Price_comparison_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
