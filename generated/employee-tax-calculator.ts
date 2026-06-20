// Auto-generated from employee-tax-calculator-schema.json
import * as z from 'zod';

export interface Employee_tax_calculatorInput {
  grossSalary: number;
  taxAllowance: number;
  socialSecurityRate: number;
  incomeTaxRate: number;
  dataConfidence?: number;
}

export const Employee_tax_calculatorInputSchema = z.object({
  grossSalary: z.number().default(5000),
  taxAllowance: z.number().default(1000),
  socialSecurityRate: z.number().default(5),
  incomeTaxRate: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Employee_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossSalary - (input.grossSalary - input.taxAllowance) * (input.incomeTaxRate / 100) - input.grossSalary * (input.socialSecurityRate / 100); results["netSalary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netSalary"] = Number.NaN; }
  try { const v = (input.grossSalary - input.taxAllowance) * (input.incomeTaxRate / 100); results["incomeTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["incomeTax"] = Number.NaN; }
  try { const v = input.grossSalary * (input.socialSecurityRate / 100); results["socialSecurity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["socialSecurity"] = Number.NaN; }
  return results;
}


export function calculateEmployee_tax_calculator(input: Employee_tax_calculatorInput): Employee_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netSalary"]);
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


export interface Employee_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
