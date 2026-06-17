// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Slab_design_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.thickness * 25 / 1000; results["self_weight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["self_weight"] = 0; }
  try { const v = input.dead_load + (asFormulaNumber(results["self_weight"])); results["total_dead"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_dead"] = 0; }
  try { const v = 1.35 * (asFormulaNumber(results["total_dead"])) + 1.5 * input.live_load; results["factored_load"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["factored_load"] = 0; }
  try { const v = (asFormulaNumber(results["factored_load"])) * input.span * input.span / 8; results["factored_moment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["factored_moment"] = 0; }
  try { const v = input.thickness - input.cover - 5; results["d"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["d"] = 0; }
  try { const v = (asFormulaNumber(results["factored_moment"])) * 1e6 / (1000 * (asFormulaNumber(results["d"])) * (asFormulaNumber(results["d"])) * input.concrete_strength); results["K"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["K"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSlab_design_calculator(input: Slab_design_calculatorInput): Slab_design_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["K"]);
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
