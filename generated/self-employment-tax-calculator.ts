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

function evaluateAllFormulas(input: Self_employment_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(input.netEarnings, input.socialSecurityWageBase) * (input.socialSecurityRate / 100); results["socialSecurityTax"] = Number.isFinite(v) ? v : 0; } catch { results["socialSecurityTax"] = 0; }
  try { const v = input.netEarnings * (input.medicareRate / 100); results["medicareTax"] = Number.isFinite(v) ? v : 0; } catch { results["medicareTax"] = 0; }
  try { const v = input.netEarnings > input.additionalMedicareThreshold ? (input.netEarnings - input.additionalMedicareThreshold) * (input.additionalMedicareRate / 100) : 0; results["additionalMedicareTax"] = Number.isFinite(v) ? v : 0; } catch { results["additionalMedicareTax"] = 0; }
  try { const v = (results["socialSecurityTax"] ?? 0) + (results["medicareTax"] ?? 0) + (results["additionalMedicareTax"] ?? 0); results["totalSelfEmploymentTax"] = Number.isFinite(v) ? v : 0; } catch { results["totalSelfEmploymentTax"] = 0; }
  return results;
}


export function calculateSelf_employment_tax_calculator(input: Self_employment_tax_calculatorInput): Self_employment_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSelfEmploymentTax"] ?? 0;
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


export interface Self_employment_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
