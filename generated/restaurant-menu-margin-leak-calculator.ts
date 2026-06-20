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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Restaurant_menu_margin_leak_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.covers_per_period * input.avg_cover_price; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.covers_per_period * input.avg_cover_price * (1 + (input.waste_percentage / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.covers_per_period * input.avg_cover_price * (1 + (input.waste_percentage / 100)) * (input.food_cost_per_cover); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.food_cost_per_cover; results["factor_food_cost_per_cover"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_food_cost_per_cover"] = Number.NaN; }
  return results;
}


export function calculateRestaurant_menu_margin_leak_calculator(input: Restaurant_menu_margin_leak_calculatorInput): Restaurant_menu_margin_leak_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
