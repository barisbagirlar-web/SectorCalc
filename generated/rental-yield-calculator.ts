// Auto-generated from rental-yield-calculator-schema.json
import * as z from 'zod';

export interface Rental_yield_calculatorInput {
  purchasePrice: number;
  monthlyRent: number;
  annualExpenses: number;
  vacancyRate: number;
  dataConfidence?: number;
}

export const Rental_yield_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(200000),
  monthlyRent: z.number().default(1500),
  annualExpenses: z.number().default(3000),
  vacancyRate: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rental_yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.monthlyRent * 12 / input.purchasePrice) * 100; results["grossYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossYield"] = Number.NaN; }
  try { const v = ((input.monthlyRent * 12 * (1 - input.vacancyRate / 100) - input.annualExpenses) / input.purchasePrice) * 100; results["netYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netYield"] = Number.NaN; }
  try { const v = (input.monthlyRent * 12 * (1 - input.vacancyRate / 100) - input.annualExpenses) / 12; results["cashFlowMonthly"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cashFlowMonthly"] = Number.NaN; }
  return results;
}


export function calculateRental_yield_calculator(input: Rental_yield_calculatorInput): Rental_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netYield"]);
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


export interface Rental_yield_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
