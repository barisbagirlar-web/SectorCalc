// Auto-generated from rental-income-calculator-schema.json
import * as z from 'zod';

export interface Rental_income_calculatorInput {
  monthlyRent: number;
  occupancyRate: number;
  managementFeePercent: number;
  maintenanceMonthly: number;
  insuranceMonthly: number;
  propertyTaxAnnual: number;
}

export const Rental_income_calculatorInputSchema = z.object({
  monthlyRent: z.number().default(1500),
  occupancyRate: z.number().default(95),
  managementFeePercent: z.number().default(10),
  maintenanceMonthly: z.number().default(100),
  insuranceMonthly: z.number().default(50),
  propertyTaxAnnual: z.number().default(2000),
});

function evaluateAllFormulas(input: Rental_income_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyRent * 12 * (input.occupancyRate / 100); results["grossAnnualIncome"] = Number.isFinite(v) ? v : 0; } catch { results["grossAnnualIncome"] = 0; }
  try { const v = (results["grossAnnualIncome"] ?? 0) * (input.managementFeePercent / 100); results["managementFees"] = Number.isFinite(v) ? v : 0; } catch { results["managementFees"] = 0; }
  try { const v = input.maintenanceMonthly * 12; results["totalMaintenance"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaintenance"] = 0; }
  try { const v = input.insuranceMonthly * 12; results["totalInsurance"] = Number.isFinite(v) ? v : 0; } catch { results["totalInsurance"] = 0; }
  try { const v = (results["managementFees"] ?? 0) + (results["totalMaintenance"] ?? 0) + (results["totalInsurance"] ?? 0) + input.propertyTaxAnnual; results["totalExpenses"] = Number.isFinite(v) ? v : 0; } catch { results["totalExpenses"] = 0; }
  try { const v = (results["grossAnnualIncome"] ?? 0) - (results["totalExpenses"] ?? 0); results["netAnnualIncome"] = Number.isFinite(v) ? v : 0; } catch { results["netAnnualIncome"] = 0; }
  try { const v = (results["netAnnualIncome"] ?? 0) / 12; results["netMonthlyIncome"] = Number.isFinite(v) ? v : 0; } catch { results["netMonthlyIncome"] = 0; }
  return results;
}


export function calculateRental_income_calculator(input: Rental_income_calculatorInput): Rental_income_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netAnnualIncome"] ?? 0;
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


export interface Rental_income_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
