// Auto-generated from fuel-efficiency-converter-calculator-schema.json
import * as z from 'zod';

export interface Fuel_efficiency_converter_calculatorInput {
  distance: number;
  distanceUnit: number;
  fuelUsed: number;
  fuelUnit: number;
  outputUnit: number;
  dataConfidence?: number;
}

export const Fuel_efficiency_converter_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  distanceUnit: z.number().default(0),
  fuelUsed: z.number().default(10),
  fuelUnit: z.number().default(0),
  outputUnit: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fuel_efficiency_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distanceUnit == 1 ? input.distance * 1.60934 : input.distance; results["distanceKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["distanceKm"] = Number.NaN; }
  try { const v = input.fuelUnit == 1 ? input.fuelUsed * 3.78541 : (input.fuelUnit == 2 ? input.fuelUsed * 4.54609 : input.fuelUsed); results["fuelLiters"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelLiters"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["fuelLiters"])) / (toNumericFormulaValue(results["distanceKm"]))) * 100; results["eff_Lper100km"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eff_Lper100km"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["distanceKm"])) / (toNumericFormulaValue(results["fuelLiters"])); results["eff_kmPerL"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eff_kmPerL"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["distanceKm"])) / 1.60934) / ((toNumericFormulaValue(results["fuelLiters"])) / 3.78541); results["eff_mpgUS"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eff_mpgUS"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["distanceKm"])) / 1.60934) / ((toNumericFormulaValue(results["fuelLiters"])) / 4.54609); results["eff_mpgUK"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eff_mpgUK"] = Number.NaN; }
  try { const v = (((toNumericFormulaValue(results["fuelLiters"])) / 3.78541) / ((toNumericFormulaValue(results["distanceKm"])) / 1.60934)) * 100; results["eff_galsPer100miUS"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eff_galsPer100miUS"] = Number.NaN; }
  return results;
}


export function calculateFuel_efficiency_converter_calculator(input: Fuel_efficiency_converter_calculatorInput): Fuel_efficiency_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["distanceKm"]);
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


export interface Fuel_efficiency_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
