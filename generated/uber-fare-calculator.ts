// Auto-generated from uber-fare-calculator-schema.json
import * as z from 'zod';

export interface Uber_fare_calculatorInput {
  baseFare: number;
  costPerMinute: number;
  costPerMile: number;
  distanceMiles: number;
  durationMinutes: number;
  surgeMultiplier: number;
  bookingFee: number;
}

export const Uber_fare_calculatorInputSchema = z.object({
  baseFare: z.number().default(2.5),
  costPerMinute: z.number().default(0.15),
  costPerMile: z.number().default(1.2),
  distanceMiles: z.number().default(1),
  durationMinutes: z.number().default(5),
  surgeMultiplier: z.number().default(1),
  bookingFee: z.number().default(1.5),
});

function evaluateAllFormulas(input: Uber_fare_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseFare + input.costPerMinute * input.durationMinutes + input.costPerMile * input.distanceMiles; results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * (input.surgeMultiplier - 1); results["surgeAmount"] = Number.isFinite(v) ? v : 0; } catch { results["surgeAmount"] = 0; }
  try { const v = input.bookingFee; results["bookingFeeAmount"] = Number.isFinite(v) ? v : 0; } catch { results["bookingFeeAmount"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * input.surgeMultiplier + input.bookingFee; results["totalFare"] = Number.isFinite(v) ? v : 0; } catch { results["totalFare"] = 0; }
  return results;
}


export function calculateUber_fare_calculator(input: Uber_fare_calculatorInput): Uber_fare_calculatorOutput {
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


export interface Uber_fare_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
