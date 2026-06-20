// Auto-generated from beam-deflection-calculator-schema.json
import * as z from 'zod';

export interface Beam_deflection_calculatorInput {
  beam_length: number;
  load_type: string;
  point_load: number;
  udl_load: number;
  load_position: number;
  young_modulus: number;
  moment_of_inertia: number;
  yield_strength: number;
  dataConfidence?: number;
}

export const Beam_deflection_calculatorInputSchema = z.object({
  beam_length: z.number().min(0.1).max(50).default(3),
  load_type: z.enum(['point_center', 'point_any', 'uniform', 'triangular']).default('point_center'),
  point_load: z.number().min(0).max(500).default(10),
  udl_load: z.number().min(0).max(100).default(5),
  load_position: z.number().min(0).max(50).default(1.5),
  young_modulus: z.number().min(10).max(400).default(200),
  moment_of_inertia: z.number().min(1).max(100000).default(500),
  yield_strength: z.number().min(50).max(1000).default(250),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Beam_deflection_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.beam_length * input.point_load * input.udl_load * input.load_position; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.beam_length * input.point_load * input.udl_load * input.load_position * (input.young_modulus * input.moment_of_inertia * input.yield_strength); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.young_modulus * input.moment_of_inertia * input.yield_strength; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateBeam_deflection_calculator(input: Beam_deflection_calculatorInput): Beam_deflection_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-beam comparison","Custom material database"],
  };
}


export interface Beam_deflection_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
