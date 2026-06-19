// Auto-generated from traveling-salesman-schema.json
import * as z from 'zod';

export interface Traveling_salesmanInput {
  numCities: number;
  avgDistance: number;
  distanceStdDev: number;
  speed: number;
  costPerKm: number;
  fixedCostPerStop: number;
  numVehicles: number;
  dataConfidence?: number;
}

export const Traveling_salesmanInputSchema = z.object({
  numCities: z.number().default(5),
  avgDistance: z.number().default(100),
  distanceStdDev: z.number().default(20),
  speed: z.number().default(60),
  costPerKm: z.number().default(0.5),
  fixedCostPerStop: z.number().default(10),
  numVehicles: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Traveling_salesmanInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numCities * input.avgDistance; results["estimatedTourDistance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["estimatedTourDistance"] = 0; }
  try { const v = input.numCities * input.avgDistance; results["estimatedTourDistance_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["estimatedTourDistance_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTraveling_salesman(input: Traveling_salesmanInput): Traveling_salesmanOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["estimatedTourDistance_aux"]));
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


export interface Traveling_salesmanOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
