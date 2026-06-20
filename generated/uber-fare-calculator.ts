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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Uber_fare_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseFare + input.costPerMinute * input.durationMinutes + input.costPerMile * input.distanceMiles; results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["subtotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) * (input.surgeMultiplier - 1); results["surgeAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["surgeAmount"] = Number.NaN; }
  try { const v = input.bookingFee; results["bookingFeeAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bookingFeeAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) * input.surgeMultiplier + input.bookingFee; results["totalFare"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFare"] = Number.NaN; }
  return results;
}


export function calculateUber_fare_calculator(input: Uber_fare_calculatorInput): Uber_fare_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalFare"]);
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


export interface Uber_fare_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
