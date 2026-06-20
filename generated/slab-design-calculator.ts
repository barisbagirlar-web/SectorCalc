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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Slab_design_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.thickness * 25 / 1000; results["self_weight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["self_weight"] = Number.NaN; }
  try { const v = input.dead_load + (toNumericFormulaValue(results["self_weight"])); results["total_dead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_dead"] = Number.NaN; }
  try { const v = 1.35 * (toNumericFormulaValue(results["total_dead"])) + 1.5 * input.live_load; results["factored_load"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factored_load"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["factored_load"])) * input.span * input.span / 8; results["factored_moment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factored_moment"] = Number.NaN; }
  try { const v = input.thickness - input.cover - 5; results["d"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["factored_moment"])) * 1e6 / (1000 * (toNumericFormulaValue(results["d"])) * (toNumericFormulaValue(results["d"])) * input.concrete_strength); results["K"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["K"] = Number.NaN; }
  return results;
}


export function calculateSlab_design_calculator(input: Slab_design_calculatorInput): Slab_design_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["K"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
