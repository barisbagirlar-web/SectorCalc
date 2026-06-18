// @ts-nocheck
// Auto-generated from discount-calculator-schema.json
import * as z from 'zod';

export interface Discount_calculatorInput {
  list_price: number;
  discount_percent: number;
  quantity: number;
  variable_cost_per_unit: number;
  fixed_cost_allocation: number;
  discount_type: string;
  apply_to_all_units: boolean;
}

export const Discount_calculatorInputSchema = z.object({
  list_price: z.number().min(0.01).max(100000).default(100),
  discount_percent: z.number().min(0).max(100).default(10),
  quantity: z.number().min(1).max(1000000).default(100),
  variable_cost_per_unit: z.number().min(0).max(100000).default(40),
  fixed_cost_allocation: z.number().min(0).max(10000000).default(5000),
  discount_type: z.enum(['percentage', 'fixed_amount']).default('percentage'),
  apply_to_all_units: z.boolean().default(true),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Discount_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1; results["annual_exposure_hours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annual_exposure_hours"] = 0; }
  try { const v = input.quantity * (input.discount_percent / 100) * 1 * input.list_price; results["direct_labor_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["direct_labor_cost"] = 0; }
  try { const v = input.quantity * (input.discount_percent / 100) * 1 * input.list_price * input.apply_to_all_units; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDiscount_calculator(input: Discount_calculatorInput): Discount_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates"];
  const suggestedActions: string[] = ["Reconcile labor and maintenance legs separately","Benchmark noise/vibration factors with site measurement"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","API integration"],
  };
}


export interface Discount_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
