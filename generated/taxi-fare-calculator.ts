// Auto-generated from taxi-fare-calculator-schema.json
import * as z from 'zod';

export interface Taxi_fare_calculatorInput {
  baseFare: number;
  costPerKm: number;
  costPerMinute: number;
  distance: number;
  time: number;
  surcharge: number;
}

export const Taxi_fare_calculatorInputSchema = z.object({
  baseFare: z.number().default(3),
  costPerKm: z.number().default(1.5),
  costPerMinute: z.number().default(0.25),
  distance: z.number().default(10),
  time: z.number().default(15),
  surcharge: z.number().default(0),
});

function evaluateAllFormulas(input: Taxi_fare_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.costPerKm; results["distanceCost"] = Number.isFinite(v) ? v : 0; } catch { results["distanceCost"] = 0; }
  try { const v = input.time * input.costPerMinute; results["timeCost"] = Number.isFinite(v) ? v : 0; } catch { results["timeCost"] = 0; }
  try { const v = input.baseFare; results["baseFare"] = Number.isFinite(v) ? v : 0; } catch { results["baseFare"] = 0; }
  try { const v = input.surcharge; results["surcharge"] = Number.isFinite(v) ? v : 0; } catch { results["surcharge"] = 0; }
  try { const v = input.baseFare + input.distance * input.costPerKm + input.time * input.costPerMinute + input.surcharge; results["totalFare"] = Number.isFinite(v) ? v : 0; } catch { results["totalFare"] = 0; }
  return results;
}


export function calculateTaxi_fare_calculator(input: Taxi_fare_calculatorInput): Taxi_fare_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalFare"] ?? 0;
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


export interface Taxi_fare_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
