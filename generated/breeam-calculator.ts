// Auto-generated from breeam-calculator-schema.json
import * as z from 'zod';

export interface Breeam_calculatorInput {
  energy_use: number;
  water_use: number;
  waste_generated: number;
  recycled_waste: number;
  co2_emissions: number;
  floor_area: number;
  dataConfidence?: number;
}

export const Breeam_calculatorInputSchema = z.object({
  energy_use: z.number().default(100000),
  water_use: z.number().default(5000),
  waste_generated: z.number().default(50),
  recycled_waste: z.number().default(20),
  co2_emissions: z.number().default(200),
  floor_area: z.number().default(10000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Breeam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.energy_use / input.floor_area; results["energy_intensity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["energy_intensity"] = 0; }
  try { const v = input.water_use / input.floor_area; results["water_intensity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["water_intensity"] = 0; }
  try { const v = (input.recycled_waste / input.waste_generated) * 100; results["waste_recycling_rate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["waste_recycling_rate"] = 0; }
  try { const v = input.co2_emissions / input.floor_area; results["carbon_intensity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["carbon_intensity"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBreeam_calculator(input: Breeam_calculatorInput): Breeam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["energy_intensity"]));
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


export interface Breeam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
