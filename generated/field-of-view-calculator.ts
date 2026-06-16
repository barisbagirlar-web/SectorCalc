// Auto-generated from field-of-view-calculator-schema.json
import * as z from 'zod';

export interface Field_of_view_calculatorInput {
  sensorWidth: number;
  sensorHeight: number;
  focalLength: number;
  distance: number;
}

export const Field_of_view_calculatorInputSchema = z.object({
  sensorWidth: z.number().default(6.4),
  sensorHeight: z.number().default(4.8),
  focalLength: z.number().default(4),
  distance: z.number().default(1),
});

function evaluateAllFormulas(input: Field_of_view_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sensorWidth * input.distance) / input.focalLength; results["horizontal_linear_fov"] = Number.isFinite(v) ? v : 0; } catch { results["horizontal_linear_fov"] = 0; }
  try { const v = (input.sensorHeight * input.distance) / input.focalLength; results["vertical_linear_fov"] = Number.isFinite(v) ? v : 0; } catch { results["vertical_linear_fov"] = 0; }
  try { const v = (input.distance / input.focalLength) * Math.sqrt(input.sensorWidth**2 + input.sensorHeight**2); results["diagonal_linear_fov"] = Number.isFinite(v) ? v : 0; } catch { results["diagonal_linear_fov"] = 0; }
  return results;
}


export function calculateField_of_view_calculator(input: Field_of_view_calculatorInput): Field_of_view_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["horizontal_linear_fov"] ?? 0;
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


export interface Field_of_view_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
