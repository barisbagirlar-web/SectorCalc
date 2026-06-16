// Auto-generated from house-hacking-calculator-schema.json
import * as z from 'zod';

export interface House_hacking_calculatorInput {
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  monthlyRentIncome: number;
  monthlyExpenses: number;
  vacancyRate: number;
}

export const House_hacking_calculatorInputSchema = z.object({
  propertyPrice: z.number().default(300000),
  downPayment: z.number().default(60000),
  interestRate: z.number().default(4.5),
  loanTerm: z.number().default(30),
  monthlyRentIncome: z.number().default(2500),
  monthlyExpenses: z.number().default(800),
  vacancyRate: z.number().default(5),
});

function evaluateAllFormulas(input: House_hacking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.propertyPrice - input.downPayment; results["loanAmount"] = Number.isFinite(v) ? v : 0; } catch { results["loanAmount"] = 0; }
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTerm * 12; results["numberOfPayments"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = (results["loanAmount"] ?? 0) * (results["monthlyInterestRate"] ?? 0) * Math.pow(1 + (results["monthlyInterestRate"] ?? 0), (results["numberOfPayments"] ?? 0)) / (Math.pow(1 + (results["monthlyInterestRate"] ?? 0), (results["numberOfPayments"] ?? 0)) - 1); results["monthlyMortgage"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyMortgage"] = 0; }
  try { const v = input.monthlyRentIncome * (input.vacancyRate / 100); results["vacancyLoss"] = Number.isFinite(v) ? v : 0; } catch { results["vacancyLoss"] = 0; }
  try { const v = input.monthlyRentIncome - (results["vacancyLoss"] ?? 0); results["effectiveRentIncome"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveRentIncome"] = 0; }
  try { const v = (results["effectiveRentIncome"] ?? 0) - (results["monthlyMortgage"] ?? 0) - input.monthlyExpenses; results["netMonthlyCashFlow"] = Number.isFinite(v) ? v : 0; } catch { results["netMonthlyCashFlow"] = 0; }
  try { const v = (results["netMonthlyCashFlow"] ?? 0) * 12; results["annualCashFlow"] = Number.isFinite(v) ? v : 0; } catch { results["annualCashFlow"] = 0; }
  try { const v = ((results["annualCashFlow"] ?? 0) / input.downPayment) * 100; results["cashOnCashReturn"] = Number.isFinite(v) ? v : 0; } catch { results["cashOnCashReturn"] = 0; }
  return results;
}


export function calculateHouse_hacking_calculator(input: House_hacking_calculatorInput): House_hacking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Monthly"] ?? 0;
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


export interface House_hacking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
