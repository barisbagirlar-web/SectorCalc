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

function evaluateAllFormulas(input: Employer_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.employeeGrossSalary * input.employerSocialSecurityRate / 100; results["employerSocialSecurityAmount"] = Number.isFinite(v) ? v : 0; } catch { results["employerSocialSecurityAmount"] = 0; }
  try { const v = input.employeeGrossSalary * input.employerHealthInsuranceRate / 100; results["employerHealthInsuranceAmount"] = Number.isFinite(v) ? v : 0; } catch { results["employerHealthInsuranceAmount"] = 0; }
  try { const v = input.employeeGrossSalary * input.employerUnemploymentRate / 100; results["employerUnemploymentAmount"] = Number.isFinite(v) ? v : 0; } catch { results["employerUnemploymentAmount"] = 0; }
  try { const v = input.employeeGrossSalary * input.additionalCostRate / 100; results["additionalCostAmount"] = Number.isFinite(v) ? v : 0; } catch { results["additionalCostAmount"] = 0; }
  try { const v = input.employeeGrossSalary + (results["employerSocialSecurityAmount"] ?? 0) + (results["employerHealthInsuranceAmount"] ?? 0) + (results["employerUnemploymentAmount"] ?? 0) + (results["additionalCostAmount"] ?? 0); results["totalEmployerCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalEmployerCost"] = 0; }
  return results;
}


export function calculateEmployer_tax_calculator(input: Employer_tax_calculatorInput): Employer_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalEmployerCost"] ?? 0;
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


export interface Employer_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
