// Auto-generated from generator-calculator-schema.json
import * as z from 'zod';

export interface Generator_calculatorInput {
  powerRating: number;
  loadFactor: number;
  operatingHours: number;
  fuelConsumptionRate: number;
  fuelDensity: number;
  generatorEfficiency: number;
}

export const Generator_calculatorInputSchema = z.object({
  powerRating: z.number().default(100),
  loadFactor: z.number().default(75),
  operatingHours: z.number().default(8),
  fuelConsumptionRate: z.number().default(0.3),
  fuelDensity: z.number().default(0.85),
  generatorEfficiency: z.number().default(95),
});

function evaluateAllFormulas(input: Generator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerRating * (input.loadFactor / 100) * (input.generatorEfficiency / 100); results["actualPower"] = Number.isFinite(v) ? v : 0; } catch { results["actualPower"] = 0; }
  try { const v = (results["actualPower"] ?? 0) * input.operatingHours; results["dailyEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["dailyEnergy"] = 0; }
  try { const v = (results["dailyEnergy"] ?? 0) * input.fuelConsumptionRate; results["fuelVolume"] = Number.isFinite(v) ? v : 0; } catch { results["fuelVolume"] = 0; }
  try { const v = (results["fuelVolume"] ?? 0) * input.fuelDensity; results["fuelMass"] = Number.isFinite(v) ? v : 0; } catch { results["fuelMass"] = 0; }
  try { const v = (results["fuelMass"] ?? 0) * 3.15; results["co2Emissions"] = Number.isFinite(v) ? v : 0; } catch { results["co2Emissions"] = 0; }
  return results;
}


export function calculateGenerator_calculator(input: Generator_calculatorInput): Generator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fuelVolume"] ?? 0;
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


export interface Generator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
