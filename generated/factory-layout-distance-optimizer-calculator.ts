// Auto-generated from factory-layout-distance-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Factory_layout_distance_optimizer_calculatorInput {
  num_departments: number;
  flow_intensity_matrix: number;
  distance_matrix: number;
  path_efficiency_factor: number;
  layout_type: string;
  use_weighted_distance: boolean;
  dataConfidence?: number;
}

export const Factory_layout_distance_optimizer_calculatorInputSchema = z.object({
  num_departments: z.number().min(2).max(50).default(6),
  flow_intensity_matrix: z.number().min(0).max(10000),
  distance_matrix: z.number().min(0).max(1000),
  path_efficiency_factor: z.number().min(0.1).max(1).default(0.85),
  layout_type: z.enum(['process', 'product', 'cellular', 'fixed-position']).default('process'),
  use_weighted_distance: z.boolean().default(true),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Factory_layout_distance_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.num_departments * input.flow_intensity_matrix * input.distance_matrix * (input.path_efficiency_factor / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.num_departments * input.flow_intensity_matrix * input.distance_matrix * (input.path_efficiency_factor / 100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFactory_layout_distance_optimizer_calculator(input: Factory_layout_distance_optimizer_calculatorInput): Factory_layout_distance_optimizer_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Heatmap generation"],
  };
}


export interface Factory_layout_distance_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
