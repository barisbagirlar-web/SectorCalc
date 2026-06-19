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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lyft_fare_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.costPerMile; results["distanceCharge"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["distanceCharge"] = 0; }
  try { const v = input.time * input.costPerMinute; results["timeCharge"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["timeCharge"] = 0; }
  try { const v = (input.baseFare + (asFormulaNumber(results["distanceCharge"])) + (asFormulaNumber(results["timeCharge"]))) * input.surge; results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) + input.bookingFee; results["totalFare"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFare"] = 0; }
  try { const v = input.baseFare; results["baseFare"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseFare"] = 0; }
  try { const v = input.bookingFee; results["bookingFee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bookingFee"] = 0; }
  try { const v = input.surge; results["surge"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["surge"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLyft_fare_calculator(input: Lyft_fare_calculatorInput): Lyft_fare_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalFare"]));
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


export interface Lyft_fare_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
