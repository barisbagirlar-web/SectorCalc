// Auto-generated from fuel-efficiency-converter-calculator-schema.json
import * as z from 'zod';

export interface Fuel_efficiency_converter_calculatorInput {
  distance: number;
  distanceUnit: number;
  fuelUsed: number;
  fuelUnit: number;
  outputUnit: number;
}

export const Fuel_efficiency_converter_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  distanceUnit: z.number().default(0),
  fuelUsed: z.number().default(10),
  fuelUnit: z.number().default(0),
  outputUnit: z.number().default(0),
});

function evaluateAllFormulas(input: Fuel_efficiency_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distanceUnit == 1 ? input.distance * 1.60934 : input.distance; results["distanceKm"] = Number.isFinite(v) ? v : 0; } catch { results["distanceKm"] = 0; }
  try { const v = input.fuelUnit == 1 ? input.fuelUsed * 3.78541 : (input.fuelUnit == 2 ? input.fuelUsed * 4.54609 : input.fuelUsed); results["fuelLiters"] = Number.isFinite(v) ? v : 0; } catch { results["fuelLiters"] = 0; }
  try { const v = (((results["results"] ?? 0)["fuelLiters"] ?? 0) / ((results["results"] ?? 0)["distanceKm"] ?? 0)) * 100; results["eff_Lper100km"] = Number.isFinite(v) ? v : 0; } catch { results["eff_Lper100km"] = 0; }
  try { const v = ((results["results"] ?? 0)["distanceKm"] ?? 0) / ((results["results"] ?? 0)["fuelLiters"] ?? 0); results["eff_kmPerL"] = Number.isFinite(v) ? v : 0; } catch { results["eff_kmPerL"] = 0; }
  try { const v = (((results["results"] ?? 0)["distanceKm"] ?? 0) / 1.60934) / (((results["results"] ?? 0)["fuelLiters"] ?? 0) / 3.78541); results["eff_mpgUS"] = Number.isFinite(v) ? v : 0; } catch { results["eff_mpgUS"] = 0; }
  try { const v = (((results["results"] ?? 0)["distanceKm"] ?? 0) / 1.60934) / (((results["results"] ?? 0)["fuelLiters"] ?? 0) / 4.54609); results["eff_mpgUK"] = Number.isFinite(v) ? v : 0; } catch { results["eff_mpgUK"] = 0; }
  try { const v = ((((results["results"] ?? 0)["fuelLiters"] ?? 0) / 3.78541) / (((results["results"] ?? 0)["distanceKm"] ?? 0) / 1.60934)) * 100; results["eff_galsPer100miUS"] = Number.isFinite(v) ? v : 0; } catch { results["eff_galsPer100miUS"] = 0; }
  results["results"] = 0;
  return results;
}


export function calculateFuel_efficiency_converter_calculator(input: Fuel_efficiency_converter_calculatorInput): Fuel_efficiency_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["results"] ?? 0;
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


export interface Fuel_efficiency_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
