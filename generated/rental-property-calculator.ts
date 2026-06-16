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

function evaluateAllFormulas(input: Rental_property_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyRent; results["monthlyGrossRent"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyGrossRent"] = 0; }
  try { const v = input.monthlyRent * 12; results["annualGrossRent"] = Number.isFinite(v) ? v : 0; } catch { results["annualGrossRent"] = 0; }
  try { const v = (results["annualGrossRent"] ?? 0) * (1 - input.vacancyRate/100); results["effectiveAnnualRent"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualRent"] = 0; }
  try { const v = (results["effectiveAnnualRent"] ?? 0) * input.annualExpensePercent/100; results["annualExpenses"] = Number.isFinite(v) ? v : 0; } catch { results["annualExpenses"] = 0; }
  try { const v = (results["effectiveAnnualRent"] ?? 0) - (results["annualExpenses"] ?? 0); results["netOperatingIncome"] = Number.isFinite(v) ? v : 0; } catch { results["netOperatingIncome"] = 0; }
  try { const v = input.purchasePrice * (1 - input.downPaymentPercent/100); results["loanAmount"] = Number.isFinite(v) ? v : 0; } catch { results["loanAmount"] = 0; }
  try { const v = input.interestRate/100/12; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTermYears * 12; results["loanTermMonths"] = Number.isFinite(v) ? v : 0; } catch { results["loanTermMonths"] = 0; }
  try { const v = (results["loanAmount"] ?? 0) * ((results["monthlyInterestRate"] ?? 0) * Math.pow(1 + (results["monthlyInterestRate"] ?? 0), (results["loanTermMonths"] ?? 0))) / (Math.pow(1 + (results["monthlyInterestRate"] ?? 0), (results["loanTermMonths"] ?? 0)) - 1); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * 12; results["annualDebtService"] = Number.isFinite(v) ? v : 0; } catch { results["annualDebtService"] = 0; }
  try { const v = (results["netOperatingIncome"] ?? 0) - (results["annualDebtService"] ?? 0); results["annualCashFlow"] = Number.isFinite(v) ? v : 0; } catch { results["annualCashFlow"] = 0; }
  try { const v = (results["annualCashFlow"] ?? 0) / 12; results["monthlyCashFlow"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyCashFlow"] = 0; }
  try { const v = input.purchasePrice * input.downPaymentPercent/100; results["totalCashInvested"] = Number.isFinite(v) ? v : 0; } catch { results["totalCashInvested"] = 0; }
  try { const v = ((results["annualCashFlow"] ?? 0) / (results["totalCashInvested"] ?? 0)) * 100; results["cashOnCashReturn"] = Number.isFinite(v) ? v : 0; } catch { results["cashOnCashReturn"] = 0; }
  try { const v = ((results["netOperatingIncome"] ?? 0) / input.purchasePrice) * 100; results["capRate"] = Number.isFinite(v) ? v : 0; } catch { results["capRate"] = 0; }
  return results;
}


export function calculateRental_property_calculator(input: Rental_property_calculatorInput): Rental_property_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cashOnCashReturn"] ?? 0;
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


export interface Rental_property_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
