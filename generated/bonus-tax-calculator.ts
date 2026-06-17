// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bonus_tax_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.bonusAmount * input.federalTaxRate / 100; results["federalTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["federalTax"] = 0; }
  try { const v = input.bonusAmount * input.socialSecurityRate / 100; results["socialSecurityTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["socialSecurityTax"] = 0; }
  try { const v = input.bonusAmount * input.medicareRate / 100; results["medicareTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["medicareTax"] = 0; }
  try { const v = input.bonusAmount * input.stateTaxRate / 100; results["stateTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["stateTax"] = 0; }
  try { const v = (asFormulaNumber(results["federalTax"])) + (asFormulaNumber(results["socialSecurityTax"])) + (asFormulaNumber(results["medicareTax"])) + (asFormulaNumber(results["stateTax"])); results["totalTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTax"] = 0; }
  try { const v = input.bonusAmount - (asFormulaNumber(results["totalTax"])); results["netBonus"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netBonus"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBonus_tax_calculator(input: Bonus_tax_calculatorInput): Bonus_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netBonus"]);
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


export interface Bonus_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
