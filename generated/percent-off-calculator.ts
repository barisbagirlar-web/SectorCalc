// Auto-generated from percent-off-calculator-schema.json
import * as z from 'zod';

export interface Percent_off_calculatorInput {
  original_price: number;
  discount_percent: number;
  additional_discount_percent: number;
  tax_rate: number;
  dataConfidence?: number;
}

export const Percent_off_calculatorInputSchema = z.object({
  original_price: z.number().default(0),
  discount_percent: z.number().default(0),
  additional_discount_percent: z.number().default(0),
  tax_rate: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Percent_off_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.original_price * (1 - input.discount_percent/100) * (1 - input.additional_discount_percent/100); results["discounted_price"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discounted_price"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["discounted_price"])) * (input.tax_rate/100); results["tax_amount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tax_amount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["discounted_price"])) + (toNumericFormulaValue(results["tax_amount"])); results["final_price"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["final_price"] = Number.NaN; }
  try { const v = input.original_price - (toNumericFormulaValue(results["final_price"])); results["total_savings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_savings"] = Number.NaN; }
  try { const v = input.original_price; results["display_original_price"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["display_original_price"] = Number.NaN; }
  return results;
}


export function calculatePercent_off_calculator(input: Percent_off_calculatorInput): Percent_off_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["final_price"]);
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


export interface Percent_off_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
