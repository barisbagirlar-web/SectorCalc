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
  try { const v = input.avg_cover_price + input.food_cost_per_cover + input.labor_cost_per_cover; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.avg_cover_price + input.food_cost_per_cover + input.labor_cost_per_cover; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
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
