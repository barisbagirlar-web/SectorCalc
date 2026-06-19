// Auto-generated from pathfinder-calculator-schema.json
import * as z from 'zod';

export interface Pathfinder_calculatorInput {
  distance: number;
  speed: number;
  fuelConsumption: number;
  fuelCost: number;
  stopCount: number;
  stopDuration: number;
  tollCost: number;
  driverWage: number;
  dataConfidence?: number;
}

export const Pathfinder_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  speed: z.number().default(80),
  fuelConsumption: z.number().default(30),
  fuelCost: z.number().default(25),
  stopCount: z.number().default(2),
  stopDuration: z.number().default(30),
  tollCost: z.number().default(50),
  driverWage: z.number().default(500),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pathfinder_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / input.speed; results["travelTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["travelTimeHours"] = 0; }
  try { const v = input.stopCount * input.stopDuration; results["totalStopTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalStopTimeMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["totalStopTimeMinutes"])) / 60; results["totalStopTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalStopTimeHours"] = 0; }
  try { const v = (asFormulaNumber(results["travelTimeHours"])) + (asFormulaNumber(results["totalStopTimeHours"])); results["totalTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTimeHours"] = 0; }
  try { const v = (input.distance / 100) * input.fuelConsumption; results["fuelLitres"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelLitres"] = 0; }
  try { const v = (asFormulaNumber(results["fuelLitres"])) * input.fuelCost; results["fuelCostTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelCostTotal"] = 0; }
  try { const v = ((asFormulaNumber(results["totalTimeHours"])) / 24) * input.driverWage; results["driverCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["driverCost"] = 0; }
  try { const v = (asFormulaNumber(results["fuelCostTotal"])) + input.tollCost + (asFormulaNumber(results["driverCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePathfinder_calculator(input: Pathfinder_calculatorInput): Pathfinder_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["travelTimeHours"]));
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


export interface Pathfinder_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
