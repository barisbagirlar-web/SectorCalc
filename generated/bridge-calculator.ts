// Auto-generated from bridge-calculator-schema.json
import * as z from 'zod';

export interface Bridge_calculatorInput {
  span_length: number;
  deck_width: number;
  load_per_area: number;
  steel_yield_strength: number;
  safety_factor: number;
  beam_depth: number;
  dataConfidence?: number;
}

export const Bridge_calculatorInputSchema = z.object({
  span_length: z.number().default(20),
  deck_width: z.number().default(10),
  load_per_area: z.number().default(5),
  steel_yield_strength: z.number().default(250),
  safety_factor: z.number().default(1.5),
  beam_depth: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bridge_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.load_per_area * input.deck_width * input.span_length; results["total_load"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_load"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_load"])) * input.span_length / 8; results["max_moment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["max_moment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["max_moment"])) * 1000 / (input.steel_yield_strength / input.safety_factor); results["section_modulus_required"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["section_modulus_required"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["section_modulus_required"])) * 6 / (input.beam_depth ** 2) / 1000; results["beam_width_estimate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["beam_width_estimate"] = Number.NaN; }
  return results;
}


export function calculateBridge_calculator(input: Bridge_calculatorInput): Bridge_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["beam_width_estimate"]);
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


export interface Bridge_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
