// Auto-generated from ridge-beam-calculator-schema.json
import * as z from 'zod';

export interface Ridge_beam_calculatorInput {
  span: number;
  load_per_meter: number;
  fb: number;
  beam_width: number;
  beam_depth: number;
  safety_factor: number;
  dataConfidence?: number;
}

export const Ridge_beam_calculatorInputSchema = z.object({
  span: z.number().default(4),
  load_per_meter: z.number().default(5),
  fb: z.number().default(10),
  beam_width: z.number().default(100),
  beam_depth: z.number().default(200),
  safety_factor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ridge_beam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.load_per_meter * input.span ** 2) / 8; results["max_bending_moment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["max_bending_moment"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["max_bending_moment"])) * 1e6) / input.fb; results["section_modulus_required"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["section_modulus_required"] = Number.NaN; }
  try { const v = (input.beam_width * input.beam_depth ** 2) / 6; results["actual_section_modulus"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actual_section_modulus"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["section_modulus_required"])) / (toNumericFormulaValue(results["actual_section_modulus"]))) * input.safety_factor; results["utilization_ratio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["utilization_ratio"] = Number.NaN; }
  return results;
}


export function calculateRidge_beam_calculator(input: Ridge_beam_calculatorInput): Ridge_beam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["utilization_ratio"]);
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


export interface Ridge_beam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
