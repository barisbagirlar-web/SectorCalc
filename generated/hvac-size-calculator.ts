// Auto-generated from hvac-size-calculator-schema.json
import * as z from 'zod';

export interface Hvac_size_calculatorInput {
  room_area: number;
  ceiling_height: number;
  number_of_occupants: number;
  window_area: number;
  insulation_factor: number;
  outdoor_temperature: number;
  indoor_temperature: number;
  dataConfidence?: number;
}

export const Hvac_size_calculatorInputSchema = z.object({
  room_area: z.number().default(20),
  ceiling_height: z.number().default(2.5),
  number_of_occupants: z.number().default(2),
  window_area: z.number().default(5),
  insulation_factor: z.number().default(2),
  outdoor_temperature: z.number().default(35),
  indoor_temperature: z.number().default(24),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hvac_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.room_area * input.ceiling_height * (input.outdoor_temperature - input.indoor_temperature) * input.insulation_factor * 0.1 + input.window_area * (input.outdoor_temperature - input.indoor_temperature) * 5 + input.number_of_occupants * 75 + input.room_area * 10) / 1000; results["sensible_heat_gain_kw"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sensible_heat_gain_kw"] = Number.NaN; }
  try { const v = (input.number_of_occupants * 75) / 1000; results["latent_heat_gain_kw"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["latent_heat_gain_kw"] = Number.NaN; }
  try { const v = (input.room_area * input.ceiling_height * (input.outdoor_temperature - input.indoor_temperature) * input.insulation_factor * 0.1 + input.window_area * (input.outdoor_temperature - input.indoor_temperature) * 5 + input.number_of_occupants * 150 + input.room_area * 10) / 1000; results["required_cooling_capacity_kw"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["required_cooling_capacity_kw"] = Number.NaN; }
  return results;
}


export function calculateHvac_size_calculator(input: Hvac_size_calculatorInput): Hvac_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["required_cooling_capacity_kw"]);
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


export interface Hvac_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
