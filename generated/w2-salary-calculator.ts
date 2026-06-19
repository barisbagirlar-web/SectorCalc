// Auto-generated from w2-salary-calculator-schema.json
import * as z from 'zod';

export interface W2_salary_calculatorInput {
  grossSalary: number;
  preTaxDeductions: number;
  federalTaxRate: number;
  stateTaxRate: number;
  socialSecurityRate: number;
  medicareRate: number;
  otherDeductions: number;
  dataConfidence?: number;
}

export const W2_salary_calculatorInputSchema = z.object({
  grossSalary: z.number().default(75000),
  preTaxDeductions: z.number().default(0),
  federalTaxRate: z.number().default(22),
  stateTaxRate: z.number().default(5),
  socialSecurityRate: z.number().default(6.2),
  medicareRate: z.number().default(1.45),
  otherDeductions: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: W2_salary_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossSalary - input.preTaxDeductions; results["taxableIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxableIncome"] = 0; }
  try { const v = (asFormulaNumber(results["taxableIncome"])) * (input.federalTaxRate / 100); results["federalTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["federalTax"] = 0; }
  try { const v = (asFormulaNumber(results["taxableIncome"])) * (input.stateTaxRate / 100); results["stateTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stateTax"] = 0; }
  try { const v = (asFormulaNumber(results["taxableIncome"])) * (input.socialSecurityRate / 100); results["socialSecurityTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["socialSecurityTax"] = 0; }
  try { const v = (asFormulaNumber(results["taxableIncome"])) * (input.medicareRate / 100); results["medicareTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["medicareTax"] = 0; }
  try { const v = (asFormulaNumber(results["federalTax"])) + (asFormulaNumber(results["stateTax"])) + (asFormulaNumber(results["socialSecurityTax"])) + (asFormulaNumber(results["medicareTax"])); results["totalTaxes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTaxes"] = 0; }
  try { const v = (asFormulaNumber(results["taxableIncome"])) - (asFormulaNumber(results["totalTaxes"])) - input.otherDeductions; results["netPay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netPay"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateW2_salary_calculator(input: W2_salary_calculatorInput): W2_salary_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netPay"]);
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


export interface W2_salary_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
