// Auto-generated from bus-fare-calculator-schema.json
import * as z from 'zod';

export interface Bus_fare_calculatorInput {
  baseFarePerKm: number;
  distanceKm: number;
  numberOfPassengers: number;
  discountPercent: number;
}

export const Bus_fare_calculatorInputSchema = z.object({
  baseFarePerKm: z.number().default(0.5),
  distanceKm: z.number().default(10),
  numberOfPassengers: z.number().default(1),
  discountPercent: z.number().default(0),
});

function evaluateAllFormulas(input: Bus_fare_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseFarePerKm * input.distanceKm * input.numberOfPassengers; results["totalBeforeDiscount"] = Number.isFinite(v) ? v : 0; } catch { results["totalBeforeDiscount"] = 0; }
  try { const v = (results["totalBeforeDiscount"] ?? 0) * (input.discountPercent / 100); results["discountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (results["totalBeforeDiscount"] ?? 0) - (results["discountAmount"] ?? 0); results["totalFare"] = Number.isFinite(v) ? v : 0; } catch { results["totalFare"] = 0; }
  return results;
}


export function calculateBus_fare_calculator(input: Bus_fare_calculatorInput): Bus_fare_calculatorOutput {
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


export interface Bus_fare_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
