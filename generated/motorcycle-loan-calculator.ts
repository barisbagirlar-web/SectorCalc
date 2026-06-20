// Auto-generated from motorcycle-loan-calculator-schema.json
import * as z from 'zod';

export interface Motorcycle_loan_calculatorInput {
  vehiclePrice: number;
  downPayment: number;
  tradeIn: number;
  interestRate: number;
  loanTerm: number;
  salesTaxRate: number;
  dataConfidence?: number;
}

export const Motorcycle_loan_calculatorInputSchema = z.object({
  vehiclePrice: z.number().default(200000),
  downPayment: z.number().default(40000),
  tradeIn: z.number().default(0),
  interestRate: z.number().default(15),
  loanTerm: z.number().default(36),
  salesTaxRate: z.number().default(18),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Motorcycle_loan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyInterestRate"] = Number.NaN; }
  try { const v = input.vehiclePrice * (1 + input.salesTaxRate / 100) - input.downPayment - input.tradeIn; results["loanAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["loanAmount"] = Number.NaN; }
  return results;
}


export function calculateMotorcycle_loan_calculator(input: Motorcycle_loan_calculatorInput): Motorcycle_loan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["loanAmount"]);
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


export interface Motorcycle_loan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
