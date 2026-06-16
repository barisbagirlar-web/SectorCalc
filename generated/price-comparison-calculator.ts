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

function evaluateAllFormulas(input: Price_comparison_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.priceA * input.quantityA * (1 - input.discountA/100) * (1 + input.taxRate/100); results["totalA"] = Number.isFinite(v) ? v : 0; } catch { results["totalA"] = 0; }
  try { const v = input.priceB * input.quantityB * (1 - input.discountB/100) * (1 + input.taxRate/100); results["totalB"] = Number.isFinite(v) ? v : 0; } catch { results["totalB"] = 0; }
  try { const v = Math.abs((results["totalA"] ?? 0) - (results["totalB"] ?? 0)); results["difference"] = Number.isFinite(v) ? v : 0; } catch { results["difference"] = 0; }
  try { const v = (results["totalA"] ?? 0) < (results["totalB"] ?? 0) ? `Product A is cheaper by ${(results["difference"] ?? 0).toFixed(2)} currency` : (results["totalB"] ?? 0) < (results["totalA"] ?? 0) ? `Product B is cheaper by ${(results["difference"] ?? 0).toFixed(2)} currency` : 'Both products cost the same'; results["comparisonResult"] = Number.isFinite(v) ? v : 0; } catch { results["comparisonResult"] = 0; }
  return results;
}


export function calculatePrice_comparison_calculator(input: Price_comparison_calculatorInput): Price_comparison_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["comparisonResult"] ?? 0;
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


export interface Price_comparison_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
