// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Beam_deflection_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.beam_length + input.load_type + input.point_load; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.beam_length + input.load_type + input.point_load; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBeam_deflection_calculator(input: Beam_deflection_calculatorInput): Beam_deflection_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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
