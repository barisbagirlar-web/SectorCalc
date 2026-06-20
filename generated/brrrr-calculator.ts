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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Brrrr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice * (input.downPaymentPercent / 100); results["downPayment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["downPayment"] = Number.NaN; }
  try { const v = input.purchasePrice - (toNumericFormulaValue(results["downPayment"])); results["loanAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["loanAmount"] = Number.NaN; }
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyInterestRate"] = Number.NaN; }
  try { const v = input.loanTermYears * 12; results["numberOfPayments"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["numberOfPayments"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["downPayment"])) + input.rehabCost; results["totalInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInvestment"] = Number.NaN; }
  return results;
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
