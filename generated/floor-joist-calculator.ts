// Auto-generated from floor-joist-calculator-schema.json
import * as z from 'zod';

export interface Floor_joist_calculatorInput {
  span_ft: number;
  spacing_in: number;
  dead_load_psf: number;
  live_load_psf: number;
  E_psi: number;
  I_in4: number;
  defl_limit_denom: number;
}

export const Floor_joist_calculatorInputSchema = z.object({
  span_ft: z.number().default(12),
  spacing_in: z.number().default(16),
  dead_load_psf: z.number().default(10),
  live_load_psf: z.number().default(40),
  E_psi: z.number().default(1600000),
  I_in4: z.number().default(98),
  defl_limit_denom: z.number().default(360),
});

function evaluateAllFormulas(input: Floor_joist_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dead_load_psf + input.live_load_psf) * input.spacing_in / 144; results["w"] = Number.isFinite(v) ? v : 0; } catch { results["w"] = 0; }
  try { const v = input.span_ft * 12; results["span_in"] = Number.isFinite(v) ? v : 0; } catch { results["span_in"] = 0; }
  try { const v = (5 * (results["w"] ?? 0) * Math.pow((results["span_in"] ?? 0), 4)) / (384 * input.E_psi * input.I_in4); results["actual_deflection_in"] = Number.isFinite(v) ? v : 0; } catch { results["actual_deflection_in"] = 0; }
  try { const v = (results["span_in"] ?? 0) / input.defl_limit_denom; results["allowable_deflection_in"] = Number.isFinite(v) ? v : 0; } catch { results["allowable_deflection_in"] = 0; }
  try { const v = (results["actual_deflection_in"] ?? 0) / (results["allowable_deflection_in"] ?? 0); results["deflection_ratio"] = Number.isFinite(v) ? v : 0; } catch { results["deflection_ratio"] = 0; }
  try { const v = Math.cbrt((384 * input.E_psi * input.I_in4) / (5 * (results["w"] ?? 0) * input.defl_limit_denom)); results["max_span_in"] = Number.isFinite(v) ? v : 0; } catch { results["max_span_in"] = 0; }
  try { const v = (results["max_span_in"] ?? 0) / 12; results["max_span_ft"] = Number.isFinite(v) ? v : 0; } catch { results["max_span_ft"] = 0; }
  try { const v = 'Actual Deflection: ' + (results["actual_deflection_in"] ?? 0).toFixed(2) + ' in'; results["actual_deflection_str"] = Number.isFinite(v) ? v : 0; } catch { results["actual_deflection_str"] = 0; }
  try { const v = 'Allowable Deflection: ' + (results["allowable_deflection_in"] ?? 0).toFixed(2) + ' in'; results["allowable_deflection_str"] = Number.isFinite(v) ? v : 0; } catch { results["allowable_deflection_str"] = 0; }
  try { const v = 'Max Span: ' + (results["max_span_ft"] ?? 0).toFixed(2) + ' ft'; results["max_span_str"] = Number.isFinite(v) ? v : 0; } catch { results["max_span_str"] = 0; }
  return results;
}


export function calculateFloor_joist_calculator(input: Floor_joist_calculatorInput): Floor_joist_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["deflection_ratio"] ?? 0;
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


export interface Floor_joist_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
