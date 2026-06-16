// Auto-generated from how-much-house-can-i-afford-calculator-schema.json
import * as z from 'zod';

export interface How_much_house_can_i_afford_calculatorInput {
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate: number;
  insuranceRate: number;
  monthlyHOA: number;
}

export const How_much_house_can_i_afford_calculatorInputSchema = z.object({
  annualIncome: z.number().default(80000),
  monthlyDebts: z.number().default(500),
  downPayment: z.number().default(20000),
  interestRate: z.number().default(6.5),
  loanTerm: z.number().default(30),
  propertyTaxRate: z.number().default(1.2),
  insuranceRate: z.number().default(0.5),
  monthlyHOA: z.number().default(0),
});

function evaluateAllFormulas(input: How_much_house_can_i_afford_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualIncome / 12; results["monthlyIncome"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyIncome"] = 0; }
  try { const v = (results["monthlyIncome"] ?? 0) * 0.36; results["maxTotalMonthlyDebt"] = Number.isFinite(v) ? v : 0; } catch { results["maxTotalMonthlyDebt"] = 0; }
  try { const v = (results["monthlyIncome"] ?? 0) * 0.28; results["maxHousingExpense"] = Number.isFinite(v) ? v : 0; } catch { results["maxHousingExpense"] = 0; }
  try { const v = Math.min((results["maxTotalMonthlyDebt"] ?? 0) - input.monthlyDebts, (results["maxHousingExpense"] ?? 0)); results["availableForPITIandHOA"] = Number.isFinite(v) ? v : 0; } catch { results["availableForPITIandHOA"] = 0; }
  try { const v = input.interestRate / 100 / 12; results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = input.loanTerm * 12; results["n"] = Number.isFinite(v) ? v : 0; } catch { results["n"] = 0; }
  try { const v = ((results["r"] ?? 0) * (1 + (results["r"] ?? 0)) ** (results["n"] ?? 0)) / ((1 + (results["r"] ?? 0)) ** (results["n"] ?? 0) - 1); results["monthlyPaymentFactor"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPaymentFactor"] = 0; }
  try { const v = (input.propertyTaxRate / 100 + input.insuranceRate / 100) / 12; results["monthlyTaxInsuranceRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyTaxInsuranceRate"] = 0; }
  try { const v = Math.max(0, ((results["availableForPITIandHOA"] ?? 0) + input.downPayment * (results["monthlyPaymentFactor"] ?? 0) - input.monthlyHOA) / ((results["monthlyPaymentFactor"] ?? 0) + (results["monthlyTaxInsuranceRate"] ?? 0))); results["maxAffordableHousePrice"] = Number.isFinite(v) ? v : 0; } catch { results["maxAffordableHousePrice"] = 0; }
  try { const v = Math.max(0, (results["maxAffordableHousePrice"] ?? 0) - input.downPayment); results["maxLoanAmount"] = Number.isFinite(v) ? v : 0; } catch { results["maxLoanAmount"] = 0; }
  try { const v = (results["availableForPITIandHOA"] ?? 0); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  return results;
}


export function calculateHow_much_house_can_i_afford_calculator(input: How_much_house_can_i_afford_calculatorInput): How_much_house_can_i_afford_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxAffordableHousePrice"] ?? 0;
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


export interface How_much_house_can_i_afford_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
