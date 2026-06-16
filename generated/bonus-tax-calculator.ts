// Auto-generated from bonus-tax-calculator-schema.json
import * as z from 'zod';

export interface Bonus_tax_calculatorInput {
  bonusAmount: number;
  federalTaxRate: number;
  socialSecurityRate: number;
  medicareRate: number;
  stateTaxRate: number;
}

export const Bonus_tax_calculatorInputSchema = z.object({
  bonusAmount: z.number().default(1000),
  federalTaxRate: z.number().default(22),
  socialSecurityRate: z.number().default(6.2),
  medicareRate: z.number().default(1.45),
  stateTaxRate: z.number().default(5),
});

function evaluateAllFormulas(input: Bonus_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bonusAmount * input.federalTaxRate / 100; results["federalTax"] = Number.isFinite(v) ? v : 0; } catch { results["federalTax"] = 0; }
  try { const v = input.bonusAmount * input.socialSecurityRate / 100; results["socialSecurityTax"] = Number.isFinite(v) ? v : 0; } catch { results["socialSecurityTax"] = 0; }
  try { const v = input.bonusAmount * input.medicareRate / 100; results["medicareTax"] = Number.isFinite(v) ? v : 0; } catch { results["medicareTax"] = 0; }
  try { const v = input.bonusAmount * input.stateTaxRate / 100; results["stateTax"] = Number.isFinite(v) ? v : 0; } catch { results["stateTax"] = 0; }
  try { const v = (results["federalTax"] ?? 0) + (results["socialSecurityTax"] ?? 0) + (results["medicareTax"] ?? 0) + (results["stateTax"] ?? 0); results["totalTax"] = Number.isFinite(v) ? v : 0; } catch { results["totalTax"] = 0; }
  try { const v = input.bonusAmount - (results["totalTax"] ?? 0); results["netBonus"] = Number.isFinite(v) ? v : 0; } catch { results["netBonus"] = 0; }
  return results;
}


export function calculateBonus_tax_calculator(input: Bonus_tax_calculatorInput): Bonus_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netBonus"] ?? 0;
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


export interface Bonus_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
