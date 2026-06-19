// Auto-generated from flight-cost-calculator-schema.json
import * as z from 'zod';

export interface Flight_cost_calculatorInput {
  distance: number;
  avgSpeed: number;
  fuelConsumptionRate: number;
  fuelPrice: number;
  crewCostPerHour: number;
  landingFee: number;
  maintenanceCostPerHour: number;
  dataConfidence?: number;
}

export const Flight_cost_calculatorInputSchema = z.object({
  distance: z.number().default(1000),
  avgSpeed: z.number().default(800),
  fuelConsumptionRate: z.number().default(3.5),
  fuelPrice: z.number().default(0.8),
  crewCostPerHour: z.number().default(200),
  landingFee: z.number().default(500),
  maintenanceCostPerHour: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Flight_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / input.avgSpeed; results["flightHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["flightHours"] = 0; }
  try { const v = input.distance * input.fuelConsumptionRate * input.fuelPrice; results["fuelCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelCost"] = 0; }
  try { const v = (asFormulaNumber(results["flightHours"])) * input.crewCostPerHour; results["crewCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["crewCost"] = 0; }
  try { const v = (asFormulaNumber(results["flightHours"])) * input.maintenanceCostPerHour; results["maintenanceCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maintenanceCost"] = 0; }
  try { const v = (asFormulaNumber(results["fuelCost"])) + (asFormulaNumber(results["crewCost"])) + input.landingFee + (asFormulaNumber(results["maintenanceCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFlight_cost_calculator(input: Flight_cost_calculatorInput): Flight_cost_calculatorOutput {
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


export interface Flight_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
