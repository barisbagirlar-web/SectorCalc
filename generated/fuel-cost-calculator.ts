// Auto-generated from fuel-cost-calculator-schema.json
import * as z from 'zod';

export interface Fuel_cost_calculatorInput {
  distance: number;
  fuelConsumption: number;
  fuelPrice: number;
  trips: number;
  extraCost: number;
  dataConfidence?: number;
}

export const Fuel_cost_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  fuelConsumption: z.number().default(7),
  fuelPrice: z.number().default(1.5),
  trips: z.number().default(1),
  extraCost: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fuel_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.distance * input.fuelConsumption / 100) * input.trips; results["totalFuelConsumed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFuelConsumed"] = Number.NaN; }
  try { const v = ((input.distance * input.fuelConsumption / 100) * input.trips) * input.fuelPrice; results["fuelCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelCost"] = Number.NaN; }
  try { const v = input.extraCost * input.trips; results["extraCostTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["extraCostTotal"] = Number.NaN; }
  try { const v = ((input.distance * input.fuelConsumption / 100) * input.trips) * input.fuelPrice + (input.extraCost * input.trips); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateFuel_cost_calculator(input: Fuel_cost_calculatorInput): Fuel_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Fuel_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
