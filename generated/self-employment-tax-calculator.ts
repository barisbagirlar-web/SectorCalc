// @ts-nocheck
// Auto-generated from self-employment-tax-calculator-schema.json
import * as z from 'zod';

export interface Self_employment_tax_calculatorInput {
  netEarnings: number;
  socialSecurityRate: number;
  medicareRate: number;
  socialSecurityWageBase: number;
  additionalMedicareThreshold: number;
  additionalMedicareRate: number;
}

export const Self_employment_tax_calculatorInputSchema = z.object({
  netEarnings: z.number().default(50000),
  socialSecurityRate: z.number().default(12.4),
  medicareRate: z.number().default(2.9),
  socialSecurityWageBase: z.number().default(160200),
  additionalMedicareThreshold: z.number().default(200000),
  additionalMedicareRate: z.number().default(0.9),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Self_employment_tax_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.netEarnings * (input.medicareRate / 100); results["medicareTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["medicareTax"] = 0; }
  try { const v = input.netEarnings > input.additionalMedicareThreshold ? (input.netEarnings - input.additionalMedicareThreshold) * (input.additionalMedicareRate / 100) : 0; results["additionalMedicareTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["additionalMedicareTax"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSelf_employment_tax_calculator(input: Self_employment_tax_calculatorInput): Self_employment_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["additionalMedicareTax"]);
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


export interface Self_employment_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
