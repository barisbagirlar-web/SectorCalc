// @ts-nocheck
// Auto-generated from restaurant-menu-margin-leak-calculator-schema.json
import * as z from 'zod';

export interface Restaurant_menu_margin_leak_calculatorInput {
  avg_cover_price: number;
  food_cost_per_cover: number;
  labor_cost_per_cover: number;
  overhead_per_cover: number;
  waste_percentage: number;
  theft_shrinkage_percentage: number;
  discount_comp_percentage: number;
  covers_per_period: number;
}

export const Restaurant_menu_margin_leak_calculatorInputSchema = z.object({
  avg_cover_price: z.number().min(0).max(500).default(18.5),
  food_cost_per_cover: z.number().min(0).max(200).default(6.5),
  labor_cost_per_cover: z.number().min(0).max(100).default(4.2),
  overhead_per_cover: z.number().min(0).max(100).default(2.8),
  waste_percentage: z.number().min(0).max(50).default(5),
  theft_shrinkage_percentage: z.number().min(0).max(20).default(1.5),
  discount_comp_percentage: z.number().min(0).max(30).default(3),
  covers_per_period: z.number().min(0).max(100000).default(3000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Restaurant_menu_margin_leak_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.covers_per_period * input.avg_cover_price; results["base_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.covers_per_period * input.avg_cover_price * (1 + (input.waste_percentage / 100)); results["adjusted_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.covers_per_period * input.avg_cover_price * (1 + (input.waste_percentage / 100)) * (input.food_cost_per_cover); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.food_cost_per_cover; results["factor_food_cost_per_cover"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["factor_food_cost_per_cover"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRestaurant_menu_margin_leak_calculator(input: Restaurant_menu_margin_leak_calculatorInput): Restaurant_menu_margin_leak_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-location benchmarking","Ingredient cost roll-up"],
  };
}


export interface Restaurant_menu_margin_leak_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
