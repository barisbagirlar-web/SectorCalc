// Auto-generated from factory-layout-distance-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Factory_layout_distance_optimizer_calculatorInput {
  num_departments: number;
  flow_intensity_matrix: number;
  distance_matrix: number;
  path_efficiency_factor: number;
  layout_type: string;
  use_weighted_distance: boolean;
}

export const Factory_layout_distance_optimizer_calculatorInputSchema = z.object({
  num_departments: z.number().min(2).max(50).default(6),
  flow_intensity_matrix: z.number().min(0).max(10000),
  distance_matrix: z.number().min(0).max(1000),
  path_efficiency_factor: z.number().min(0.1).max(1).default(0.85),
  layout_type: z.enum(['process', 'product', 'cellular', 'fixed-position']).default('process'),
  use_weighted_distance: z.boolean().default(true),
});

function evaluateAllFormulas(input: Factory_layout_distance_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["raw_distance_sum"] = 0;
  results["flow_distance_product"] = 0;
  results["total_weighted_distance"] = 0;
  try { const v = (results["total_weighted_distance"] ?? 0) / input.path_efficiency_factor; results["adjusted_total_distance"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_total_distance"] = 0; }
  results["average_distance_per_trip"] = 0;
  try { const v = theoretical_min_distance / (results["adjusted_total_distance"] ?? 0); results["layout_efficiency_index"] = Number.isFinite(v) ? v : 0; } catch { results["layout_efficiency_index"] = 0; }
  try { const v = ((input.use_weighted_distance) ? ((results["adjusted_total_distance"] ?? 0)) : ((results["raw_distance_sum"] ?? 0))); results["primary_result"] = Number.isFinite(v) ? v : 0; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateFactory_layout_distance_optimizer_calculator(input: Factory_layout_distance_optimizer_calculatorInput): Factory_layout_distance_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_material_handling_distance"] ?? values["primary_result"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    type: values["type"] ?? 0,
    properties: values["properties"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Long-Haul Department Pairs","Inefficient Path Segments","High-Flow Low-Proximity Pairs"];
  const suggestedActions: string[] = ["Relocate High-Flow Pairs","Improve Aisle Design","Implement Cellular Manufacturing","Reduce Non-Value-Added Movement"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Heatmap generation"],
  };
}


export interface Factory_layout_distance_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; type: number; properties: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
