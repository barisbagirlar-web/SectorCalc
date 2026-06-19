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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Btu_calculator_for_hvacInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.room_length * input.room_width * input.ceiling_height; results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = (asFormulaNumber(results["volume"])) * 3.5; results["base_btu"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_btu"] = 0; }
  try { const v = (asFormulaNumber(results["base_btu"])) * input.insulation_factor; results["insulation_adjustment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["insulation_adjustment"] = 0; }
  try { const v = input.sun_exposure * input.room_length * input.room_width; results["sun_adjustment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sun_adjustment"] = 0; }
  try { const v = input.num_occupants * 400; results["occupant_adjustment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["occupant_adjustment"] = 0; }
  try { const v = input.num_windows * 1000; results["window_adjustment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["window_adjustment"] = 0; }
  try { const v = (asFormulaNumber(results["insulation_adjustment"])) + (asFormulaNumber(results["sun_adjustment"])) + (asFormulaNumber(results["occupant_adjustment"])) + (asFormulaNumber(results["window_adjustment"])); results["total_btu"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_btu"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBtu_calculator_for_hvac(input: Btu_calculator_for_hvacInput): Btu_calculator_for_hvacOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["total_btu"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
