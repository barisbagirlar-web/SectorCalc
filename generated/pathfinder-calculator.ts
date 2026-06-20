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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pathfinder_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / input.speed; results["travelTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["travelTimeHours"] = Number.NaN; }
  try { const v = input.stopCount * input.stopDuration; results["totalStopTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalStopTimeMinutes"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalStopTimeMinutes"])) / 60; results["totalStopTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalStopTimeHours"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["travelTimeHours"])) + (toNumericFormulaValue(results["totalStopTimeHours"])); results["totalTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTimeHours"] = Number.NaN; }
  try { const v = (input.distance / 100) * input.fuelConsumption; results["fuelLitres"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelLitres"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fuelLitres"])) * input.fuelCost; results["fuelCostTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelCostTotal"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["totalTimeHours"])) / 24) * input.driverWage; results["driverCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["driverCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fuelCostTotal"])) + input.tollCost + (toNumericFormulaValue(results["driverCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculatePathfinder_calculator(input: Pathfinder_calculatorInput): Pathfinder_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["travelTimeHours"]);
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


export interface Pathfinder_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
