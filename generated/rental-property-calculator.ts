// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rental_property_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.monthlyRent; results["monthlyGrossRent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyGrossRent"] = 0; }
  try { const v = input.monthlyRent * 12; results["annualGrossRent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualGrossRent"] = 0; }
  try { const v = (asFormulaNumber(results["annualGrossRent"])) * (1 - input.vacancyRate/100); results["effectiveAnnualRent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveAnnualRent"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveAnnualRent"])) * input.annualExpensePercent/100; results["annualExpenses"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualExpenses"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveAnnualRent"])) - (asFormulaNumber(results["annualExpenses"])); results["netOperatingIncome"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netOperatingIncome"] = 0; }
  try { const v = input.purchasePrice * (1 - input.downPaymentPercent/100); results["loanAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["loanAmount"] = 0; }
  try { const v = input.interestRate/100/12; results["monthlyInterestRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTermYears * 12; results["loanTermMonths"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["loanTermMonths"] = 0; }
  try { const v = input.purchasePrice * input.downPaymentPercent/100; results["totalCashInvested"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCashInvested"] = 0; }
  try { const v = ((asFormulaNumber(results["netOperatingIncome"])) / input.purchasePrice) * 100; results["capRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["capRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRental_property_calculator(input: Rental_property_calculatorInput): Rental_property_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["capRate"]);
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


export interface Rental_property_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
