// Auto-generated from airbnb-occupancy-calculator-schema.json
import * as z from 'zod';

export interface Airbnb_occupancy_calculatorInput {
  bookedNights: number;
  totalAvailableNights: number;
  averageDailyRate: number;
  cleaningFeePerBooking: number;
  numberOfBookings: number;
  fixedMonthlyCosts: number;
  dataConfidence?: number;
}

export const Airbnb_occupancy_calculatorInputSchema = z.object({
  bookedNights: z.number().default(15),
  totalAvailableNights: z.number().default(30),
  averageDailyRate: z.number().default(120),
  cleaningFeePerBooking: z.number().default(50),
  numberOfBookings: z.number().default(3),
  fixedMonthlyCosts: z.number().default(800),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Airbnb_occupancy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bookedNights / input.totalAvailableNights * 100; results["occupancyRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["occupancyRate"] = 0; }
  try { const v = (input.bookedNights * input.averageDailyRate) + (input.numberOfBookings * input.cleaningFeePerBooking); results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (asFormulaNumber(results["totalRevenue"])) - input.fixedMonthlyCosts; results["netIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netIncome"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAirbnb_occupancy_calculator(input: Airbnb_occupancy_calculatorInput): Airbnb_occupancy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["occupancyRate"]));
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


export interface Airbnb_occupancy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
