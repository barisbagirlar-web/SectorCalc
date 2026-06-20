// Auto-generated from joist-span-calculator-schema.json
import * as z from 'zod';

export interface Joist_span_calculatorInput {
  joist_width: number;
  joist_depth: number;
  spacing: number;
  live_load: number;
  dead_load: number;
  fb: number;
  dataConfidence?: number;
}

export const Joist_span_calculatorInputSchema = z.object({
  joist_width: z.number().default(1.5),
  joist_depth: z.number().default(9.25),
  spacing: z.number().default(16),
  live_load: z.number().default(40),
  dead_load: z.number().default(10),
  fb: z.number().default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Joist_span_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.live_load + input.dead_load) * input.spacing / 12; results["total_load_plf"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_load_plf"] = Number.NaN; }
  try { const v = (input.joist_width * input.joist_depth ** 2) / 6; results["section_modulus"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["section_modulus"] = Number.NaN; }
  try { const v = input.fb * (toNumericFormulaValue(results["section_modulus"])); results["max_bending_moment_lb_in"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["max_bending_moment_lb_in"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_load_plf"])) / 12; results["w_pli"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["w_pli"] = Number.NaN; }
  return results;
}


export function calculateJoist_span_calculator(input: Joist_span_calculatorInput): Joist_span_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["w_pli"]);
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


export interface Joist_span_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
