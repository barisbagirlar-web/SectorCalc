// Auto-generated from depth-of-field-calculator-schema.json
import * as z from 'zod';

export interface Depth_of_field_calculatorInput {
  focalLength: number;
  aperture: number;
  subjectDistance: number;
  circleOfConfusion: number;
  dataConfidence?: number;
}

export const Depth_of_field_calculatorInputSchema = z.object({
  focalLength: z.number().default(50),
  aperture: z.number().default(8),
  subjectDistance: z.number().default(10),
  circleOfConfusion: z.number().default(0.03),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Depth_of_field_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.focalLength * input.focalLength) / (input.aperture * input.circleOfConfusion) / 1000; results["hyperfocalDistance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hyperfocalDistance"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["hyperfocalDistance"])) * input.subjectDistance) / ((toNumericFormulaValue(results["hyperfocalDistance"])) + input.subjectDistance); results["nearFocusLimit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nearFocusLimit"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["hyperfocalDistance"])) * input.subjectDistance) / ((toNumericFormulaValue(results["hyperfocalDistance"])) - input.subjectDistance); results["farFocusLimit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["farFocusLimit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["farFocusLimit"])) - (toNumericFormulaValue(results["nearFocusLimit"])); results["totalDoF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDoF"] = Number.NaN; }
  return results;
}


export function calculateDepth_of_field_calculator(input: Depth_of_field_calculatorInput): Depth_of_field_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDoF"]);
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


export interface Depth_of_field_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
