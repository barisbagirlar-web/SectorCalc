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

function evaluateAllFormulas(input: Pathfinder_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / input.speed; results["travelTimeHours"] = Number.isFinite(v) ? v : 0; } catch { results["travelTimeHours"] = 0; }
  try { const v = input.stopCount * input.stopDuration; results["totalStopTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalStopTimeMinutes"] = 0; }
  try { const v = (results["totalStopTimeMinutes"] ?? 0) / 60; results["totalStopTimeHours"] = Number.isFinite(v) ? v : 0; } catch { results["totalStopTimeHours"] = 0; }
  try { const v = (results["travelTimeHours"] ?? 0) + (results["totalStopTimeHours"] ?? 0); results["totalTimeHours"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeHours"] = 0; }
  try { const v = (input.distance / 100) * input.fuelConsumption; results["fuelLitres"] = Number.isFinite(v) ? v : 0; } catch { results["fuelLitres"] = 0; }
  try { const v = (results["fuelLitres"] ?? 0) * input.fuelCost; results["fuelCostTotal"] = Number.isFinite(v) ? v : 0; } catch { results["fuelCostTotal"] = 0; }
  try { const v = ((results["totalTimeHours"] ?? 0) / 24) * input.driverWage; results["driverCost"] = Number.isFinite(v) ? v : 0; } catch { results["driverCost"] = 0; }
  try { const v = (results["fuelCostTotal"] ?? 0) + input.tollCost + (results["driverCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  results["_fuelCostTotal__TL"] = 0;
  results["_tollCost__TL"] = 0;
  results["_driverCost__TL"] = 0;
  results["_totalTimeHours__saat"] = 0;
  return results;
}


export function calculatePathfinder_calculator(input: Pathfinder_calculatorInput): Pathfinder_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["travelTimeHours"] ?? 0;
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


export interface Pathfinder_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
