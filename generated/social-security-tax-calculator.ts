// Auto-generated from social-security-tax-calculator-schema.json
import * as z from 'zod';

export interface Social_security_tax_calculatorInput {
  grossPay: number;
  employeeRate: number;
  employerRate: number;
  annualCeiling: number;
  payPeriods: number;
  dataConfidence?: number;
}

export const Social_security_tax_calculatorInputSchema = z.object({
  grossPay: z.number().default(0),
  employeeRate: z.number().default(6.2),
  employerRate: z.number().default(6.2),
  annualCeiling: z.number().default(160200),
  payPeriods: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Social_security_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.grossPay) * (input.employeeRate) * (input.employerRate) * (input.annualCeiling) * (input.payPeriods); results["perPeriodCeiling"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perPeriodCeiling"] = Number.NaN; }
  try { const v = (input.grossPay) * (input.employeeRate) * (input.employerRate); results["perPeriodCeiling_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perPeriodCeiling_aux"] = Number.NaN; }
  return results;
}


export function calculateSocial_security_tax_calculator(input: Social_security_tax_calculatorInput): Social_security_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["perPeriodCeiling_aux"]);
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


export interface Social_security_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
