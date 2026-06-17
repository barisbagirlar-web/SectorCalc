// @ts-nocheck
// Auto-generated from airbnb-occupancy-calculator-schema.json
import * as z from 'zod';

export interface Airbnb_occupancy_calculatorInput {
  bookedNights: number;
  totalAvailableNights: number;
  averageDailyRate: number;
  cleaningFeePerBooking: number;
  numberOfBookings: number;
  fixedMonthlyCosts: number;
}

export const Airbnb_occupancy_calculatorInputSchema = z.object({
  bookedNights: z.number().default(15),
  totalAvailableNights: z.number().default(30),
  averageDailyRate: z.number().default(120),
  cleaningFeePerBooking: z.number().default(50),
  numberOfBookings: z.number().default(3),
  fixedMonthlyCosts: z.number().default(800),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Airbnb_occupancy_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.bookedNights / input.totalAvailableNights * 100; results["occupancyRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["occupancyRate"] = 0; }
  try { const v = (input.bookedNights * input.averageDailyRate) + (input.numberOfBookings * input.cleaningFeePerBooking); results["totalRevenue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (asFormulaNumber(results["totalRevenue"])) - input.fixedMonthlyCosts; results["netIncome"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netIncome"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAirbnb_occupancy_calculator(input: Airbnb_occupancy_calculatorInput): Airbnb_occupancy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["occupancyRate"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
