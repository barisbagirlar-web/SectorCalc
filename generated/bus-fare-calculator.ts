// Auto-generated from bus-fare-calculator-schema.json
import * as z from 'zod';

export interface Bus_fare_calculatorInput {
  baseFarePerKm: number;
  distanceKm: number;
  numberOfPassengers: number;
  discountPercent: number;
  dataConfidence?: number;
}

export const Bus_fare_calculatorInputSchema = z.object({
  baseFarePerKm: z.number().default(0.5),
  distanceKm: z.number().default(10),
  numberOfPassengers: z.number().default(1),
  discountPercent: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bus_fare_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseFarePerKm * input.distanceKm * input.numberOfPassengers; results["totalBeforeDiscount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBeforeDiscount"] = 0; }
  try { const v = (asFormulaNumber(results["totalBeforeDiscount"])) * (input.discountPercent / 100); results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (asFormulaNumber(results["totalBeforeDiscount"])) - (asFormulaNumber(results["discountAmount"])); results["totalFare"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFare"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBus_fare_calculator(input: Bus_fare_calculatorInput): Bus_fare_calculatorOutput {
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


export interface Bus_fare_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
