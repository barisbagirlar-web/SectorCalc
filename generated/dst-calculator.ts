// Auto-generated from dst-calculator-schema.json
import * as z from 'zod';

export interface Dst_calculatorInput {
  distance: number;
  averageSpeed: number;
  fuelConsumption: number;
  fuelPrice: number;
  numStops: number;
  stopTime: number;
}

export const Dst_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  averageSpeed: z.number().default(60),
  fuelConsumption: z.number().default(30),
  fuelPrice: z.number().default(1.5),
  numStops: z.number().default(0),
  stopTime: z.number().default(15),
});

function evaluateAllFormulas(input: Dst_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / input.averageSpeed; results["travelTime"] = Number.isFinite(v) ? v : 0; } catch { results["travelTime"] = 0; }
  try { const v = (results["travelTime"] ?? 0) + (input.numStops * input.stopTime / 60); results["totalTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalTime"] = 0; }
  try { const v = (input.distance / 100) * input.fuelConsumption; results["fuelConsumed"] = Number.isFinite(v) ? v : 0; } catch { results["fuelConsumed"] = 0; }
  try { const v = (results["fuelConsumed"] ?? 0) * input.fuelPrice; results["fuelCost"] = Number.isFinite(v) ? v : 0; } catch { results["fuelCost"] = 0; }
  return results;
}


export function calculateDst_calculator(input: Dst_calculatorInput): Dst_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTime"] ?? 0;
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


export interface Dst_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
