// Auto-generated from brrrr-calculator-schema.json
import * as z from 'zod';

export interface Brrrr_calculatorInput {
  purchasePrice: number;
  rehabCost: number;
  afterRepairValue: number;
  monthlyRent: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  monthlyExpenses: number;
  dataConfidence?: number;
}

export const Brrrr_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(100000),
  rehabCost: z.number().default(20000),
  afterRepairValue: z.number().default(150000),
  monthlyRent: z.number().default(1500),
  downPaymentPercent: z.number().default(20),
  interestRate: z.number().default(4),
  loanTermYears: z.number().default(30),
  monthlyExpenses: z.number().default(500),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Brrrr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice * (input.downPaymentPercent / 100); results["downPayment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["downPayment"] = 0; }
  try { const v = input.purchasePrice - (asFormulaNumber(results["downPayment"])); results["loanAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["loanAmount"] = 0; }
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTermYears * 12; results["numberOfPayments"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = (asFormulaNumber(results["downPayment"])) + input.rehabCost; results["totalInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInvestment"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBrrrr_calculator(input: Brrrr_calculatorInput): Brrrr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalInvestment"]);
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


export interface Brrrr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
