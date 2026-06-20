// Auto-generated from field-of-view-calculator-schema.json
import * as z from 'zod';

export interface Field_of_view_calculatorInput {
  sensorWidth: number;
  sensorHeight: number;
  focalLength: number;
  distance: number;
  dataConfidence?: number;
}

export const Field_of_view_calculatorInputSchema = z.object({
  sensorWidth: z.number().default(6.4),
  sensorHeight: z.number().default(4.8),
  focalLength: z.number().default(4),
  distance: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Field_of_view_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sensorWidth * input.distance) / input.focalLength; results["horizontal_linear_fov"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["horizontal_linear_fov"] = Number.NaN; }
  try { const v = (input.sensorHeight * input.distance) / input.focalLength; results["vertical_linear_fov"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vertical_linear_fov"] = Number.NaN; }
  return results;
}


export function calculateField_of_view_calculator(input: Field_of_view_calculatorInput): Field_of_view_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["horizontal_linear_fov"]);
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


export interface Field_of_view_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
