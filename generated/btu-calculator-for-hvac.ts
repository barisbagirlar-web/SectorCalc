// Auto-generated from btu-calculator-for-hvac-schema.json
import * as z from 'zod';

export interface Btu_calculator_for_hvacInput {
  room_length: number;
  room_width: number;
  ceiling_height: number;
  insulation_factor: number;
  sun_exposure: number;
  num_occupants: number;
  num_windows: number;
}

export const Btu_calculator_for_hvacInputSchema = z.object({
  room_length: z.number().default(10),
  room_width: z.number().default(10),
  ceiling_height: z.number().default(8),
  insulation_factor: z.number().default(1),
  sun_exposure: z.number().default(0),
  num_occupants: z.number().default(2),
  num_windows: z.number().default(1),
});

function evaluateAllFormulas(input: Btu_calculator_for_hvacInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.room_length * input.room_width * input.ceiling_height; results["volume"] = Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = (results["volume"] ?? 0) * 3.5; results["base_btu"] = Number.isFinite(v) ? v : 0; } catch { results["base_btu"] = 0; }
  try { const v = (results["base_btu"] ?? 0) * input.insulation_factor; results["insulation_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["insulation_adjustment"] = 0; }
  try { const v = input.sun_exposure * input.room_length * input.room_width; results["sun_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["sun_adjustment"] = 0; }
  try { const v = input.num_occupants * 400; results["occupant_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["occupant_adjustment"] = 0; }
  try { const v = input.num_windows * 1000; results["window_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["window_adjustment"] = 0; }
  try { const v = (results["insulation_adjustment"] ?? 0) + (results["sun_adjustment"] ?? 0) + (results["occupant_adjustment"] ?? 0) + (results["window_adjustment"] ?? 0); results["total_btu"] = Number.isFinite(v) ? v : 0; } catch { results["total_btu"] = 0; }
  return results;
}


export function calculateBtu_calculator_for_hvac(input: Btu_calculator_for_hvacInput): Btu_calculator_for_hvacOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_btu"] ?? 0;
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


export interface Btu_calculator_for_hvacOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
