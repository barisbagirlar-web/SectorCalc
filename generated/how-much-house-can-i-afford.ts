// Auto-generated from how-much-house-can-i-afford-schema.json
import * as z from 'zod';

export interface How_much_house_can_i_affordInput {
  annualIncome: number;
  monthlyDebt: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate: number;
  insuranceAnnual: number;
  hoaMonthly: number;
}

export const How_much_house_can_i_affordInputSchema = z.object({
  annualIncome: z.number().default(80000),
  monthlyDebt: z.number().default(500),
  downPayment: z.number().default(20000),
  interestRate: z.number().default(6.5),
  loanTerm: z.number().default(30),
  propertyTaxRate: z.number().default(1.2),
  insuranceAnnual: z.number().default(1200),
  hoaMonthly: z.number().default(0),
});

function evaluateAllFormulas(input: How_much_house_can_i_affordInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualIncome / 12; results["monthlyIncome"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyIncome"] = 0; }
  try { const v = input.interestRate / 100 / 12; results["monthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.loanTerm * 12; results["numPayments"] = Number.isFinite(v) ? v : 0; } catch { results["numPayments"] = 0; }
  try { const v = Math.min(0.28 * (results["monthlyIncome"] ?? 0), 0.36 * (results["monthlyIncome"] ?? 0) - input.monthlyDebt); results["maxHousingPayment"] = Number.isFinite(v) ? v : 0; } catch { results["maxHousingPayment"] = 0; }
  try { const v = ((results["maxHousingPayment"] ?? 0) - (input.propertyTaxRate/100/12)*input.downPayment - input.insuranceAnnual/12 - input.hoaMonthly) / (1 + (input.propertyTaxRate/100/12) * (1 - Math.pow(1 + (results["monthlyRate"] ?? 0), -(results["numPayments"] ?? 0))) / (results["monthlyRate"] ?? 0)); results["PI"] = Number.isFinite(v) ? v : 0; } catch { results["PI"] = 0; }
  results["loanAmount"] = 0;
  try { const v = (results["loanAmount"] ?? 0) + input.downPayment; results["maxHomePrice"] = Number.isFinite(v) ? v : 0; } catch { results["maxHomePrice"] = 0; }
  try { const v = ((results["maxHomePrice"] ?? 0) * input.propertyTaxRate / 100) / 12; results["monthlyPropertyTax"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPropertyTax"] = 0; }
  try { const v = input.insuranceAnnual / 12; results["monthlyInsurance"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInsurance"] = 0; }
  results["monthlyPI"] = 0;
  try { const v = (results["loanAmount"] ?? 0); results["maxLoanAmount"] = Number.isFinite(v) ? v : 0; } catch { results["maxLoanAmount"] = 0; }
  try { const v = input.hoaMonthly; results["monthlyHOA"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyHOA"] = 0; }
  return results;
}


export function calculateHow_much_house_can_i_afford(input: How_much_house_can_i_affordInput): How_much_house_can_i_affordOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxHomePrice"] ?? 0;
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


export interface How_much_house_can_i_affordOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
