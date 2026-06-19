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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Joist_span_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.live_load + input.dead_load) * input.spacing / 12; results["total_load_plf"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_load_plf"] = 0; }
  try { const v = (input.joist_width * input.joist_depth ** 2) / 6; results["section_modulus"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["section_modulus"] = 0; }
  try { const v = input.fb * (asFormulaNumber(results["section_modulus"])); results["max_bending_moment_lb_in"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["max_bending_moment_lb_in"] = 0; }
  try { const v = (asFormulaNumber(results["total_load_plf"])) / 12; results["w_pli"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["w_pli"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateJoist_span_calculator(input: Joist_span_calculatorInput): Joist_span_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["w_pli"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
