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

function evaluateAllFormulas(input: Car_rental_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rentalDurationDays * input.dailyRate; results["baseRental"] = Number.isFinite(v) ? v : 0; } catch { results["baseRental"] = 0; }
  try { const v = input.rentalDurationDays * (input.mileagePerDay * input.fuelEfficiency / 100) * input.fuelPricePerLiter; results["fuelCost"] = Number.isFinite(v) ? v : 0; } catch { results["fuelCost"] = 0; }
  try { const v = input.rentalDurationDays * input.insurancePerDay; results["insuranceCost"] = Number.isFinite(v) ? v : 0; } catch { results["insuranceCost"] = 0; }
  try { const v = input.rentalDurationDays * input.dailyRate + input.rentalDurationDays * (input.mileagePerDay * input.fuelEfficiency / 100) * input.fuelPricePerLiter + input.rentalDurationDays * input.insurancePerDay; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateCar_rental_calculator(input: Car_rental_calculatorInput): Car_rental_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Car_rental_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
