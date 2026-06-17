// @ts-nocheck
// Auto-generated from auto-shop-margin-leak-calculator-schema.json
import * as z from 'zod';

export interface Auto_shop_margin_leak_calculatorInput {
  labor_rate_charged: number;
  labor_rate_effective: number;
  total_labor_hours_sold: number;
  parts_markup_percent: number;
  parts_markup_realized: number;
  total_parts_cost: number;
  shop_supply_charge_per_ro: number;
  shop_supply_cost_per_ro: number;
}

export const Auto_shop_margin_leak_calculatorInputSchema = z.object({
  labor_rate_charged: z.number().min(50).max(250).default(120),
  labor_rate_effective: z.number().min(30).max(200).default(95),
  total_labor_hours_sold: z.number().min(0).max(10000).default(1600),
  parts_markup_percent: z.number().min(0).max(200).default(40),
  parts_markup_realized: z.number().min(0).max(200).default(28),
  total_parts_cost: z.number().min(0).max(5000000).default(240000),
  shop_supply_charge_per_ro: z.number().min(0).max(100).default(15),
  shop_supply_cost_per_ro: z.number().min(0).max(150).default(22),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Auto_shop_margin_leak_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.labor_rate_charged + input.labor_rate_effective + input.total_labor_hours_sold; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.labor_rate_charged + input.labor_rate_effective + input.total_labor_hours_sold; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAuto_shop_margin_leak_calculator(input: Auto_shop_margin_leak_calculatorInput): Auto_shop_margin_leak_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Benchmarking against industry KPIs"],
  };
}


export interface Auto_shop_margin_leak_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
