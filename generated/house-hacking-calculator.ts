// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: House_hacking_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.propertyPrice - input.downPayment; results["loanAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["loanAmount"] = 0; }
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.loanTerm * 12; results["numberOfPayments"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["numberOfPayments"] = 0; }
  try { const v = input.monthlyRentIncome * (input.vacancyRate / 100); results["vacancyLoss"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vacancyLoss"] = 0; }
  try { const v = input.monthlyRentIncome - (asFormulaNumber(results["vacancyLoss"])); results["effectiveRentIncome"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveRentIncome"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHouse_hacking_calculator(input: House_hacking_calculatorInput): House_hacking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["loanAmount"]);
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


export interface House_hacking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
