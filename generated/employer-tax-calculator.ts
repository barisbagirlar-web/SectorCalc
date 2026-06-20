// Auto-generated from employer-tax-calculator-schema.json
import * as z from 'zod';

export interface Employer_tax_calculatorInput {
  employeeGrossSalary: number;
  employerSocialSecurityRate: number;
  employerHealthInsuranceRate: number;
  employerUnemploymentRate: number;
  additionalCostRate: number;
  dataConfidence?: number;
}

export const Employer_tax_calculatorInputSchema = z.object({
  employeeGrossSalary: z.number().default(10000),
  employerSocialSecurityRate: z.number().default(20.5),
  employerHealthInsuranceRate: z.number().default(12),
  employerUnemploymentRate: z.number().default(2),
  additionalCostRate: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Employer_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.employeeGrossSalary * input.employerSocialSecurityRate / 100; results["employerSocialSecurityAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["employerSocialSecurityAmount"] = Number.NaN; }
  try { const v = input.employeeGrossSalary * input.employerHealthInsuranceRate / 100; results["employerHealthInsuranceAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["employerHealthInsuranceAmount"] = Number.NaN; }
  try { const v = input.employeeGrossSalary * input.employerUnemploymentRate / 100; results["employerUnemploymentAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["employerUnemploymentAmount"] = Number.NaN; }
  try { const v = input.employeeGrossSalary * input.additionalCostRate / 100; results["additionalCostAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["additionalCostAmount"] = Number.NaN; }
  try { const v = input.employeeGrossSalary + (toNumericFormulaValue(results["employerSocialSecurityAmount"])) + (toNumericFormulaValue(results["employerHealthInsuranceAmount"])) + (toNumericFormulaValue(results["employerUnemploymentAmount"])) + (toNumericFormulaValue(results["additionalCostAmount"])); results["totalEmployerCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEmployerCost"] = Number.NaN; }
  return results;
}


export function calculateEmployer_tax_calculator(input: Employer_tax_calculatorInput): Employer_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalEmployerCost"]);
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


export interface Employer_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
