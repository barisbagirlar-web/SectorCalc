// Auto-generated from hip-roof-calculator-schema.json
import * as z from 'zod';

export interface Hip_roof_calculatorInput {
  building_length: number;
  building_width: number;
  roof_pitch: number;
  overhang: number;
  ridge_beam_width: number;
  dataConfidence?: number;
}

export const Hip_roof_calculatorInputSchema = z.object({
  building_length: z.number().default(10),
  building_width: z.number().default(8),
  roof_pitch: z.number().default(30),
  overhang: z.number().default(0.5),
  ridge_beam_width: z.number().default(0.15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hip_roof_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.building_length) * (input.building_width) * (input.roof_pitch) * (input.overhang) * (input.ridge_beam_width); results["roof_angle_rad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["roof_angle_rad"] = Number.NaN; }
  try { const v = (input.building_length) * (input.building_width) * (input.roof_pitch); results["roof_angle_rad_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["roof_angle_rad_aux"] = Number.NaN; }
  return results;
}


export function calculateHip_roof_calculator(input: Hip_roof_calculatorInput): Hip_roof_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["roof_angle_rad_aux"]);
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


export interface Hip_roof_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
