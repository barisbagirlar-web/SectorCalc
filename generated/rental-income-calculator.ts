// Auto-generated from rental-income-calculator-schema.json
import * as z from 'zod';

export interface Rental_income_calculatorInput {
  monthlyRent: number;
  occupancyRate: number;
  managementFeePercent: number;
  maintenanceMonthly: number;
  insuranceMonthly: number;
  propertyTaxAnnual: number;
  dataConfidence?: number;
}

export const Rental_income_calculatorInputSchema = z.object({
  monthlyRent: z.number().default(1500),
  occupancyRate: z.number().default(95),
  managementFeePercent: z.number().default(10),
  maintenanceMonthly: z.number().default(100),
  insuranceMonthly: z.number().default(50),
  propertyTaxAnnual: z.number().default(2000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rental_income_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyRent * 12 * (input.occupancyRate / 100); results["grossAnnualIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossAnnualIncome"] = 0; }
  try { const v = (asFormulaNumber(results["grossAnnualIncome"])) * (input.managementFeePercent / 100); results["managementFees"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["managementFees"] = 0; }
  try { const v = input.maintenanceMonthly * 12; results["totalMaintenance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMaintenance"] = 0; }
  try { const v = input.insuranceMonthly * 12; results["totalInsurance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInsurance"] = 0; }
  try { const v = (asFormulaNumber(results["managementFees"])) + (asFormulaNumber(results["totalMaintenance"])) + (asFormulaNumber(results["totalInsurance"])) + input.propertyTaxAnnual; results["totalExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalExpenses"] = 0; }
  try { const v = (asFormulaNumber(results["grossAnnualIncome"])) - (asFormulaNumber(results["totalExpenses"])); results["netAnnualIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netAnnualIncome"] = 0; }
  try { const v = (asFormulaNumber(results["netAnnualIncome"])) / 12; results["netMonthlyIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netMonthlyIncome"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRental_income_calculator(input: Rental_income_calculatorInput): Rental_income_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["netAnnualIncome"]));
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


export interface Rental_income_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
