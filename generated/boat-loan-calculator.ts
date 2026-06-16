// Auto-generated from boat-loan-calculator-schema.json
import * as z from 'zod';

export interface Boat_loan_calculatorInput {
  boatPrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxRate: number;
  loanTerm: number;
  annualInterestRate: number;
}

export const Boat_loan_calculatorInputSchema = z.object({
  boatPrice: z.number().default(50000),
  downPayment: z.number().default(10000),
  tradeInValue: z.number().default(0),
  salesTaxRate: z.number().default(6),
  loanTerm: z.number().default(5),
  annualInterestRate: z.number().default(5),
});

function evaluateAllFormulas(input: Boat_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { const boatPrice = input.boatPrice; const salesTaxRate = input.salesTaxRate; const downPayment = input.downPayment; const tradeInValue = input.tradeInValue; const annualInterestRate = input.annualInterestRate; const loanTerm = input.loanTerm; const P = (input.boatPrice * (1 + input.salesTaxRate / 100)) - input.downPayment - input.tradeInValue; const n = input.loanTerm * 12; if (input.annualInterestRate === 0) { return P / n; } const r = input.annualInterestRate / (12 * 100); return P * (r * (1 + r) ** n) / ((1 + r) ** n - 1); })(); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (() => { const boatPrice = input.boatPrice; const salesTaxRate = input.salesTaxRate; const downPayment = input.downPayment; const tradeInValue = input.tradeInValue; const annualInterestRate = input.annualInterestRate; const loanTerm = input.loanTerm; const P = (input.boatPrice * (1 + input.salesTaxRate / 100)) - input.downPayment - input.tradeInValue; const n = input.loanTerm * 12; let M; if (input.annualInterestRate === 0) { M = P / n; } else { const r = input.annualInterestRate / (12 * 100); M = P * (r * (1 + r) ** n) / ((1 + r) ** n - 1); } return M * n - P; })(); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = (() => { const boatPrice = input.boatPrice; const salesTaxRate = input.salesTaxRate; const downPayment = input.downPayment; const tradeInValue = input.tradeInValue; const annualInterestRate = input.annualInterestRate; const loanTerm = input.loanTerm; const P = (input.boatPrice * (1 + input.salesTaxRate / 100)) - input.downPayment - input.tradeInValue; const n = input.loanTerm * 12; let M; if (input.annualInterestRate === 0) { M = P / n; } else { const r = input.annualInterestRate / (12 * 100); M = P * (r * (1 + r) ** n) / ((1 + r) ** n - 1); } return M * n; })(); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (() => { const boatPrice = input.boatPrice; const salesTaxRate = input.salesTaxRate; const downPayment = input.downPayment; const tradeInValue = input.tradeInValue; return (input.boatPrice * (1 + input.salesTaxRate / 100)) - input.downPayment - input.tradeInValue; })(); results["principal"] = Number.isFinite(v) ? v : 0; } catch { results["principal"] = 0; }
  return results;
}


export function calculateBoat_loan_calculator(input: Boat_loan_calculatorInput): Boat_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyPayment"] ?? 0;
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


export interface Boat_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
