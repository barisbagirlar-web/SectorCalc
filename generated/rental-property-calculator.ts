// Auto-generated from rental-property-calculator-schema.json
import * as z from 'zod';

export interface Rental_property_calculatorInput {
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  monthlyRent: number;
  annualExpensePercent: number;
  vacancyRate: number;
  dataConfidence?: number;
}

export const Rental_property_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(200000),
  downPaymentPercent: z.number().default(20),
  interestRate: z.number().default(4),
  loanTermYears: z.number().default(25),
  monthlyRent: z.number().default(1500),
  annualExpensePercent: z.number().default(30),
  vacancyRate: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rental_property_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyRent; results["monthlyGrossRent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyGrossRent"] = Number.NaN; }
  try { const v = input.monthlyRent * 12; results["annualGrossRent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualGrossRent"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualGrossRent"])) * (1 - input.vacancyRate/100); results["effectiveAnnualRent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveAnnualRent"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveAnnualRent"])) * input.annualExpensePercent/100; results["annualExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualExpenses"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveAnnualRent"])) - (toNumericFormulaValue(results["annualExpenses"])); results["netOperatingIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netOperatingIncome"] = Number.NaN; }
  try { const v = input.purchasePrice * (1 - input.downPaymentPercent/100); results["loanAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["loanAmount"] = Number.NaN; }
  try { const v = input.interestRate/100/12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyInterestRate"] = Number.NaN; }
  try { const v = input.loanTermYears * 12; results["loanTermMonths"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["loanTermMonths"] = Number.NaN; }
  try { const v = input.purchasePrice * input.downPaymentPercent/100; results["totalCashInvested"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCashInvested"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["netOperatingIncome"])) / input.purchasePrice) * 100; results["capRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["capRate"] = Number.NaN; }
  return results;
}


export function calculateRental_property_calculator(input: Rental_property_calculatorInput): Rental_property_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["capRate"]);
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


export interface Rental_property_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
