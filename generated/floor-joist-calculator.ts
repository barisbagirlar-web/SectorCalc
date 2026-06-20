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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Floor_joist_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dead_load_psf + input.live_load_psf) * input.spacing_in / 144; results["w"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["w"] = Number.NaN; }
  try { const v = input.span_ft * 12; results["span_in"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["span_in"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["span_in"])) / input.defl_limit_denom; results["allowable_deflection_in"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["allowable_deflection_in"] = Number.NaN; }
  return results;
}


export function calculateFloor_joist_calculator(input: Floor_joist_calculatorInput): Floor_joist_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["allowable_deflection_in"]);
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


export interface Floor_joist_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
