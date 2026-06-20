// Auto-generated from car-rental-calculator-schema.json
import * as z from 'zod';

export interface Car_rental_calculatorInput {
  rentalDurationDays: number;
  dailyRate: number;
  mileagePerDay: number;
  fuelPricePerLiter: number;
  fuelEfficiency: number;
  insurancePerDay: number;
  dataConfidence?: number;
}

export const Car_rental_calculatorInputSchema = z.object({
  rentalDurationDays: z.number().default(1),
  dailyRate: z.number().default(50),
  mileagePerDay: z.number().default(200),
  fuelPricePerLiter: z.number().default(1.5),
  fuelEfficiency: z.number().default(7),
  insurancePerDay: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Car_rental_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rentalDurationDays * input.dailyRate; results["baseRental"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseRental"] = Number.NaN; }
  try { const v = input.rentalDurationDays * (input.mileagePerDay * input.fuelEfficiency / 100) * input.fuelPricePerLiter; results["fuelCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelCost"] = Number.NaN; }
  try { const v = input.rentalDurationDays * input.insurancePerDay; results["insuranceCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["insuranceCost"] = Number.NaN; }
  try { const v = input.rentalDurationDays * input.dailyRate + input.rentalDurationDays * (input.mileagePerDay * input.fuelEfficiency / 100) * input.fuelPricePerLiter + input.rentalDurationDays * input.insurancePerDay; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateCar_rental_calculator(input: Car_rental_calculatorInput): Car_rental_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Car_rental_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
