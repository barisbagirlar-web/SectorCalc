// Auto-generated from bonus-tax-calculator-schema.json
import * as z from 'zod';

export interface Bonus_tax_calculatorInput {
  bonusAmount: number;
  federalTaxRate: number;
  socialSecurityRate: number;
  medicareRate: number;
  stateTaxRate: number;
  dataConfidence?: number;
}

export const Bonus_tax_calculatorInputSchema = z.object({
  bonusAmount: z.number().default(1000),
  federalTaxRate: z.number().default(22),
  socialSecurityRate: z.number().default(6.2),
  medicareRate: z.number().default(1.45),
  stateTaxRate: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bonus_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bonusAmount * input.federalTaxRate / 100; results["federalTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["federalTax"] = Number.NaN; }
  try { const v = input.bonusAmount * input.socialSecurityRate / 100; results["socialSecurityTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["socialSecurityTax"] = Number.NaN; }
  try { const v = input.bonusAmount * input.medicareRate / 100; results["medicareTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["medicareTax"] = Number.NaN; }
  try { const v = input.bonusAmount * input.stateTaxRate / 100; results["stateTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stateTax"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["federalTax"])) + (toNumericFormulaValue(results["socialSecurityTax"])) + (toNumericFormulaValue(results["medicareTax"])) + (toNumericFormulaValue(results["stateTax"])); results["totalTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTax"] = Number.NaN; }
  try { const v = input.bonusAmount - (toNumericFormulaValue(results["totalTax"])); results["netBonus"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netBonus"] = Number.NaN; }
  return results;
}


export function calculateBonus_tax_calculator(input: Bonus_tax_calculatorInput): Bonus_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netBonus"]);
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


export interface Bonus_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
