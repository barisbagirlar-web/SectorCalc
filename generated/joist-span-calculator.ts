// Auto-generated from joist-span-calculator-schema.json
import * as z from 'zod';

export interface Joist_span_calculatorInput {
  joist_width: number;
  joist_depth: number;
  spacing: number;
  live_load: number;
  dead_load: number;
  fb: number;
}

export const Joist_span_calculatorInputSchema = z.object({
  joist_width: z.number().default(1.5),
  joist_depth: z.number().default(9.25),
  spacing: z.number().default(16),
  live_load: z.number().default(40),
  dead_load: z.number().default(10),
  fb: z.number().default(1000),
});

function evaluateAllFormulas(input: Joist_span_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.live_load + input.dead_load) * input.spacing / 12; results["total_load_plf"] = Number.isFinite(v) ? v : 0; } catch { results["total_load_plf"] = 0; }
  try { const v = (input.joist_width * input.joist_depth ** 2) / 6; results["section_modulus"] = Number.isFinite(v) ? v : 0; } catch { results["section_modulus"] = 0; }
  try { const v = input.fb * (results["section_modulus"] ?? 0); results["max_bending_moment_lb_in"] = Number.isFinite(v) ? v : 0; } catch { results["max_bending_moment_lb_in"] = 0; }
  try { const v = (results["total_load_plf"] ?? 0) / 12; results["w_pli"] = Number.isFinite(v) ? v : 0; } catch { results["w_pli"] = 0; }
  try { const v = Math.sqrt(8 * (results["max_bending_moment_lb_in"] ?? 0) / (results["w_pli"] ?? 0)); results["max_span_in"] = Number.isFinite(v) ? v : 0; } catch { results["max_span_in"] = 0; }
  try { const v = (results["max_span_in"] ?? 0) / 12; results["max_span_ft"] = Number.isFinite(v) ? v : 0; } catch { results["max_span_ft"] = 0; }
  try { const v = Math.floor((results["max_span_ft"] ?? 0)) + ' ft ' + ((results["max_span_in"] ?? 0) % 12).toFixed(1) + ' in'; results["max_span_display"] = Number.isFinite(v) ? v : 0; } catch { results["max_span_display"] = 0; }
  return results;
}


export function calculateJoist_span_calculator(input: Joist_span_calculatorInput): Joist_span_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["max_span_display"] ?? 0;
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


export interface Joist_span_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
