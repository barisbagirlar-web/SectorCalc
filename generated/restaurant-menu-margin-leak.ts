// Auto-generated from restaurant-menu-margin-leak-schema.json
import * as z from 'zod';

export interface Restaurant_menu_margin_leakInput {
  avg_cover_price: number;
  food_cost_per_cover: number;
  labor_cost_per_cover: number;
  overhead_per_cover: number;
  waste_percentage: number;
  theft_shrinkage_percentage: number;
  discount_comp_percentage: number;
  covers_per_period: number;
  menu_engineering_score: number;
  lean_kitchen_maturity: string;
}

export const Restaurant_menu_margin_leakInputSchema = z.object({
  avg_cover_price: z.number().min(0).max(500).default(18.5),
  food_cost_per_cover: z.number().min(0).max(200).default(6.5),
  labor_cost_per_cover: z.number().min(0).max(100).default(4.2),
  overhead_per_cover: z.number().min(0).max(100).default(2.8),
  waste_percentage: z.number().min(0).max(50).default(5),
  theft_shrinkage_percentage: z.number().min(0).max(20).default(1.5),
  discount_comp_percentage: z.number().min(0).max(30).default(3),
  covers_per_period: z.number().min(0).max(100000).default(3000),
  menu_engineering_score: z.number().min(1).max(10).default(6),
  lean_kitchen_maturity: z.enum(['Initial', 'Developing', 'Standardized', 'Optimized', 'World-Class']).default('Developing'),
});

function evaluateAllFormulas(input: Restaurant_menu_margin_leakInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.avg_cover_price - input.food_cost_per_cover; results["gross_margin_per_cover"] = Number.isFinite(v) ? v : 0; } catch { results["gross_margin_per_cover"] = 0; }
  try { const v = (results["gross_margin_per_cover"] ?? 0) - input.labor_cost_per_cover - input.overhead_per_cover; results["contribution_margin_per_cover"] = Number.isFinite(v) ? v : 0; } catch { results["contribution_margin_per_cover"] = 0; }
  try { const v = input.food_cost_per_cover * (input.waste_percentage / 100); results["waste_leak_per_cover"] = Number.isFinite(v) ? v : 0; } catch { results["waste_leak_per_cover"] = 0; }
  try { const v = input.food_cost_per_cover * (input.theft_shrinkage_percentage / 100); results["theft_leak_per_cover"] = Number.isFinite(v) ? v : 0; } catch { results["theft_leak_per_cover"] = 0; }
  try { const v = input.avg_cover_price * (input.discount_comp_percentage / 100); results["discount_leak_per_cover"] = Number.isFinite(v) ? v : 0; } catch { results["discount_leak_per_cover"] = 0; }
  try { const v = (results["waste_leak_per_cover"] ?? 0) + (results["theft_leak_per_cover"] ?? 0) + (results["discount_leak_per_cover"] ?? 0); results["total_leak_per_cover"] = Number.isFinite(v) ? v : 0; } catch { results["total_leak_per_cover"] = 0; }
  try { const v = (results["contribution_margin_per_cover"] ?? 0) - (results["total_leak_per_cover"] ?? 0); results["net_margin_per_cover"] = Number.isFinite(v) ? v : 0; } catch { results["net_margin_per_cover"] = 0; }
  return results;
}


export function calculateRestaurant_menu_margin_leak(input: Restaurant_menu_margin_leakInput): Restaurant_menu_margin_leakOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["net_margin_percentage"] ?? 0;
  const breakdown = {
    gross_margin_per_cover: values["gross_margin_per_cover"] ?? 0,
    contribution_margin_per_cover: values["contribution_margin_per_cover"] ?? 0,
    waste_leak_per_cover: values["waste_leak_per_cover"] ?? 0,
    theft_leak_per_cover: values["theft_leak_per_cover"] ?? 0,
    discount_leak_per_cover: values["discount_leak_per_cover"] ?? 0,
    total_leak_per_cover: values["total_leak_per_cover"] ?? 0,
    net_margin_per_cover: values["net_margin_per_cover"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Food Waste","Theft & Shrinkage","Discounts & Comps"];
  const suggestedActions: string[] = ["Implement Lean Kitchen Practices","Strengthen Inventory Control","Menu Re-engineering","Enforce Portion Control"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-location benchmarking","Ingredient cost roll-up"],
  };
}


export interface Restaurant_menu_margin_leakOutput {
  totalWasteCost: number;
  breakdown: { gross_margin_per_cover: number; contribution_margin_per_cover: number; waste_leak_per_cover: number; theft_leak_per_cover: number; discount_leak_per_cover: number; total_leak_per_cover: number; net_margin_per_cover: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
