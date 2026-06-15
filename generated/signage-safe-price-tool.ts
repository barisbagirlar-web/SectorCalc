// Auto-generated from signage-safe-price-tool-schema.json
import * as z from 'zod';

export interface Signage_safe_price_toolInput {
  material_cost: number;
  labor_hours: number;
  labor_rate: number;
  overhead_rate: number;
  complexity_factor: string;
  quality_level: string;
  quantity: number;
  waste_factor: number;
  risk_margin: number;
  shipping_cost_per_unit: number;
}

export const Signage_safe_price_toolInputSchema = z.object({
  material_cost: z.number().min(0).max(100000).default(100),
  labor_hours: z.number().min(0.1).max(100).default(2.5),
  labor_rate: z.number().min(0).max(200).default(35),
  overhead_rate: z.number().min(0).max(100).default(25),
  complexity_factor: z.enum(['low', 'medium', 'high']).default('medium'),
  quality_level: z.enum(['economy', 'standard', 'premium']).default('standard'),
  quantity: z.number().min(1).max(100000).default(100),
  waste_factor: z.number().min(0).max(50).default(5),
  risk_margin: z.number().min(0).max(50).default(10),
  shipping_cost_per_unit: z.number().min(0).max(500).default(5),
});

function evaluateAllFormulas(input: Signage_safe_price_toolInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["direct_material_cost"] = input.material_cost * (1 + input.waste_factor / 100) * (1 + (input.complexity_factor == 'high' ? 0.15 : input.complexity_factor == 'medium' ? 0.05 : 0)); } catch { results["direct_material_cost"] = 0; }
  try { results["direct_labor_cost"] = input.labor_hours * input.labor_rate * (1 + (input.complexity_factor == 'high' ? 0.20 : input.complexity_factor == 'medium' ? 0.10 : 0)) * (1 + (input.quality_level == 'premium' ? 0.15 : input.quality_level == 'standard' ? 0.05 : 0)); } catch { results["direct_labor_cost"] = 0; }
  try { results["overhead_cost"] = ((results["direct_material_cost"] ?? 0) + (results["direct_labor_cost"] ?? 0)) * (input.overhead_rate / 100); } catch { results["overhead_cost"] = 0; }
  try { results["total_cost_per_unit"] = (results["direct_material_cost"] ?? 0) + (results["direct_labor_cost"] ?? 0) + (results["overhead_cost"] ?? 0) + input.shipping_cost_per_unit; } catch { results["total_cost_per_unit"] = 0; }
  try { results["volume_discount_factor"] = input.quantity >= 1000 ? 0.92 : input.quantity >= 500 ? 0.95 : input.quantity >= 100 ? 0.98 : 1.0; } catch { results["volume_discount_factor"] = 0; }
  try { results["safe_price_before_risk"] = (results["total_cost_per_unit"] ?? 0) * (results["volume_discount_factor"] ?? 0); } catch { results["safe_price_before_risk"] = 0; }
  try { results["safe_price"] = (results["safe_price_before_risk"] ?? 0) * (1 + input.risk_margin / 100); } catch { results["safe_price"] = 0; }
  return results;
}


export function calculateSignage_safe_price_tool(input: Signage_safe_price_toolInput): Signage_safe_price_toolOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["safe_price"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    type: values["type"] ?? 0,
    properties: values["properties"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive Waste","Quality Rework Cost","Complexity Premium","Underutilized Volume Discount"];
  const suggestedActions: string[] = ["Implement Waste Reduction Program","Negotiate Bulk Material Pricing","Standardize Signage Design","Match Quality Level to Customer Needs"];
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


export interface Signage_safe_price_toolOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; type: number; properties: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
