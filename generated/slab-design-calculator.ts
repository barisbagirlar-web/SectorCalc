// Auto-generated from slab-design-calculator-schema.json
import * as z from 'zod';

export interface Slab_design_calculatorInput {
  span: number;
  live_load: number;
  dead_load: number;
  thickness: number;
  concrete_strength: number;
  steel_yield: number;
  cover: number;
}

export const Slab_design_calculatorInputSchema = z.object({
  span: z.number().default(4),
  live_load: z.number().default(3),
  dead_load: z.number().default(1.5),
  thickness: z.number().default(150),
  concrete_strength: z.number().default(25),
  steel_yield: z.number().default(500),
  cover: z.number().default(25),
});

function evaluateAllFormulas(input: Slab_design_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.thickness * 25 / 1000; results["self_weight"] = Number.isFinite(v) ? v : 0; } catch { results["self_weight"] = 0; }
  try { const v = input.dead_load + (results["self_weight"] ?? 0); results["total_dead"] = Number.isFinite(v) ? v : 0; } catch { results["total_dead"] = 0; }
  try { const v = 1.35 * (results["total_dead"] ?? 0) + 1.5 * input.live_load; results["factored_load"] = Number.isFinite(v) ? v : 0; } catch { results["factored_load"] = 0; }
  try { const v = (results["factored_load"] ?? 0) * input.span * input.span / 8; results["factored_moment"] = Number.isFinite(v) ? v : 0; } catch { results["factored_moment"] = 0; }
  try { const v = input.thickness - input.cover - 5; results["d"] = Number.isFinite(v) ? v : 0; } catch { results["d"] = 0; }
  try { const v = (results["factored_moment"] ?? 0) * 1e6 / (1000 * (results["d"] ?? 0) * (results["d"] ?? 0) * input.concrete_strength); results["K"] = Number.isFinite(v) ? v : 0; } catch { results["K"] = 0; }
  try { const v = (results["d"] ?? 0) * Math.min(0.95, 0.5 + Math.sqrt(0.25 - (results["K"] ?? 0) / 1.134)); results["lever_arm"] = Number.isFinite(v) ? v : 0; } catch { results["lever_arm"] = 0; }
  try { const v = ((results["factored_moment"] ?? 0) * 1e6) / (0.87 * input.steel_yield * (results["lever_arm"] ?? 0)); results["required_area"] = Number.isFinite(v) ? v : 0; } catch { results["required_area"] = 0; }
  try { const v = (results["required_area"] ?? 0) / (1000 * (results["d"] ?? 0)); results["steel_ratio"] = Number.isFinite(v) ? v : 0; } catch { results["steel_ratio"] = 0; }
  return results;
}


export function calculateSlab_design_calculator(input: Slab_design_calculatorInput): Slab_design_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["required_area"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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


export interface Slab_design_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
