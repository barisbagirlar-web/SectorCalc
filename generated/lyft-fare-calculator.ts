// Auto-generated from lyft-fare-calculator-schema.json
import * as z from 'zod';

export interface Lyft_fare_calculatorInput {
  distance: number;
  time: number;
  baseFare: number;
  costPerMile: number;
  costPerMinute: number;
  bookingFee: number;
  surge: number;
}

export const Lyft_fare_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  time: z.number().default(15),
  baseFare: z.number().default(2.5),
  costPerMile: z.number().default(1.5),
  costPerMinute: z.number().default(0.25),
  bookingFee: z.number().default(1),
  surge: z.number().default(1),
});

function evaluateAllFormulas(input: Lyft_fare_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.costPerMile; results["distanceCharge"] = Number.isFinite(v) ? v : 0; } catch { results["distanceCharge"] = 0; }
  try { const v = input.time * input.costPerMinute; results["timeCharge"] = Number.isFinite(v) ? v : 0; } catch { results["timeCharge"] = 0; }
  try { const v = (input.baseFare + (results["distanceCharge"] ?? 0) + (results["timeCharge"] ?? 0)) * input.surge; results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (results["subtotal"] ?? 0) + input.bookingFee; results["totalFare"] = Number.isFinite(v) ? v : 0; } catch { results["totalFare"] = 0; }
  return results;
}


export function calculateLyft_fare_calculator(input: Lyft_fare_calculatorInput): Lyft_fare_calculatorOutput {
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


export interface Lyft_fare_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
