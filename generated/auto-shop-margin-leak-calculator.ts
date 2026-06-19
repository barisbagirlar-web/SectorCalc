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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Auto_shop_margin_leak_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.labor_rate_charged / 100) * (input.labor_rate_effective / 100) * input.total_labor_hours_sold * (input.parts_markup_percent / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = (input.labor_rate_charged / 100) * (input.labor_rate_effective / 100) * input.total_labor_hours_sold * (input.parts_markup_percent / 100) * ((input.parts_markup_realized / 100) * input.total_parts_cost * input.shop_supply_charge_per_ro * input.shop_supply_cost_per_ro); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.parts_markup_realized / 100) * input.total_parts_cost * input.shop_supply_charge_per_ro * input.shop_supply_cost_per_ro; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAuto_shop_margin_leak_calculator(input: Auto_shop_margin_leak_calculatorInput): Auto_shop_margin_leak_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
