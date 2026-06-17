// @ts-nocheck
// Auto-generated from percent-off-calculator-schema.json
import * as z from 'zod';

export interface Percent_off_calculatorInput {
  original_price: number;
  discount_percent: number;
  additional_discount_percent: number;
  tax_rate: number;
}

export const Percent_off_calculatorInputSchema = z.object({
  original_price: z.number().default(0),
  discount_percent: z.number().default(0),
  additional_discount_percent: z.number().default(0),
  tax_rate: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Percent_off_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.original_price * (1 - input.discount_percent/100) * (1 - input.additional_discount_percent/100); results["discounted_price"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["discounted_price"] = 0; }
  try { const v = (asFormulaNumber(results["discounted_price"])) * (input.tax_rate/100); results["tax_amount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tax_amount"] = 0; }
  try { const v = (asFormulaNumber(results["discounted_price"])) + (asFormulaNumber(results["tax_amount"])); results["final_price"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["final_price"] = 0; }
  try { const v = input.original_price - (asFormulaNumber(results["final_price"])); results["total_savings"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_savings"] = 0; }
  try { const v = input.original_price; results["display_original_price"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["display_original_price"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePercent_off_calculator(input: Percent_off_calculatorInput): Percent_off_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["final_price"]);
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


export interface Percent_off_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
