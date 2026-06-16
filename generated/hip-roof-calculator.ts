// Auto-generated from hip-roof-calculator-schema.json
import * as z from 'zod';

export interface Hip_roof_calculatorInput {
  building_length: number;
  building_width: number;
  roof_pitch: number;
  overhang: number;
  ridge_beam_width: number;
}

export const Hip_roof_calculatorInputSchema = z.object({
  building_length: z.number().default(10),
  building_width: z.number().default(8),
  roof_pitch: z.number().default(30),
  overhang: z.number().default(0.5),
  ridge_beam_width: z.number().default(0.15),
});

function evaluateAllFormulas(input: Hip_roof_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roof_pitch * Math.PI / 180; results["roof_angle_rad"] = Number.isFinite(v) ? v : 0; } catch { results["roof_angle_rad"] = 0; }
  try { const v = input.building_width / 2 * Math.tan((results["roof_angle_rad"] ?? 0)); results["rise"] = Number.isFinite(v) ? v : 0; } catch { results["rise"] = 0; }
  try { const v = Math.sqrt((input.building_width / 2 + input.overhang) ** 2 + ((results["rise"] ?? 0) + input.overhang * Math.tan((results["roof_angle_rad"] ?? 0))) ** 2); results["common_rafter_length"] = Number.isFinite(v) ? v : 0; } catch { results["common_rafter_length"] = 0; }
  try { const v = Math.sqrt((input.building_width / 2 + input.overhang) ** 2 + (input.building_length / 2 + input.overhang) ** 2 + ((results["rise"] ?? 0) + input.overhang * Math.tan((results["roof_angle_rad"] ?? 0))) ** 2); results["hip_rafter_length"] = Number.isFinite(v) ? v : 0; } catch { results["hip_rafter_length"] = 0; }
  try { const v = (results["common_rafter_length"] ?? 0) - input.ridge_beam_width / 2 * Math.tan((results["roof_angle_rad"] ?? 0)); results["jack_rafter_length"] = Number.isFinite(v) ? v : 0; } catch { results["jack_rafter_length"] = 0; }
  try { const v = 2 * (input.building_length + 2 * input.overhang) * (results["common_rafter_length"] ?? 0) + 2 * (input.building_width + 2 * input.overhang) * (results["common_rafter_length"] ?? 0); results["total_roof_area"] = Number.isFinite(v) ? v : 0; } catch { results["total_roof_area"] = 0; }
  try { const v = Math.ceil((input.building_length + 2 * input.overhang) / 0.6) + 1; results["number_of_common_rafters"] = Number.isFinite(v) ? v : 0; } catch { results["number_of_common_rafters"] = 0; }
  try { const v = 2 * (Math.ceil((input.building_length + 2 * input.overhang) / 0.6) - 1); results["number_of_jack_rafters"] = Number.isFinite(v) ? v : 0; } catch { results["number_of_jack_rafters"] = 0; }
  return results;
}


export function calculateHip_roof_calculator(input: Hip_roof_calculatorInput): Hip_roof_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Total"] ?? 0;
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


export interface Hip_roof_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
