// @ts-nocheck
// Auto-generated from employer-tax-calculator-schema.json
import * as z from 'zod';

export interface Employer_tax_calculatorInput {
  employeeGrossSalary: number;
  employerSocialSecurityRate: number;
  employerHealthInsuranceRate: number;
  employerUnemploymentRate: number;
  additionalCostRate: number;
}

export const Employer_tax_calculatorInputSchema = z.object({
  employeeGrossSalary: z.number().default(10000),
  employerSocialSecurityRate: z.number().default(20.5),
  employerHealthInsuranceRate: z.number().default(12),
  employerUnemploymentRate: z.number().default(2),
  additionalCostRate: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Employer_tax_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.employeeGrossSalary * input.employerSocialSecurityRate / 100; results["employerSocialSecurityAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["employerSocialSecurityAmount"] = 0; }
  try { const v = input.employeeGrossSalary * input.employerHealthInsuranceRate / 100; results["employerHealthInsuranceAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["employerHealthInsuranceAmount"] = 0; }
  try { const v = input.employeeGrossSalary * input.employerUnemploymentRate / 100; results["employerUnemploymentAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["employerUnemploymentAmount"] = 0; }
  try { const v = input.employeeGrossSalary * input.additionalCostRate / 100; results["additionalCostAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["additionalCostAmount"] = 0; }
  try { const v = input.employeeGrossSalary + (asFormulaNumber(results["employerSocialSecurityAmount"])) + (asFormulaNumber(results["employerHealthInsuranceAmount"])) + (asFormulaNumber(results["employerUnemploymentAmount"])) + (asFormulaNumber(results["additionalCostAmount"])); results["totalEmployerCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalEmployerCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEmployer_tax_calculator(input: Employer_tax_calculatorInput): Employer_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalEmployerCost"]);
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


export interface Employer_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
