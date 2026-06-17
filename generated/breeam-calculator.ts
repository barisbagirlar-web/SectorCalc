// Auto-generated from breeam-calculator-schema.json
import * as z from 'zod';

export interface Breeam_calculatorInput {
  energy_use: number;
  water_use: number;
  waste_generated: number;
  recycled_waste: number;
  co2_emissions: number;
  floor_area: number;
}

export const Breeam_calculatorInputSchema = z.object({
  energy_use: z.number().default(100000),
  water_use: z.number().default(5000),
  waste_generated: z.number().default(50),
  recycled_waste: z.number().default(20),
  co2_emissions: z.number().default(200),
  floor_area: z.number().default(10000),
});

function evaluateAllFormulas(input: Breeam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.energy_use / input.floor_area; results["energy_intensity"] = Number.isFinite(v) ? v : 0; } catch { results["energy_intensity"] = 0; }
  try { const v = input.water_use / input.floor_area; results["water_intensity"] = Number.isFinite(v) ? v : 0; } catch { results["water_intensity"] = 0; }
  try { const v = (input.recycled_waste / input.waste_generated) * 100; results["waste_recycling_rate"] = Number.isFinite(v) ? v : 0; } catch { results["waste_recycling_rate"] = 0; }
  try { const v = input.co2_emissions / input.floor_area; results["carbon_intensity"] = Number.isFinite(v) ? v : 0; } catch { results["carbon_intensity"] = 0; }
  try { const v = Math.min(100, ((results["energy_intensity"] ?? 0) * 0.3 + (results["water_intensity"] ?? 0) * 0.2 + (100 - (results["waste_recycling_rate"] ?? 0)) * 0.2 + (results["carbon_intensity"] ?? 0) * 0.3) / 10); results["breeam_score"] = Number.isFinite(v) ? v : 0; } catch { results["breeam_score"] = 0; }
  results["Energy_Intensity__kWh_m__"] = 0;
  results["Water_Intensity__m__m__"] = 0;
  results["Waste_Recycling_Rate____"] = 0;
  results["Carbon_Intensity__tonnes_m__"] = 0;
  return results;
}


export function calculateBreeam_calculator(input: Breeam_calculatorInput): Breeam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["energy_intensity"] ?? 0;
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


export interface Breeam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
