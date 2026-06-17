// @ts-nocheck
// Auto-generated from car-rental-calculator-schema.json
import * as z from 'zod';

export interface Car_rental_calculatorInput {
  rentalDurationDays: number;
  dailyRate: number;
  mileagePerDay: number;
  fuelPricePerLiter: number;
  fuelEfficiency: number;
  insurancePerDay: number;
}

export const Car_rental_calculatorInputSchema = z.object({
  rentalDurationDays: z.number().default(1),
  dailyRate: z.number().default(50),
  mileagePerDay: z.number().default(200),
  fuelPricePerLiter: z.number().default(1.5),
  fuelEfficiency: z.number().default(7),
  insurancePerDay: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Car_rental_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.rentalDurationDays * input.dailyRate; results["baseRental"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseRental"] = 0; }
  try { const v = input.rentalDurationDays * (input.mileagePerDay * input.fuelEfficiency / 100) * input.fuelPricePerLiter; results["fuelCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fuelCost"] = 0; }
  try { const v = input.rentalDurationDays * input.insurancePerDay; results["insuranceCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["insuranceCost"] = 0; }
  try { const v = input.rentalDurationDays * input.dailyRate + input.rentalDurationDays * (input.mileagePerDay * input.fuelEfficiency / 100) * input.fuelPricePerLiter + input.rentalDurationDays * input.insurancePerDay; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCar_rental_calculator(input: Car_rental_calculatorInput): Car_rental_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Car_rental_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
